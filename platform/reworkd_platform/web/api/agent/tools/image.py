import openai
import replicate

from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.model_settings import (
    ModelSettings,
    get_server_side_key,
)
from reworkd_platform.web.api.agent.tools.tool import Tool


# Use AI to generate an Image based on a prompt
# Use the replicate API if its available, otherwise use DALL-E
def is_replicate_available() -> bool:
    return settings.replicate_api_key is not None


async def get_replicate_image(input_str: str) -> str:
    client = replicate.Client(settings.replicate_api_key)
    output = client.run(
        "stability-ai/stable-diffusion"
        ":db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
        input={"prompt": input_str},
        image_dimensions="512x512",
    )
    return output[0]


async def get_open_ai_image(input_str: str) -> str:
    api_key = get_server_side_key()

    response = openai.Image.create(
        api_key=api_key,
        prompt=input_str,
        n=1,
        size="256x256",
    )

    return response["data"][0]["url"]


class Image(Tool):
    description = (
        "Used to sketch, draw, or generate an image. The input string "
        "should be a detailed description of the image touching on image "
        "style, image focus, color, etc"
    )
    public_description = "Generate AI images."

    def __init__(self, model_settings: ModelSettings):
        super().__init__(model_settings)

    async def call(self, goal: str, task: str, input_str: str) -> str:
        url = (
            (await get_replicate_image(input_str))
            if is_replicate_available()
            else (await get_open_ai_image(input_str))
        )
        return f"![{input_str}]({url})"
