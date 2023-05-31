from fastapi.responses import StreamingResponse as FastAPIStreamingResponse

from reworkd_platform.schemas import ModelSettings
from reworkd_platform.web.api.agent.tools.stream_mock import stream_string
from reworkd_platform.web.api.agent.tools.tool import Tool


class Conclude(Tool):
    description = "Use when there is nothing else to do. The task has been concluded."

    def __init__(self, model_settings: ModelSettings):
        super().__init__(model_settings)

    async def call(
        self, goal: str, task: str, input_str: str
    ) -> FastAPIStreamingResponse:
        return stream_string("Task execution concluded.", delayed=True)
