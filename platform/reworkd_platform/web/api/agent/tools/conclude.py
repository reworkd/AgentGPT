from typing import Any

from fastapi.responses import StreamingResponse as FastAPIStreamingResponse

from reworkd_platform.web.api.agent.stream_mock import stream_string
from reworkd_platform.web.api.agent.tools.tool import Tool


class Conclude(Tool):
    description = "Use when there is nothing else to do. The task has been concluded."

    async def call(
        self, goal: str, task: str, input_str: str, *args: Any, **kwargs: Any
    ) -> FastAPIStreamingResponse:
        return stream_string("Task execution concluded.", delayed=True)
