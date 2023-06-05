from datetime import datetime
from typing import Optional, List, Literal

from pydantic import BaseModel, Field

from reworkd_platform.web.api.agent.analysis import Analysis

LLM_Model = Literal[
    "gpt-3.5-turbo",
    "gpt-4",
]

Loop_Step = Literal[
    "start",
    "analyze",
    "execute",
    "create",
]


class ModelSettings(BaseModel):
    model: LLM_Model = Field(default="gpt-3.5-turbo", alias="customModelName")
    temperature: float = Field(default=0.9, alias="customTemperature", ge=0.0, le=1.0)
    max_tokens: int = Field(default=500, alias="maxTokens", ge=0, le=2000)
    language: str = Field(default="English")


class AgentRunCreate(BaseModel):
    goal: str
    model_settings: ModelSettings = Field(
        default=ModelSettings(), alias="modelSettings"
    )


class AgentRun(AgentRunCreate):
    run_id: str


class AgentTaskAnalyze(AgentRun):
    task: str
    tool_names: List[str] = Field(default=[], alias="toolNames")
    model_settings: ModelSettings = Field(default=ModelSettings())


class AgentTaskExecute(AgentRun):
    task: str
    analysis: Optional[Analysis] = None  # TODO Why is this optional?


class AgentTaskCreate(AgentRun):
    tasks: List[str] = Field(default=[])
    last_task: Optional[str] = Field(default=None, alias="lastTask")
    result: Optional[str] = Field(default=None)
    completed_tasks: List[str] = Field(default=[], alias="completedTasks")


class NewTasksResponse(BaseModel):
    run_id: str
    new_tasks: List[str] = Field(alias="newTasks")


class RunCount(BaseModel):
    count: int
    first_run: Optional[datetime]
    last_run: Optional[datetime]


class UserBase(BaseModel):
    id: str
    name: Optional[str]
    email: Optional[str]
