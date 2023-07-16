from typing import Dict, List

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from reworkd_platform.db.models.workflow import NodeBlockModel, WorkflowNodeModel
from reworkd_platform.schemas.workflow.base import NodeUpsert


class NodeCRUD:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_nodes(self, workflow_id: str) -> Dict[str, WorkflowNodeModel]:
        query = select(WorkflowNodeModel).where(
            and_(
                WorkflowNodeModel.workflow_id == workflow_id,
                WorkflowNodeModel.delete_date.is_(None),
            )
        )

        return {
            node.id: node
            for node in (await self.session.execute(query)).scalars().all()
        }

    async def get_node_blocks(self, node_ids: List[str]) -> Dict[str, NodeBlockModel]:
        """
        Returns an object mapping node_id to NodeBlockModel
        """
        query = select(NodeBlockModel).where(
            NodeBlockModel.node_id.in_(node_ids),
        )

        return {
            block.node_id: block
            for block in (await self.session.execute(query)).scalars().all()
        }

    async def create_node_with_block(
        self, n: NodeUpsert, workflow_id: str
    ) -> WorkflowNodeModel:
        node = await WorkflowNodeModel(
            workflow_id=workflow_id,
            id=n.id,
            ref=n.ref,
            pos_x=n.pos_x,
            pos_y=n.pos_y,
        ).save(self.session)

        await NodeBlockModel(
            node_id=node.id,
            type=n.block.type,
            input=n.block.input.dict(),
        ).save(self.session)

        return node

    async def update_node_with_block(
        self,
        node: NodeUpsert,
        existing_node: WorkflowNodeModel,
        existing_block: NodeBlockModel,
    ) -> WorkflowNodeModel:
        existing_node.pos_x = node.pos_x
        existing_node.pos_y = node.pos_y
        await existing_node.save(self.session)

        existing_block.type = node.block.type
        existing_block.input = node.block.input.dict()
        await existing_block.save(self.session)
        return existing_node

    async def mark_old_nodes_deleted(
        self,
        nodes: List[NodeUpsert],
        all_nodes: Dict[str, WorkflowNodeModel],
    ) -> None:
        node_ids = {n.id for n in nodes}
        for node in all_nodes.values():
            if node.id not in node_ids:
                await node.delete(self.session)
