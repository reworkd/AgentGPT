import asyncio
from typing import List

from fastapi import FastAPI

from reworkd_platform.services.kafka.consumers.base import AsyncConsumer
from reworkd_platform.services.kafka.consumers.task_consumer import WorkflowTaskConsumer
from reworkd_platform.services.kafka.producers.base import AsyncProducer
from reworkd_platform.settings import settings


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
    producer = await AsyncProducer.create(settings)
    app.state.kafka_producer = producer

    consumer = await WorkflowTaskConsumer.create(producer)
    app.state.kafka_consumers = [consumer]


async def shutdown_kafka(app: FastAPI) -> None:  # pragma: no cover
    """
    Shutdown kafka client.

    This function closes all connections
    and sends all pending data to kafka.

    :param app: current application.
    """
    await app.state.kafka_producer.stop()

    consumers: List[AsyncConsumer] = app.state.kafka_consumers
    await asyncio.gather(*[consumer.stop() for consumer in consumers])
