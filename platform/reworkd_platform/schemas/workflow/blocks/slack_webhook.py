import requests
from loguru import logger

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class SlackWebhookInput(BlockIOBase):
    url: str
    message: str


class SlackWebhookOutput(SlackWebhookInput):
    url: str
    message: str


class SlackWebhook(Block):
    type = "SlackWebhook"
    description = "Sends a message to a slack webhook"
    input: SlackWebhookInput

    async def run(self) -> BlockIOBase:
        logger.info(f"Starting {self.type} with {self.input.message}")

        try:
            response = requests.post(
                self.input.url, json={"message": self.input.message}
            )
            response.raise_for_status()
        except requests.exceptions.RequestException as err:
            logger.error(f"Failed to send message to webhook: {err}")
            raise

        return SlackWebhookOutput(**self.input.dict())
