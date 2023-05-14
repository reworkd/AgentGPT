from typing import List, Optional

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from reworkd_platform.web.api.agent.agent_service.agent_service_provider import (
    get_agent_service,
)
from reworkd_platform.web.api.agent.analysis import Analysis
from reworkd_platform.web.api.agent.model_settings import ModelSettings
from reworkd_platform.web.api.agent.tools.wikipedia_search import Wikipedia

router = APIRouter()


class AgentRequestBody(BaseModel):
    modelSettings: ModelSettings = ModelSettings()
    goal: str
    language: Optional[str] = "English"
    task: Optional[str]
    analysis: Optional[Analysis]
    tasks: Optional[List[str]]
    lastTask: Optional[str]
    result: Optional[str]
    completedTasks: Optional[List[str]]


class NewTasksResponse(BaseModel):
    newTasks: List[str]


@router.post("/start")
async def start(res: Request) -> NewTasksResponse:
    data = AgentRequestBody.parse_obj(await res.json())

    try:
        new_tasks = await get_agent_service().start_goal_agent(
            data.modelSettings, data.goal, data.language
        )
        return NewTasksResponse(newTasks=new_tasks)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the request. {error}",
        )


@router.post("/analyze")
async def analyze_task(res: Request) -> Analysis:
    data = AgentRequestBody.parse_obj(await res.json())

    try:
        return await get_agent_service().analyze_task_agent(
            data.modelSettings,
            data.goal,
            data.task,
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the request. {error}",
        )


class Wiki(BaseModel):
    goal: str
    task: str
    query: str


@router.post("/test-wiki-search")
async def wiki(req: Wiki) -> str:
    return Wikipedia({}).call(req.goal, req.task, req.query)


class CompletionResponse(BaseModel):
    response: str


@router.post("/execute")
async def execute_task(res: Request) -> CompletionResponse:
    data = AgentRequestBody.parse_obj(json_)

    try:
        response = await get_agent_service().execute_task_agent(
            data.modelSettings,
            data.goal,
            data.language,
            data.task,
            data.analysis,
        )
        return CompletionResponse(response=response)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the request. {error}",
        )


@router.post("/create")
async def create_tasks(res: Request) -> NewTasksResponse:
    data = AgentRequestBody.parse_obj(json_)

    try:
        new_tasks = await get_agent_service().create_tasks_agent(
            data.modelSettings,
            data.goal,
            data.language,
            data.tasks,
            data.lastTask,
            data.result,
            data.completedTasks,
        )
        return NewTasksResponse(newTasks=new_tasks)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the request. {error}",
        )
