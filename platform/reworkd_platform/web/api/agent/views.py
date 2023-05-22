from typing import List, Optional

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel

from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.agent_service.agent_service_provider import (
    get_agent_service,
)
from reworkd_platform.web.api.agent.analysis import Analysis
from reworkd_platform.web.api.agent.model_settings import ModelSettings
from reworkd_platform.web.api.agent.tools.tools import get_external_tools, get_tool_name

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
async def create_tasks(
    request_body: AgentRequestBody = Body(
        example={
            "goal": "Create business plan for a bagel company",
            "task": "Identify the most common bagel shapes",
        }
    ),
) -> NewTasksResponse:
    try:
        new_tasks = await get_agent_service().start_goal_agent(
            request_body.modelSettings, request_body.goal, request_body.language
        )
        return NewTasksResponse(newTasks=new_tasks)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the request. {error}",
        )


@router.post("/analyze")
async def create_tasks(
    request_body: AgentRequestBody,
) -> Analysis:
    try:
        return await get_agent_service().analyze_task_agent(
            request_body.modelSettings,
            request_body.goal,
            request_body.task,
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
    return settings.frontend_url


class CompletionResponse(BaseModel):
    response: str


@router.post("/execute")
async def create_tasks(
    request_body: AgentRequestBody,
) -> CompletionResponse:
    try:
        response = await get_agent_service().execute_task_agent(
            request_body.modelSettings,
            request_body.goal,
            request_body.language,
            request_body.task,
            request_body.analysis,
        )
        return CompletionResponse(response=response)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the request. {error}",
        )


@router.post("/create")
async def create_tasks(
    request_body: AgentRequestBody,
) -> NewTasksResponse:
    try:
        new_tasks = await get_agent_service().create_tasks_agent(
            request_body.modelSettings,
            request_body.goal,
            request_body.language,
            request_body.tasks,
            request_body.lastTask,
            request_body.result,
            request_body.completedTasks,
        )
        return NewTasksResponse(newTasks=new_tasks)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the request. {error}",
        )


class ToolModel(BaseModel):
    name: str
    description: str
    color: str


class ToolsResponse(BaseModel):
    tools: List[ToolModel]


@router.get("/tools")
async def get_user_tools() -> ToolsResponse:
    tools = get_external_tools()
    formatted_tools = [
        ToolModel(
            name=get_tool_name(tool),
            description=tool.public_description,
            color="TODO: Change to image of tool",
        )
        for tool in tools
    ]
    return ToolsResponse(tools=formatted_tools)
