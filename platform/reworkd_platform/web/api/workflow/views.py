from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from reworkd_platform.db.crud.workflow import WorkflowCRUD
from reworkd_platform.schemas.workflow.base import (
    BlockIOBase,
    Workflow,
    WorkflowCreate,
    WorkflowFull,
    WorkflowUpdate,
)
from reworkd_platform.services.aws.s3 import PresignedPost, SimpleStorageService
from reworkd_platform.services.kafka.producers.task_producer import WorkflowTaskProducer
from reworkd_platform.services.networkx import validate_connected_and_acyclic
from reworkd_platform.services.sockets import websockets
from reworkd_platform.services.worker.execution_engine import ExecutionEngine
from reworkd_platform.web.api.http_responses import forbidden

router = APIRouter()


@router.get("")
async def get_all(crud: WorkflowCRUD = Depends(WorkflowCRUD.inject)) -> List[Workflow]:
    """Get all workflows."""
    return await crud.get_all()


@router.post("")
async def create_workflow(
    body: WorkflowCreate,
    crud: WorkflowCRUD = Depends(WorkflowCRUD.inject),
) -> Workflow:
    """Create a new workflow."""
    return await crud.create(body)


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
) -> None:
    try:
        validate_connected_and_acyclic(workflow.to_graph())
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    await crud.update(workflow_id, workflow)
    websockets.emit(workflow_id, "workflow:updated", {"user_id": crud.user.id})


class Filenames(BaseModel):
    files: List[str]


@router.put("/{workflow_id}/block/{block_id}/upload")
def upload_block(
    workflow_id: str,
    block_id: str,
    body: Filenames,
) -> Dict[str, PresignedPost]:
    """Upload a file to a block"""
    return {
        file: SimpleStorageService().upload_url(
            bucket_name="test-pdf-123",
            object_name=f"{workflow_id}/{block_id}/{file}",
        )
        for file in body.files
    }


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


class APITriggerInput(BaseModel):
    message: str


@router.post("/{workflow_id}/api")
async def trigger_workflow_api(
    workflow_id: str,
    body: APITriggerInput,
    producer: WorkflowTaskProducer = Depends(WorkflowTaskProducer.inject),
    crud: WorkflowCRUD = Depends(WorkflowCRUD.inject),
) -> str:
    """Trigger a workflow that takes an APITrigger as an input."""
    # TODO: Validate user API key has access to run workflow
    workflow = await crud.get(workflow_id)

    plan = ExecutionEngine.create_execution_plan(
        producer=producer,
        workflow=workflow,
    )

    if plan.workflow.queue[0].block.type == "APITriggerBlock":
        forbidden("API trigger not defined for this workflow")

    # Place input from API call into trigger input
    plan.workflow.queue[0].block.input = BlockIOBase(**body.dict())

    await plan.start()
    return "OK"
