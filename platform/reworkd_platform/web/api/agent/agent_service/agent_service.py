from typing import List, Optional, Protocol

from fastapi.responses import StreamingResponse as FastAPIStreamingResponse

from reworkd_platform.schemas import ModelSettings
from reworkd_platform.web.api.agent.analysis import Analysis


class AgentService(Protocol):
    def with_settings(self, model_settings: ModelSettings) -> "AgentService":
        pass

    async def start_goal_agent(self, *, goal: str) -> List[str]:
        raise NotImplementedError()

    async def analyze_task_agent(
        self, *, goal: str, task: str, tool_names: List[str]
    ) -> Analysis:
        raise NotImplementedError()

    async def execute_task_agent(
        self,
        *,
        goal: str,
        task: str,
        analysis: Analysis,
    ) -> FastAPIStreamingResponse:
        raise NotImplementedError()

    async def create_tasks_agent(
        self,
        *,
        goal: str,
        tasks: List[str],
        last_task: str,
        result: str,
        completed_tasks: Optional[List[str]] = None,
    ) -> List[str]:
        raise NotImplementedError()
