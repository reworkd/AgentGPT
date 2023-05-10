from typing import List, Optional

from reworkd_platform.web.api.agent.agent_service.agent_service import AgentService
from reworkd_platform.web.api.agent.agent_service.agent_service import Analysis
from reworkd_platform.web.api.agent.model_settings import ModelSettings


class MockAgentService(AgentService):
    async def start_goal_agent(
        self, model_settings: ModelSettings, goal: str, language: str
    ) -> List[str]:
        return ["Task 1"]

    async def create_tasks_agent(
        self,
        model_settings: ModelSettings,
        goal: str,
        language: str,
        tasks: List[str],
        last_task: str,
        result: str,
        completed_tasks: Optional[List[str]] = None,
    ) -> List[str]:
        return ["Task 4"]

    async def analyze_task_agent(
        self, model_settings: ModelSettings, goal: str, task: str
    ) -> Analysis:
        return Analysis(action="reason", arg="Mock analysis")

    async def execute_task_agent(
        self,
        model_settings: ModelSettings,
        goal: str,
        language: str,
        task: str,
        analysis: Analysis,
    ) -> str:
        return "Result: " + task
