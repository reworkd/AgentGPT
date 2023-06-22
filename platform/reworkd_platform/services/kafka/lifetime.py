from aiokafka import AIOKafkaProducer
from fastapi import FastAPI

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
    app.state.kafka_producer = AIOKafkaProducer(
        bootstrap_servers=settings.kafka_bootstrap_servers,
    )
    await app.state.kafka_producer.start()


async def shutdown_kafka(app: FastAPI) -> None:  # pragma: no cover
    """
    Shutdown kafka client.

    This function closes all connections
    and sends all pending data to kafka.

    :param app: current application.
    """
    await app.state.kafka_producer.stop()
