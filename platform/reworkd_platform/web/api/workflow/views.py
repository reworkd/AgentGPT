from typing import List

from fastapi import APIRouter, Depends, HTTPException

from reworkd_platform.db.crud.workflow import WorkflowCRUD
from reworkd_platform.schemas.workflow.base import (
    Workflow,
    WorkflowUpdate,
    WorkflowFull,
)
from reworkd_platform.services.kafka.producers.task_producer import WorkflowTaskProducer
from reworkd_platform.services.networkx import validate_connected_and_acyclic
from reworkd_platform.services.worker.exec import ExecutionEngine

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
    try:
        validate_connected_and_acyclic(workflow.to_graph())
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return await crud.update(workflow_id, workflow)


@router.delete("/{workflow_id}")
async def delete_workflow(
    workflow_id: str,
    crud: WorkflowCRUD = Depends(WorkflowCRUD.inject),
) -> None:
    """Delete a workflow by id."""
    await crud.delete(workflow_id)


@router.post("/{workflow_id}/execute")
async def trigger_workflow(
    workflow_id: str,
    producer: WorkflowTaskProducer = Depends(WorkflowTaskProducer.inject),
    crud: WorkflowCRUD = Depends(WorkflowCRUD.inject),
) -> str:
    """Trigger a workflow by id."""
    workflow = await crud.get(workflow_id)

    await ExecutionEngine.create_execution_plan(
        producer=producer,
        workflow=workflow,
    ).start()

    return "OK"
