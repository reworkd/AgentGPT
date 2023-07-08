import asyncio
import json
import ssl
from abc import ABC, abstractmethod
from typing import Any, Protocol

from aiokafka import AIOKafkaConsumer, ConsumerRecord

from reworkd_platform.settings import settings


class Deserializer(Protocol):
    def deserialize(self, serialized: bytes) -> Any:
        ...


class JSONDeserializer(Deserializer):
    def deserialize(self, serialized: bytes) -> dict[str, Any]:
        return json.loads(serialized)


class AsyncConsumer(ABC):
    def __init__(self, *topics: Any, deserializer: Deserializer = JSONDeserializer()):
        self.consumer = AIOKafkaConsumer(
            *topics,
            bootstrap_servers=settings.kafka_bootstrap_servers,
            group_id="platform",
            sasl_mechanism=settings.kafka_ssal_mechanism,
            security_protocol="SASL_SSL",
            sasl_plain_username=settings.kafka_username,
            sasl_plain_password=settings.kafka_password,
            ssl_context=ssl.create_default_context(cafile=settings.db_ca_path),
            enable_auto_commit=True,
            auto_offset_reset="earliest",
            value_deserializer=deserializer.deserialize
        )

    async def start(self) -> "AsyncConsumer":
        await self.consumer.start()

        async def consumer_loop() -> None:
            try:
                async for msg in self.consumer:
                    await self.on_message(msg)
            finally:
                await self.consumer.stop()

        asyncio.get_event_loop().create_task(consumer_loop())
        return self

    async def stop(self) -> None:
        await self.consumer.stop()

    @abstractmethod
    async def on_message(self, record: ConsumerRecord) -> None:
        raise NotImplementedError("You must implement on_message method")
