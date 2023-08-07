import asyncio
from typing import Dict, List

from fastapi import Depends
from sqlalchemy import and_, select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from reworkd_platform.db.crud.base import BaseCrud
from reworkd_platform.db.crud.edge import EdgeCRUD
from reworkd_platform.db.crud.node import NodeCRUD
from reworkd_platform.db.dependencies import get_db_session
from reworkd_platform.db.models.workflow import WorkflowModel
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.schemas.workflow.base import (
    Workflow,
    WorkflowFull,
    WorkflowUpdate,
    WorkflowCreate,
)
from reworkd_platform.web.api.dependencies import get_current_user
from reworkd_platform.web.api.http_responses import forbidden


class WorkflowCRUD(BaseCrud):
    def __init__(self, session: AsyncSession, user: UserBase):
        super().__init__(session)
        self.user = user
        self.node_service = NodeCRUD(session)
        self.edge_service = EdgeCRUD(session)

    @staticmethod
    def inject(
        session: AsyncSession = Depends(get_db_session),
        user: UserBase = Depends(get_current_user),
    ) -> "WorkflowCRUD":
        return WorkflowCRUD(session, user)

    async def get_all(self) -> List[Workflow]:
        query = (
            select(WorkflowModel)
            .where(
                or_(
                    and_(
                        WorkflowModel.user_id == self.user.id,
                        WorkflowModel.organization_id.is_(None),
                        WorkflowModel.delete_date.is_(None),
                    ),
                    and_(
                        WorkflowModel.organization_id == self.user.organization_id,
                        WorkflowModel.organization_id.is_not(None),
                        WorkflowModel.delete_date.is_(None),
                    ),
                )
            )
            .order_by(WorkflowModel.create_date.desc())
        )

        return [
            workflow.to_schema()
            for workflow in (await self.session.execute(query)).scalars().all()
        ]

    async def get(self, workflow_id: str) -> WorkflowFull:
        # fetch workflow, nodes, and edges concurrently
        workflow, nodes, edges = await asyncio.gather(
            WorkflowModel.get_or_404(self.session, workflow_id),
            self.node_service.get_nodes(workflow_id),
            self.edge_service.get_edges(workflow_id),
        )

        self.validate_permissions(workflow)

        # get node blocks
        blocks = await self.node_service.get_node_blocks(
            [node.id for node in nodes.values()]
        )

        node_block_pairs = [(node, blocks.get(node.id)) for node in nodes.values()]

        return WorkflowFull(
            **workflow.to_schema().dict(),
            nodes=[node.to_schema(block) for node, block in node_block_pairs if block],
            edges=[edge.to_schema() for edge in edges.values()],
        )

    async def create(self, workflow_create: WorkflowCreate) -> Workflow:
        return (
            await WorkflowModel(
                user_id=self.user.id,
                organization_id=self.user.organization_id,
                name=workflow_create.name,
                description=workflow_create.description,
            ).save(self.session)
        ).to_schema()

    async def delete(self, workflow_id: str) -> None:
        """Soft a delete workflow"""
        # TODO: Make sure workflow logic doesnt run on deleted workflows
        workflow = await WorkflowModel.get_or_404(self.session, workflow_id)

        self.validate_permissions(workflow)
        await workflow.delete(self.session)

    async def update(self, workflow_id: str, workflow_update: WorkflowUpdate) -> str:
        workflow, all_nodes, all_edges, all_blocks = await asyncio.gather(
            WorkflowModel.get_or_404(self.session, workflow_id),
            self.node_service.get_nodes(workflow_id),
            self.edge_service.get_edges(workflow_id),
            self.node_service.get_node_blocks(
                [node.id for node in workflow_update.nodes if node.id]
            ),
        )

        self.validate_permissions(workflow)

        # TODO: use co-routines to make this faster
        # Map from ref to id so edges can use id's instead of refs
        ref_to_id: Dict[str, str] = {}
        for n in workflow_update.nodes:
            if not n.id:
                node = await self.node_service.create_node_with_block(n, workflow_id)
            elif n.id not in all_nodes:
                raise Exception("Node not found")
            else:
                node = await self.node_service.update_node_with_block(
                    n, all_nodes[n.id], all_blocks[n.id]
                )
            ref_to_id[node.ref] = node.id

        # Delete nodes
        await self.node_service.mark_old_nodes_deleted(workflow_update.nodes, all_nodes)

        # Mark edges as added
        for edge_model in all_edges.values():
            self.edge_service.add_edge(edge_model)

        # Modify the edges' source and target to their corresponding IDs
        for e in workflow_update.edges:
            e.source = ref_to_id.get(e.source, e.source)
            e.target = ref_to_id.get(e.target, e.target)

        # update edges
        for e in workflow_update.edges:
            if self.edge_service.add_edge(e):
                await self.edge_service.create_edge(e, workflow_id)

        # Delete edges
        await self.edge_service.delete_old_edges(workflow_update.edges, all_edges)

        return "OK"

    def validate_permissions(self, workflow: WorkflowModel) -> None:
        if (
            workflow.user_id == self.user.id
            or workflow.organization_id == self.user.organization_id
        ):
            return

        raise forbidden()
