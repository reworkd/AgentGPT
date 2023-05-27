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
        new_tasks = await get_agent_service(req_body.modelSettings).start_goal_agent(
            goal=req_body.goal
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
        return await get_agent_service(req_body.modelSettings).analyze_task_agent(
            goal=req_body.goal,
            task=req_body.task or "",
            tool_names=req_body.toolNames or [],
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
    req_body: AgentRequestBody = Body(
        example={
            "goal": "Perform tasks accurately",
            "task": "Write code to make a platformer",
            "analysis": {
                "reasoning": "I like to write code.",
                "action": "code",
                "arg": "",
            },
        }
    ),
) -> CompletionResponse:
    try:
        response = await get_agent_service(req_body.modelSettings).execute_task_agent(
            goal=req_body.goal or "",
            task=req_body.task or "",
            analysis=req_body.analysis or get_default_analysis(),
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
        new_tasks = await get_agent_service(req_body.modelSettings).create_tasks_agent(
            goal=req_body.goal,
            tasks=req_body.tasks or [],
            last_task=req_body.lastTask or "",
            result=req_body.result or "",
            completed_tasks=req_body.completedTasks or [],
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
