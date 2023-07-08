from aiokafka import ConsumerRecord
from loguru import logger

from reworkd_platform.services.kafka.consumers.base import AsyncConsumer
from reworkd_platform.services.kafka.event_schemas import WorkflowTaskEvent
from reworkd_platform.services.kafka.lifetime import producer as async_producer
from reworkd_platform.services.kafka.producers.task_producer import WorkflowTaskProducer
from reworkd_platform.services.worker.exec import ExecutionEngine


class WorkflowTaskConsumer(AsyncConsumer):
    def __init__(
        self,
        producer: WorkflowTaskProducer,
    ):
        super().__init__("workflow_task")
        self.producer = producer

    @classmethod
    async def create(cls) -> "AsyncConsumer":
        assert async_producer, "Producer must be started before consumer"

        return await cls(
            producer=WorkflowTaskProducer(async_producer),
        ).start()

    async def on_message(self, record: ConsumerRecord) -> None:
        workflow = WorkflowTaskEvent(**record.value)
        logger.info(f"Received message: {workflow}")

        engine = ExecutionEngine(self.producer, workflow)
        await engine.loop()
