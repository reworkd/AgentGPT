import requests
from loguru import logger

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class SlackWebhook(Block):
    type = "SlackWebhook"
    description = "Sends a message to a slack webhook"
    # TODO: Make URL and message a dynamic field
    url = "https://hooks.slack.com/workflows/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"
    message = "Hello World!"

    async def run(self) -> BlockIOBase:
        logger.info(f"Starting {self.type}")
        requests.post(self.url, json={"message": "Mr. S is not the best looking "})
        return BlockIOBase()
