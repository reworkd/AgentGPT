from typing import Any, Dict, List

from pydantic import BaseModel

from reworkd_platform.schemas.workflow.base import Edge, Node


class WorkflowTaskEvent(BaseModel):
    workflow_id: str
    user_id: str

    queue: List[Node]
    edges: List[Edge]
    outputs: Dict[str, Any]
    credentials: Dict[str, str]

    @classmethod
    def from_workflow(
        cls,
        workflow_id: str,
        user_id: str,
        work_queue: List[Node],
        edges: List[Edge],
        credentials: Dict[str, str],
    ) -> "WorkflowTaskEvent":
        return cls(
            workflow_id=workflow_id,
            user_id=user_id,
            queue=work_queue,
            edges=edges,
            outputs={},
            credentials=credentials,
        )
