from dataclasses import dataclass
from typing import List, Optional, Protocol
from typing import Literal

from reworkd_platform.web.api.agent.model_settings import ModelSettings


@dataclass
class Analysis:
    action: Literal["reason", "search"]
    arg: str


class AgentService(Protocol):
    async def start_goal_agent(
        self,
        model_settings: ModelSettings,
        goal: str,
        language: str
    ) -> List[str]:
        pass

    async def analyze_task_agent(
        self,
        model_settings: ModelSettings,
        goal: str,
        task: str
    ) -> Analysis:
        pass

    async def execute_task_agent(
        self,
        model_settings: ModelSettings,
        goal: str,
        language: str,
        task: str,
        analysis: Analysis
    ) -> str:
        pass

    async def create_tasks_agent(
        self,
        model_settings: ModelSettings,
        goal: str,
        language: str,
        tasks: List[str],
        last_task: str,
        result: str,
        completed_tasks: Optional[List[str]] = None
    ) -> List[str]:
        pass
