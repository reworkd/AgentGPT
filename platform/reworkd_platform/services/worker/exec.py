from networkx import topological_sort

from reworkd_platform.services.kafka.event_schemas import WorkflowTaskEvent
from reworkd_platform.services.kafka.producers.task_producer import WorkflowTaskProducer
from reworkd_platform.web.api.workflow.schemas import WorkflowFull


class ExecutionEngine:
    def __init__(self, producer: WorkflowTaskProducer, workflow: WorkflowTaskEvent):
        self.producer = producer
        self.workflow = workflow

    async def start(self) -> None:
        await self.producer.send(event=self.workflow)

    async def loop(self) -> None:
        if not self.workflow.queue:
            pass

        curr = self.workflow.queue.pop(0)
        # TODO: do work

        await self.start()

    @classmethod
    def create_execution_plan(
        cls, producer: WorkflowTaskProducer, workflow: WorkflowFull
    ) -> "ExecutionEngine":
        graph = workflow.to_graph()
        nodes = [n for n in topological_sort(graph)]

        return cls(
            producer=producer,
            workflow=WorkflowTaskEvent.from_workflow(
                workflow_id=workflow.id,
                user_id=workflow.user_id,
                work_queue=nodes,
            ),
        )
