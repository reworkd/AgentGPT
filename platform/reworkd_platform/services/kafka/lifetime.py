from typing import Optional

from fastapi import FastAPI

from reworkd_platform.services.kafka.producers.base import AsyncProducer
from reworkd_platform.settings import settings

producer: Optional[AsyncProducer] = None


async def init_kafka(app: FastAPI) -> None:  # pragma: no cover
    """
    Initialize kafka producer.

    This function creates producer
    and makes initial connection to
    the kafka cluster. After that you
    can use producer stored in state.

    We don't need to use pools here,
    because aiokafka has implicit pool
    inside the producer.

    :param app: current application.
    """
    global producer
    producer = await AsyncProducer.create(settings)
    app.state.kafka_producer = producer


async def shutdown_kafka(app: FastAPI) -> None:  # pragma: no cover
    """
    Shutdown kafka client.

    This function closes all connections
    and sends all pending data to kafka.

    :param app: current application.
    """
    await app.state.kafka_producer.stop()
