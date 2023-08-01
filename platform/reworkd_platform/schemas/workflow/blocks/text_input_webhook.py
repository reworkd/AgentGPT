from typing import Any

from loguru import logger

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class TextInputWebhookInput(BlockIOBase):
    text: str


class TextInputWebhookOutput(BlockIOBase):
    result: str


class TextInputWebhook(Block):
    type = "TextInputWebhook"
    description = "Enter Text to extract key details from"
    input: TextInputWebhookInput

    async def run(self, workflow_id: str, **kwargs: Any) -> BlockIOBase:
        logger.info(f"Starting {self.type}")

        return TextInputWebhookOutput(result=self.input.text)
