import re
from collections import deque
from typing import Any, Dict, List, cast

from loguru import logger
from networkx import topological_sort

from reworkd_platform.schemas.workflow.base import (
    Block,
    BlockIOBase,
    Node,
    WorkflowFull,
)
from reworkd_platform.schemas.workflow.blocks.conditions.if_condition import (
    IfCondition,
    IfOutput,
)
from reworkd_platform.services.kafka.event_schemas import WorkflowTaskEvent
from reworkd_platform.services.kafka.producers.task_producer import WorkflowTaskProducer
from reworkd_platform.services.worker.workflow_status import websocket_status
from reworkd_platform.web.api.workflow.blocks.web import get_block_runner


class ExecutionEngine:
    def __init__(self, producer: WorkflowTaskProducer, workflow: WorkflowTaskEvent):
        self.producer = producer
        self.workflow = workflow

    async def start(self) -> None:
        await self.producer.send(event=self.workflow)

    @websocket_status
    async def loop(self) -> None:
        curr = self.workflow.queue.pop(0)
        logger.info(f"Running task: {curr}")

        curr.block = replace_templates(curr.block, self.workflow.outputs)

        runner = get_block_runner(curr.block)
        outputs = await runner.run(
            self.workflow.workflow_id, credentials=self.workflow.credentials
        )

        # Place outputs in workflow
        outputs_with_key = {
            get_template(curr.id, key): value for key, value in outputs.dict().items()
        }
        self.workflow.outputs.update(outputs_with_key)

        # Handle if nodes
        if isinstance(runner, IfCondition):
            self.workflow.queue = self.get_pruned_queue(
                curr, (cast(IfOutput, outputs)).result
            )

        # Run next task
        if self.workflow.queue:
            await self.start()
        else:
            logger.info("Workflow complete")

    @classmethod
    def create_execution_plan(
        cls,
        producer: WorkflowTaskProducer,
        workflow: WorkflowFull,
        credentials: Dict[str, str],
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
                edges=workflow.edges,
                credentials=credentials,
            ),
        )

    def bfs_keep(self, node_ids_to_keep: List[str]) -> List[Node]:
        visited = set(node_ids_to_keep)
        queue = deque(node_ids_to_keep)

        while queue:
            node_id = queue.popleft()

            edges = [edge for edge in self.workflow.edges if edge.source == node_id]
            for edge in edges:
                if edge.target not in visited:
                    visited.add(edge.target)
                    queue.append(edge.target)

        return [node for node in self.workflow.queue if node.id in visited]

    def get_pruned_queue(self, if_node: Node, branch: bool) -> List[Node]:
        """
        Prune the queue of nodes to only include nodes that are reachable from the
        current branch of the if condition.
        """
        source_handle = "true" if branch else "false"

        if_node_edges = [
            edge for edge in self.workflow.edges if edge.source == if_node.id
        ]

        node_ids_to_keep = [
            edge.target for edge in if_node_edges if edge.source_handle == source_handle
        ]

        return self.bfs_keep(node_ids_to_keep)


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
