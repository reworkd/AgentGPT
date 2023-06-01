from typing import List, Any

from fastapi.responses import StreamingResponse as FastAPIStreamingResponse

from reworkd_platform.web.api.agent.agent_service.agent_service import AgentService
from reworkd_platform.web.api.agent.agent_service.agent_service import Analysis
from reworkd_platform.web.api.agent.tools.stream_mock import stream_string


class MockAgentService(AgentService):
    async def start_goal_agent(self, **kwargs: Any) -> List[str]:
        return ["Task 1"]

    async def create_tasks_agent(self, **kwargs: Any) -> List[str]:
        return ["Task 4"]

    async def analyze_task_agent(self, **kwargs: Any) -> Analysis:
        return Analysis(
            action="reason",
            arg="Mock analysis",
            reasoning="Mock to avoid wasting money calling the OpenAI API.",
        )

    async def execute_task_agent(self, **kwargs: Any) -> FastAPIStreamingResponse:
        return stream_string("The task result is: " + kwargs.get("task", "task"), True)
