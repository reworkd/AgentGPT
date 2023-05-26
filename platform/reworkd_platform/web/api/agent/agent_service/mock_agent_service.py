from typing import List

from reworkd_platform.web.api.agent.agent_service.agent_service import AgentService
from reworkd_platform.web.api.agent.agent_service.agent_service import Analysis


class MockAgentService(AgentService):
    async def start_goal_agent(self, **kwargs) -> List[str]:
        return ["Task 1"]

    async def create_tasks_agent(self, **kwargs) -> List[str]:
        return ["Task 4"]

    async def analyze_task_agent(self, **kwargs) -> Analysis:
        return Analysis(
            action="reason",
            arg="Mock analysis",
            reasoning="Mock to avoid wasting money calling the OpenAI API.",
        )

    async def execute_task_agent(self, **kwargs) -> str:
        return "Result: " + kwargs.get("task", "task")
