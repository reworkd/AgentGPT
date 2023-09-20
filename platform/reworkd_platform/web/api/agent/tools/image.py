from typing import Any

import openai
import replicate
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from replicate.exceptions import ModelError
from replicate.exceptions import ReplicateError as ReplicateAPIError

from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.stream_mock import stream_string
from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.errors import ReplicateError


async def get_replicate_image(input_str: str) -> str:
    if settings.replicate_api_key is None or settings.replicate_api_key == "":
        raise RuntimeError("Replicate API key not set")

    client = replicate.Client(settings.replicate_api_key)
    try:
        output = client.run(
            "stability-ai/stable-diffusion"
            ":db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
            input={"prompt": input_str},
            image_dimensions="512x512",
        )
    except ModelError as e:
        raise ReplicateError(e, "Image generation failed due to NSFW image.")
    except ReplicateAPIError as e:
        raise ReplicateError(e, "Failed to generate an image.")

    return output[0]


# Use AI to generate an Image based on a prompt
async def get_open_ai_image(input_str: str) -> str:
    response = openai.Image.create(
        api_key=settings.openai_api_key,
        prompt=input_str,
        n=1,
        size="256x256",
    )

    return response["data"][0]["url"]


class Image(Tool):
    description = "Used to sketch, draw, or generate an image."
    public_description = "Generate AI images."
    arg_description = (
        "The input prompt to the image generator. "
        "This should be a detailed description of the image touching on image "
        "style, image focus, color, etc."
    )
    image_url = "/tools/replicate.png"

    async def call(
        self, goal: str, task: str, input_str: str, *args: Any, **kwargs: Any
    ) -> FastAPIStreamingResponse:
        # Use the replicate API if its available, otherwise use DALL-E
        try:
            url = await get_replicate_image(input_str)
        except RuntimeError:
            url = await get_open_ai_image(input_str)

        return stream_string(f"![{input_str}]({url})")
