from typing import Any, Optional, Dict

from loguru import logger
from slack_sdk import WebClient

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.services.security import encryption_service


class SlackWebhookInput(BlockIOBase):
    url: str
    message: str


class SlackWebhookOutput(SlackWebhookInput):
    url: str
    message: str


class SlackMessageBlock(Block):
    type = "SlackWebhook"
    description = "Sends a message to a slack webhook"
    input: SlackWebhookInput

    async def run(
        self,
        workflow_id: str,
        credentials: Optional[Dict[str, str]] = None,
        **kwargs: Any,
    ) -> BlockIOBase:
        logger.info(f"Starting {self.type} with {self.input.message}")

        if not credentials or not (token := credentials.get("slack", None)):
            raise ValueError("No credentials provided")

        token = encryption_service.decrypt(token)
        WebClient(token=token).chat_postMessage(
            channel=self.input.url,
            text=self.input.message,
        )

        return SlackWebhookOutput(**self.input.dict())
