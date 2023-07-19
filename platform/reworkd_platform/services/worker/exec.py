import re
from typing import Any, Dict

from loguru import logger
from networkx import topological_sort

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase, WorkflowFull
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
        logger.info(f"Running task: {curr}")

        websockets.emit(
            self.workflow.workflow_id,
            "my-event",
            {
                "nodeId": curr.id, 
                "status": "running",
            },
        )

        curr.block = replace_templates(curr.block, self.workflow.outputs)

        runner = get_block_runner(curr.block)
        outputs = await runner.run()

        # Place outputs in workflow
        outputs_with_key = {
            get_template(curr.id, key): value for key, value in outputs.dict().items()
        }
        self.workflow.outputs.update(outputs_with_key)

        websockets.emit(
            self.workflow.workflow_id,
            "my-event",
            {
                "nodeId": curr.id,
                "status": "success",
                "remaining": len(self.workflow.queue),
            },
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


TEMPLATE_PATTERN = r"\{\{(?P<id>[\w\d\-]+)\.(?P<key>[\w\d\-]+)\}\}"


def get_template(key: str, value: str) -> str:
    return f"{{{{{key}.{value}}}}}"


def replace_templates(block: Block, outputs: Dict[str, Any]) -> Block:
    block_input = block.input.dict()

    for key, value in block.input.dict().items():
        matches = re.finditer(TEMPLATE_PATTERN, value)

        for match in matches:
            full_match = match.group(0)
            block_id = match.group("id")
            block_key = match.group("key")

            matched_key = get_template(block_id, block_key)

            if matched_key in outputs.keys():
                value = value.replace(full_match, str(outputs[matched_key]))
            else:
                raise RuntimeError(f"Unable to replace template: {full_match}")

        block_input[key] = value

    block.input = BlockIOBase(**block_input)
    return block
