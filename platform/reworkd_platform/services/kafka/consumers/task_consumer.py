from aiokafka import ConsumerRecord

from reworkd_platform.services.kafka.consumers.base import AsyncConsumer
from reworkd_platform.services.kafka.event_schemas import WorkflowTaskEvent
from reworkd_platform.services.kafka.producers.base import AsyncProducer
from reworkd_platform.services.kafka.producers.task_producer import WorkflowTaskProducer
from reworkd_platform.services.worker.execution_engine import ExecutionEngine
from reworkd_platform.settings import settings


class WorkflowTaskConsumer(AsyncConsumer):
    def __init__(
        self,
        producer: WorkflowTaskProducer,
    ):
        super().__init__("workflow_task", settings=settings)
        self.producer = producer

    @classmethod
    async def create(cls, async_producer: AsyncProducer) -> "AsyncConsumer":
        assert async_producer, "Producer must be started before consumer"

        return await cls(
            producer=WorkflowTaskProducer(async_producer),
        ).start()

    async def on_message(self, record: ConsumerRecord) -> None:
        workflow = WorkflowTaskEvent(**record.value)

        engine = ExecutionEngine(self.producer, workflow)
        await engine.loop()
