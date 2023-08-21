from typing import Any

from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from lanarky.responses import StreamingResponse
from langchain import LLMChain

from reworkd_platform.web.api.agent.tools.tool import Tool


class Reason(Tool):
    description = (
        "Reason about task via existing information or understanding. "
        "Make decisions / selections from options."
    )

    async def call(
        self, goal: str, task: str, input_str: str, *args: Any, **kwargs: Any
    ) -> FastAPIStreamingResponse:
        from reworkd_platform.web.api.agent.prompts import execute_task_prompt

        chain = LLMChain(llm=self.model, prompt=execute_task_prompt)

        return StreamingResponse.from_chain(
            chain,
            {"goal": goal, "language": self.language, "task": task},
            media_type="text/event-stream",
        )
