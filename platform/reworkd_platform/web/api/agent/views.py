from typing import List, Optional

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel

from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.agent_service.agent_service_provider import (
    get_agent_service,
)
from reworkd_platform.web.api.agent.analysis import Analysis, get_default_analysis
from reworkd_platform.web.api.agent.model_settings import ModelSettings
from reworkd_platform.web.api.agent.tools.tools import get_external_tools, get_tool_name

router = APIRouter()


class AgentRequestBody(BaseModel):
    modelSettings: ModelSettings = ModelSettings()
    goal: str
    language: str = "English"
    task: Optional[str]
    analysis: Optional[Analysis]
    toolNames: Optional[List[str]]
    tasks: Optional[List[str]]
    lastTask: Optional[str]
    result: Optional[str]
    completedTasks: Optional[List[str]]


class NewTasksResponse(BaseModel):
    newTasks: List[str]


@router.post("/start")
async def start_tasks(
    req_body: AgentRequestBody = Body(
        example={
            "goal": "Create business plan for a bagel company",
            "task": "Identify the most common bagel shapes",
        }
    ),
) -> NewTasksResponse:
    try:
        new_tasks = await get_agent_service().start_goal_agent(
            req_body.modelSettings, req_body.goal, req_body.language
        )
        return NewTasksResponse(newTasks=new_tasks)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the request. {error}",
        )


@router.post("/analyze")
async def analyze_tasks(
    req_body: AgentRequestBody,
) -> Analysis:
    try:
        return await get_agent_service().analyze_task_agent(
            req_body.modelSettings if req_body.modelSettings else ModelSettings(),
            req_body.goal,
            req_body.task if req_body.task else "",
            req_body.toolNames if req_body.toolNames else [],
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
async def execute_tasks(
    req_body: AgentRequestBody,
) -> CompletionResponse:
    try:
        response = await get_agent_service().execute_task_agent(
            req_body.modelSettings if req_body.modelSettings else ModelSettings(),
            req_body.goal if req_body.goal else "",
            req_body.language,
            req_body.task if req_body.task else "",
            req_body.analysis if req_body.analysis else get_default_analysis(),
        )
        return CompletionResponse(response=response)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the request. {error}",
        )


@router.post("/create")
async def create_tasks(
    req_body: AgentRequestBody,
) -> NewTasksResponse:
    try:
        new_tasks = await get_agent_service().create_tasks_agent(
            req_body.modelSettings if req_body.modelSettings else ModelSettings(),
            req_body.goal,
            req_body.language,
            req_body.tasks if req_body.tasks else [],
            req_body.lastTask if req_body.lastTask else "",
            req_body.result if req_body.result else "",
            req_body.completedTasks if req_body.completedTasks else [],
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
