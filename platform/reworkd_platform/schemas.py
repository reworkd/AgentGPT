from typing import Optional, List

from pydantic import BaseModel, Field

from reworkd_platform.web.api.agent.analysis import Analysis

GPT_35_TURBO = "gpt-3.5-turbo"


class ModelSettings(BaseModel):
    model: str = Field(default=GPT_35_TURBO, alias="customModelName")
    temperature: float = Field(default=0.9, alias="customTemperature")
    max_tokens: int = Field(default=500, alias="maxTokens")
    language: str = Field(default="english")


class AgentRequestBody(BaseModel):
    modelSettings: ModelSettings
    goal: str
    language: str = "English"
    task: Optional[str]
    analysis: Optional[Analysis]
    toolNames: Optional[List[str]]
    tasks: Optional[List[str]]
    lastTask: Optional[str]
    result: Optional[str]
    completedTasks: Optional[List[str]]
