from typing import Dict, List, Optional, Set, Tuple, Union

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from reworkd_platform.db.models.workflow import WorkflowEdgeModel
from reworkd_platform.schemas.workflow.base import EdgeUpsert


class EdgeCRUD:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.source_to_target_and_handle_map: Dict[
            str, Set[Tuple[str, Optional[str]]]
        ] = {}

    def add_edge(self, e: Union[WorkflowEdgeModel, EdgeUpsert]) -> bool:
        if e.source not in self.source_to_target_and_handle_map:
            self.source_to_target_and_handle_map[e.source] = set()

        target_handle_pair = (e.target, e.source_handle)
        targets = self.source_to_target_and_handle_map[e.source]
        if target_handle_pair in targets:
            return False

        targets.add(target_handle_pair)
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
            source_handle=edge_upsert.source_handle,
            target=edge_upsert.target,
        ).save(self.session)

    async def delete_old_edges(
        self, edges_to_keep: List[EdgeUpsert], all_edges: Dict[str, WorkflowEdgeModel]
    ) -> None:
        edges_to_keep_ids = {e.id for e in edges_to_keep}

        for edge in all_edges.values():
            if edge.id not in edges_to_keep_ids:
                await edge.delete(self.session)
