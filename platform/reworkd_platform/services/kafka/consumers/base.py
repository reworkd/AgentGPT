import asyncio
import json
from abc import ABC, abstractmethod
from typing import Any, Protocol

from aiokafka import AIOKafkaConsumer, ConsumerRecord, TopicPartition
from kafka.errors import IllegalStateError
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
    MAX_POLL_INTERVAL_MS = 5 * 60 * 1000
    SESSION_TIMEOUT_MS = 2 * 60 * 1000
    HEARTBEAT_INTERVAL_MS = SESSION_TIMEOUT_MS // 3

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
            enable_auto_commit=False,
            auto_offset_reset="latest",
            value_deserializer=deserializer.deserialize,
            max_poll_interval_ms=self.MAX_POLL_INTERVAL_MS,
            session_timeout_ms=self.SESSION_TIMEOUT_MS,
            heartbeat_interval_ms=self.HEARTBEAT_INTERVAL_MS,
        )

    async def start(self) -> "AsyncConsumer":
        if not self._consumer:
            logger.warning("Kafka consumer is not enabled")
            return self

        consumer: AIOKafkaConsumer = self._consumer

        async def consumer_loop() -> None:
            await consumer.start()

            msg: ConsumerRecord
            async for msg in consumer:
                print(f"Consuming: {msg.topic}/{msg.partition}/{msg.offset}")
                tp = TopicPartition(topic=msg.topic, partition=msg.partition)
                await consumer.commit({tp: msg.offset + 1})

                if self.should_skip(msg):
                    logger.info(f"Skipping message: {msg.headers}")
                    continue

                try:
                    await self.on_message(msg)
                except Exception as e:
                    logger.exception(e)

            await consumer.stop()

        asyncio.get_event_loop().create_task(consumer_loop())
        return self

    async def stop(self) -> None:
        if not self._consumer:
            return

        try:
            await self._consumer.stop()
        except IllegalStateError:
            logger.warning("Kafka consumer is already stopped")

    def should_skip(self, record: ConsumerRecord) -> bool:
        """
        Skip processing a message if in dev node and
        the message is not produced by the current host.
        """
        # return True
        return (
            self._env == "development"
            and ("host", self._group.encode("utf-8")) not in record.headers
        )

    @abstractmethod
    async def on_message(self, record: ConsumerRecord) -> None:
        raise NotImplementedError("You must implement on_message method")
