from typing import List, Optional, Protocol

from reworkd_platform.web.api.agent.analysis import Analysis


class AgentService(Protocol):
    async def start_goal_agent(self, *, goal: str) -> List[str]:
        pass

    async def analyze_task_agent(
        self, *, goal: str, task: str, tool_names: List[str]
    ) -> Analysis:
        pass

    async def execute_task_agent(
        self,
        *,
        goal: str,
        task: str,
        analysis: Analysis,
    ) -> str:
        pass

    async def create_tasks_agent(
        self,
        *,
        goal: str,
        tasks: List[str],
        last_task: str,
        result: str,
        completed_tasks: Optional[List[str]] = None,
    ) -> List[str]:
        pass
