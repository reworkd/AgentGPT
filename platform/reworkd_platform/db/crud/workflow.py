import asyncio
from typing import List, Dict, Set

from fastapi import Depends
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from reworkd_platform.db.crud.base import BaseCrud
from reworkd_platform.db.dependencies import get_db_session
from reworkd_platform.db.models.workflow import (
    WorkflowModel,
    WorkflowNodeModel,
    WorkflowEdgeModel,
)
from reworkd_platform.schemas import UserBase
from reworkd_platform.web.api.dependencies import get_current_user
from reworkd_platform.web.api.workflow.schemas import (
    Workflow,
    WorkflowFull,
    WorkflowUpdate,
    EdgeUpsert,
)


class WorkflowCRUD(BaseCrud):
    def __init__(self, session: AsyncSession, user: UserBase):
        super().__init__(session)
        self.user = user

    @staticmethod
    def inject(
        session: AsyncSession = Depends(get_db_session),
        user: UserBase = Depends(get_current_user),
    ) -> "WorkflowCRUD":
        return WorkflowCRUD(session, user)

    async def get_all(self) -> List[Workflow]:
        query = select(WorkflowModel).where(WorkflowModel.user_id == self.user.id)
        return [
            workflow.to_schema()
            for workflow in (await self.session.execute(query)).scalars().all()
        ]

    async def get(self, workflow_id: str) -> WorkflowFull:
        # TODO: use co-routines to make this faster
        workflow, nodes, edges = await asyncio.gather(
            WorkflowModel.get_or_404(self.session, workflow_id),
            self.get_nodes(workflow_id),
            self.get_edges(workflow_id),
        )
        # TODO: make dict values a valid list
        return WorkflowFull(
            **workflow.to_schema().dict(),
            nodes=[node.to_schema() for node in nodes.values()],
            edges=[edge.to_schema() for edge in edges.values()],
        )

    async def create(self, name: str, description: str) -> Workflow:
        return (
            await WorkflowModel(
                user_id=self.user.id,
                organization_id=None,  # TODO: add organization_id
                name=name,
                description=description,
            ).save(self.session)
        ).to_schema()

    async def update(self, workflow_id: str, workflow_update: WorkflowUpdate) -> str:
        workflow, all_nodes, all_edges = await asyncio.gather(
            WorkflowModel.get_or_404(self.session, workflow_id),
            self.get_nodes(workflow_id),
            self.get_edges(workflow_id),
        )

        node_ids = {n.id for n in workflow_update.nodes}
        ref_to_id: Dict[str, str] = {}

        # TODO: use co-routines to make this faster
        for n in workflow_update.nodes:
            if not n.id:
                node = await WorkflowNodeModel(
                    workflow_id=workflow_id,
                    id=n.id,
                    ref=n.ref,
                    pos_x=n.pos_x,
                    pos_y=n.pos_y,
                ).save(self.session)
                ref_to_id[node.ref] = node.id

            elif n.id not in all_nodes:
                raise Exception("Node not found")

            else:
                node = all_nodes[n.id]
                node.pos_x = n.pos_x
                node.pos_y = n.pos_y
                await node.save(self.session)

        [
            await node.mark_deleted().save(self.session)
            for node in all_nodes.values()
            if node.id not in node_ids
        ]

        edge_service = EdgeService()
        [edge_service.add_edge(e.source, e.target) for e in all_edges.values()]

        for e in workflow_update.edges:
            if edge_service.add_edge(e.source, e.target):
                await WorkflowEdgeModel(
                    workflow_id=workflow_id,
                    source=ref_to_id.get(e.source, e.source),
                    target=ref_to_id.get(e.target, e.target),
                ).save(self.session)

        edge_service = EdgeService()
        edge_service.add_all(workflow_update.edges)
        [
            await edge.delete(self.session)
            for edge in all_edges.values()
            if edge_service.add_edge(edge.source, edge.target)
        ]

        return "OK"

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

    async def get_edges(self, workflow_id: str) -> Dict[str, WorkflowEdgeModel]:
        query = select(WorkflowEdgeModel).where(
            WorkflowEdgeModel.workflow_id == workflow_id
        )

        return {
            edge.id: edge
            for edge in (await self.session.execute(query)).scalars().all()
        }


class EdgeService:
    def __init__(self) -> None:
        self.source_target_map: Dict[str, Set[str]] = {}

    def add_edge(self, source: str, target: str) -> bool:
        if source not in self.source_target_map:
            self.source_target_map[source] = set()

        targets = self.source_target_map[source]
        if target in targets:
            return False

        targets.add(target)
        return True

    def add_all(self, edges: List[EdgeUpsert]) -> None:
        for e in edges:
            self.add_edge(e.source, e.target)
