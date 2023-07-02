from typing import List

from fastapi import APIRouter, Depends

from reworkd_platform.db.crud.workflow import WorkflowCRUD
from reworkd_platform.web.api.workflow.schemas import (
    Workflow,
    WorkflowUpdate,
    WorkflowFull,
)

router = APIRouter()


@router.get("")
async def get_all(crud: WorkflowCRUD = Depends(WorkflowCRUD.inject)) -> List[Workflow]:
    """Get all workflows."""
    return await crud.get_all()


@router.post("")
async def create_workflow(
    crud: WorkflowCRUD = Depends(WorkflowCRUD.inject),
) -> Workflow:
    """Create a new workflow."""
    return await crud.create(
        name="Test workflow",
        description="Test workflow description",
    )


@router.get("/{workflow_id}")
async def get_workflow(
    workflow_id: str,
    crud: WorkflowCRUD = Depends(WorkflowCRUD.inject),
) -> WorkflowFull:
    """Get a workflow by id."""
    return await crud.get(workflow_id)


@router.put("/{workflow_id}")
async def update_workflow(
    workflow_id: str,
    workflow: WorkflowUpdate,
    crud: WorkflowCRUD = Depends(WorkflowCRUD.inject),
) -> str:
    """Update a workflow by id."""
    return await crud.update(workflow_id, workflow)
