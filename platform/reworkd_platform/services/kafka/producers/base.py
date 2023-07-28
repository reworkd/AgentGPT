from typing import Literal

from aiokafka import AIOKafkaProducer
from loguru import logger
from pydantic import BaseModel

from reworkd_platform.services.ssl import get_ssl_context
from reworkd_platform.settings import Settings

TOPICS = Literal["workflow_task"]


class AsyncProducer:
    def __init__(self, settings: Settings):
        self._producer = settings.kafka_enabled and AIOKafkaProducer(
            bootstrap_servers=settings.kafka_bootstrap_servers,
            client_id=settings.kafka_consumer_group,
            sasl_mechanism=settings.kafka_ssal_mechanism,
            security_protocol="SASL_SSL",
            sasl_plain_username=settings.kafka_username,
            sasl_plain_password=settings.kafka_password,
            ssl_context=get_ssl_context(settings),
        )

        self._headers = (
            [("host", settings.kafka_consumer_group.encode("utf-8"))]
            if settings.environment == "development"
            else None
        )

    @classmethod
    async def create(cls, settings: Settings) -> "AsyncProducer":
        return await cls(settings).start()

    async def start(self) -> "AsyncProducer":
        self._producer and await self._producer.start()
        return self

    async def stop(self) -> None:
        self._producer and await self._producer.stop()

    async def produce(self, topic: TOPICS, data: BaseModel) -> None:
        if not self._producer:
            logger.warning("Kafka producer is not enabled")
            logger.info(f"Would have produced {data.json()}")
            return

        await self._producer.send(
            topic=topic,
            value=data.json().encode("utf-8"),
            headers=self._headers,
        )
