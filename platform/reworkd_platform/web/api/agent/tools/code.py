from typing import Any

from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from lanarky.responses import StreamingResponse
from ollama import Client  # Updated import

from reworkd_platform.web.api.agent.tools.tool import Tool


class Code(Tool):
    description = "Should only be used to write code, refactor code, fix code bugs, and explain programming concepts."
    public_description = "Write and review code."

    async def call(
        self, goal: str, task: str, input_str: str, *args: Any, **kwargs: Any
    ) -> FastAPIStreamingResponse:
        from reworkd_platform.web.api.agent.prompts import code_prompt

        client = Client(host='http://localhost:11434')  # Specify host if different
        response = client.chat(
            model="llama3.2",
            messages=[
                {"role": "system", "content": code_prompt},
                {"role": "user", "content": input_str}
            ],
            stream=True,  # Enable streaming if required
        )

        # Create a generator to yield streaming responses
        async def stream_response():
            for chunk in response:
                yield chunk['message']['content']

        return FastAPIStreamingResponse(stream_response(), media_type="text/event-stream")
