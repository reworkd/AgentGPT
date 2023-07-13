from loguru import logger
from networkx import topological_sort

from reworkd_platform.schemas.workflow.base import WorkflowFull
from reworkd_platform.services.kafka.event_schemas import WorkflowTaskEvent
from reworkd_platform.services.kafka.producers.task_producer import WorkflowTaskProducer
from reworkd_platform.services.sockets import websockets
from reworkd_platform.web.api.workflow.blocks.web import get_block_runner


class ExecutionEngine:
    def __init__(self, producer: WorkflowTaskProducer, workflow: WorkflowTaskEvent):
        self.producer = producer
        self.workflow = workflow

    async def start(self) -> None:
        await self.producer.send(event=self.workflow)

    async def loop(self) -> None:
        curr = self.workflow.queue.pop(0)
        logger.info(f"Running task: {curr.ref}")

        websockets.emit(
            self.workflow.workflow_id,
            "my-event",
            {"nodeId": curr.id, "status": "running"},
        )

        runner = get_block_runner(curr.block)
        await runner.run()

        websockets.emit(
            self.workflow.workflow_id,
            "my-event",
            {"nodeId": curr.id, "status": "success"},
        )

        if self.workflow.queue:
            await self.start()

    @classmethod
    def create_execution_plan(
        cls, producer: WorkflowTaskProducer, workflow: WorkflowFull
    ) -> "ExecutionEngine":
        node_map = {n.id: n for n in workflow.nodes}

        graph = workflow.to_graph()
        sorted_nodes = [node_map[n] for n in topological_sort(graph)]

        return cls(
            producer=producer,
            workflow=WorkflowTaskEvent.from_workflow(
                workflow_id=workflow.id,
                user_id=workflow.user_id,
                work_queue=sorted_nodes,
            ),
        )
