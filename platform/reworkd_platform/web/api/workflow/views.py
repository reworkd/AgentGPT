from typing import List
from uuid import uuid4

from fastapi import APIRouter, Depends

from reworkd_platform.schemas import UserBase
from reworkd_platform.web.api.dependencies import get_current_user
from reworkd_platform.web.api.workflow.schemas import Workflow

router = APIRouter()


@router.get("")
def get_all(user: UserBase = Depends(get_current_user)) -> List[Workflow]:
    """Get all workflows."""
    return [
        Workflow(
            id="1",
            name="Test workflow",
            description="Test workflow description",
        )
    ]


@router.post("")
def create_workflow(user: UserBase = Depends(get_current_user)) -> Workflow:
    """Create a new workflow."""
    return Workflow(
        id=str(uuid4()),
        name="Test workflow",
        description="Test workflow description",
    )
