from loguru import logger

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class WebInteractionInput(BlockIOBase):
    url: str
    goals: str


class WebInteractionOutput(WebInteractionInput):
    successful: bool


class WebInteractionAgent(Block):
    type = "WebInteractionAgent"
    description = "Navigate a website"
    input: WebInteractionInput

    async def run(self) -> WebInteractionOutput:
        logger.info(f"Starting {self.type}")

        # Rohan 🙏

        return WebInteractionOutput(**self.input.dict(), successful=True)
