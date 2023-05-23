import openai

from reworkd_platform.web.api.agent.model_settings import (
    ModelSettings,
    get_server_side_key,
)
from reworkd_platform.web.api.agent.tools.tool import Tool


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
        api_key = (
            self.model_settings.customApiKey
            if self.model_settings.customApiKey
            else get_server_side_key()
        )

        response = openai.Image.create(
            api_key=api_key,
            prompt=input_str,
            n=1,
            size="256x256",
        )
        image_url = response["data"][0]["url"]

        return f"![{input_str}]({image_url})"
