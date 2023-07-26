import requests
from loguru import logger

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.settings import settings


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

    async def run(self, workflow_id: str) -> BlockIOBase:
        logger.info(f"Starting {self.type} with {self.input.message}")

        try:
            response = requests.post(
                "https://hooks.slack.com/services/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",
                json={
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": self.input.message,
                            },
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "You can view the workflow here:",
                            },
                            "accessory": {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "View Workflow",
                                    "emoji": True,
                                },
                                "value": "click_me_123",
                                "url": settings.frontend_url
                                + f"/workflow/{workflow_id}",
                                "action_id": "button-action",
                            },
                        },
                    ],
                },
            )
            response.raise_for_status()
        except requests.exceptions.RequestException as err:
            logger.error(f"Failed to send message to webhook: {err}")
            raise

        return SlackWebhookOutput(**self.input.dict())
