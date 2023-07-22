import asyncio
import json
from abc import ABC, abstractmethod
from typing import Any, Protocol

from aiokafka import AIOKafkaConsumer, ConsumerRecord
from loguru import logger

from reworkd_platform.services.ssl import get_ssl_context
from reworkd_platform.settings import Settings


class Deserializer(Protocol):
    def deserialize(self, serialized: bytes) -> Any:
        ...


class JSONDeserializer(Deserializer):
    def deserialize(self, serialized: bytes) -> dict[str, Any]:
        return json.loads(serialized)


class AsyncConsumer(ABC):
    def __init__(
        self,
        *topics: Any,
        settings: Settings,
        deserializer: Deserializer = JSONDeserializer(),
    ):
        self._group = settings.kafka_consumer_group
        self._env = settings.environment
        self._consumer = settings.kafka_enabled and AIOKafkaConsumer(
            *topics,
            bootstrap_servers=settings.kafka_bootstrap_servers,
            client_id=settings.kafka_consumer_group,
            group_id=settings.kafka_consumer_group,
            sasl_mechanism=settings.kafka_ssal_mechanism,
            security_protocol="SASL_SSL",
            sasl_plain_username=settings.kafka_username,
            sasl_plain_password=settings.kafka_password,
            ssl_context=get_ssl_context(settings),
            enable_auto_commit=True,
            auto_offset_reset="earliest",
            value_deserializer=deserializer.deserialize,
        )

    async def start(self) -> "AsyncConsumer":
        if not self._consumer:
            logger.warning("Kafka consumer is not enabled")
            return self

        consumer: AIOKafkaConsumer = self._consumer
        await consumer.start()

        async def consumer_loop() -> None:
            async for msg in consumer:
                if self.should_skip(msg):
                    logger.info(f"Skipping message: {msg.headers}")
                    continue

                try:
                    await self.on_message(msg)
                except Exception as e:
                    logger.exception(e)

        asyncio.get_event_loop().create_task(consumer_loop())
        return self

    async def stop(self) -> None:
        if not self._consumer:
            return

        await self._consumer.stop()

    def should_skip(self, record: ConsumerRecord) -> bool:
        """
        Skip processing a message if in dev node and
        the message is not produced by the current host.
        """
        return (
            self._env == "development"
            and ("host", self._group.encode("utf-8")) not in record.headers
        )

    @abstractmethod
    async def on_message(self, record: ConsumerRecord) -> None:
        raise NotImplementedError("You must implement on_message method")
