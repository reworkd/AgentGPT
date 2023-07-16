from fastapi import Depends

from reworkd_platform.services.kafka.dependencies import get_kafka_producer
from reworkd_platform.services.kafka.event_schemas import (
    WorkflowTaskEvent,
)
from reworkd_platform.services.kafka.producers.base import AsyncProducer


class WorkflowTaskProducer:
    TOPIC = "workflow_task"

    def __init__(self, producer: AsyncProducer):
        self.producer = producer

    @staticmethod
    def inject(
        producer: AsyncProducer = Depends(get_kafka_producer),
    ) -> "WorkflowTaskProducer":
        return WorkflowTaskProducer(
            producer=producer,
        )

    async def send(self, *, event: WorkflowTaskEvent) -> WorkflowTaskEvent:
        await self.producer.produce("workflow_task", event)
        return event
