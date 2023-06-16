from typing import List

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from pydantic import BaseModel

from reworkd_platform.schemas import (
    AgentRun,
    AgentTaskAnalyze,
    AgentTaskCreate,
    AgentTaskExecute,
    NewTasksResponse,
    UserBase,
)
from reworkd_platform.web.api.agent.agent_service.agent_service_provider import (
    get_agent_service,
)
from reworkd_platform.web.api.agent.analysis import Analysis
from reworkd_platform.web.api.agent.dependancies import (
    agent_analyze_validator,
    agent_create_validator,
    agent_execute_validator,
    agent_start_validator,
    get_agent_memory,
)
from reworkd_platform.web.api.agent.model_settings import create_model
from reworkd_platform.web.api.agent.tools.tools import get_external_tools, get_tool_name
from reworkd_platform.web.api.dependencies import get_current_user
from reworkd_platform.web.api.memory.memory import AgentMemory

router = APIRouter()


@router.post(
    "/start",
)
async def start_tasks(
    req_body: AgentRun = Depends(
        agent_start_validator(
            example={
                "goal": "Create business plan for a bagel company",
                "modelSettings": {
                    "customModelName": "gpt-3.5-turbo",
                },
            },
        )
    ),
    user: UserBase = Depends(get_current_user),
    agent_memory: AgentMemory = Depends(get_agent_memory),
) -> NewTasksResponse:
    model = create_model(req_body.model_settings, user, streaming=False)
    new_tasks = await get_agent_service(
        model, req_body.model_settings.language, agent_memory
    ).start_goal_agent(goal=req_body.goal)
    return NewTasksResponse(newTasks=new_tasks, run_id=req_body.run_id)


@router.post("/analyze")
async def analyze_tasks(
    req_body: AgentTaskAnalyze = Depends(agent_analyze_validator()),
    user: UserBase = Depends(get_current_user),
    agent_memory: AgentMemory = Depends(get_agent_memory),
) -> Analysis:
    model = create_model(req_body.model_settings, user, streaming=False)
    return await get_agent_service(
        model, req_body.model_settings.language, agent_memory
    ).analyze_task_agent(
        goal=req_body.goal,
        task=req_body.task or "",
        tool_names=req_body.tool_names or [],
    )


class CompletionResponse(BaseModel):
    response: str


@router.post("/execute")
async def execute_tasks(
    req_body: AgentTaskExecute = Depends(
        agent_execute_validator(
            example={
                "goal": "Perform tasks accurately",
                "task": "Write code to make a platformer",
                "analysis": {
                    "reasoning": "I like to write code.",
                    "action": "code",
                    "arg": "",
                },
            },
        )
    ),
    user: UserBase = Depends(get_current_user),
    agent_memory: AgentMemory = Depends(get_agent_memory),
) -> FastAPIStreamingResponse:
    model = create_model(req_body.model_settings, user, streaming=True)
    return await get_agent_service(
        model, req_body.model_settings.language, agent_memory
    ).execute_task_agent(
        goal=req_body.goal or "",
        task=req_body.task or "",
        analysis=req_body.analysis or Analysis.get_default_analysis(),
    )


@router.post("/create")
async def create_tasks(
    req_body: AgentTaskCreate = Depends(agent_create_validator()),
    user: UserBase = Depends(get_current_user),
    agent_memory: AgentMemory = Depends(get_agent_memory),
) -> NewTasksResponse:
    model = create_model(req_body.model_settings, user, streaming=False)
    new_tasks = await get_agent_service(
        model, req_body.model_settings.language, agent_memory
    ).create_tasks_agent(
        goal=req_body.goal,
        tasks=req_body.tasks or [],
        last_task=req_body.last_task or "",
        result=req_body.result or "",
        completed_tasks=req_body.completed_tasks or [],
    )
    return NewTasksResponse(newTasks=new_tasks, run_id=req_body.run_id)


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
        if tool.available()
    ]

    return ToolsResponse(tools=formatted_tools)
