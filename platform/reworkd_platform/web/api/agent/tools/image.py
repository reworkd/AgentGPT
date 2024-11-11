from typing import Any

from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from ollama import Client  # Updated import

from reworkd_platform.web.api.agent.stream_mock import stream_string
from reworkd_platform.web.api.agent.tools.tool import Tool


class Image(Tool):
    description = "Used to sketch, draw, or generate an image."
    public_description = "Generate AI images."
    arg_description = (
        "The input prompt to the image generator. "
        "This should be a detailed description of the image touching on image "
        "style, image focus, color, etc."
    )
    image_url = "/tools/ollama.png"

    async def call(
        self, goal: str, task: str, input_str: str, *args: Any, **kwargs: Any
    ) -> FastAPIStreamingResponse:
        client = Client(host='http://localhost:11434')  # Specify host if different
        response = client.chat(
            model="llama3.2",
            messages=[
                {"role": "system", "content": "Generate an image based on the following description."},
                {"role": "user", "content": input_str}
            ],
            stream=True,
        )

        # Assuming 'chain' returns a URL or some identifier for the generated image
        image_url = ""

        async def stream_response():
            nonlocal image_url
            for chunk in response:
                content = chunk['message']['content']
                image_url += content  # Adjust based on actual response structure

        await stream_response()

        return stream_string(f"![{input_str}]({image_url})")
