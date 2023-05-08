from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from reworkd_platform.web.api.agent.agent_service.agent_service_provider import \
    get_agent_service
from reworkd_platform.web.api.agent.model_settings import ModelSettings

router = APIRouter()


class AgentRequestBody(BaseModel):
    modelSettings: ModelSettings = ModelSettings()
    goal: str
    language: Optional[str]
    tasks: Optional[List[str]]
    lastTask: Optional[str]
    result: Optional[str]
    completedTasks: Optional[List[str]]


@router.post("/create")
async def create_tasks(request_body: AgentRequestBody) -> dict[str, str]:
    try:
        new_tasks = await get_agent_service().start_goal_agent(
            request_body.modelSettings,
            request_body.goal,
            request_body.language,
        )
        return {"newTasks": new_tasks}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the request. {e}"
        )
