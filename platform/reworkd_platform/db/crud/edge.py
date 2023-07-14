from typing import Dict, List, Set

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from reworkd_platform.db.models.workflow import WorkflowEdgeModel
from reworkd_platform.schemas.workflow.base import EdgeUpsert


class EdgeCRUD:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.source_target_map: Dict[str, Set[str]] = {}

    def add_edge(self, source: str, target: str) -> bool:
        if source not in self.source_target_map:
            self.source_target_map[source] = set()

        targets = self.source_target_map[source]
        if target in targets:
            return False

        targets.add(target)
        return True

    async def get_edges(self, workflow_id: str) -> Dict[str, WorkflowEdgeModel]:
        query = select(WorkflowEdgeModel).where(
            WorkflowEdgeModel.workflow_id == workflow_id
        )

        return {
            edge.id: edge
            for edge in (await self.session.execute(query)).scalars().all()
        }

    async def create_edge(self, edge_upsert: EdgeUpsert, workflow_id: str) -> None:
        await WorkflowEdgeModel(
            workflow_id=workflow_id,
            source=edge_upsert.source,
            target=edge_upsert.target,
        ).save(self.session)

    async def delete_old_edges(
        self, edges_to_keep: List[EdgeUpsert], all_edges: Dict[str, WorkflowEdgeModel]
    ) -> None:
        edges_to_keep_ids = {e.id for e in edges_to_keep}

        for edge in all_edges.values():
            if edge.id not in edges_to_keep_ids:
                await edge.delete(self.session)
