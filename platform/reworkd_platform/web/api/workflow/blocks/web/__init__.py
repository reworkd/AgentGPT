from reworkd_platform.schemas.workflow.base import Block
from reworkd_platform.schemas.workflow.blocks.slack_webhook import SlackWebhook
from reworkd_platform.schemas.workflow.blocks.status_check import UrlStatusCheckBlock


def get_block_runner(block: Block) -> Block:
    if block.type == "UrlStatusCheck":
        return UrlStatusCheckBlock(**block.dict())
    if block.type == "SlackWebhook":
        return SlackWebhook(**block.dict())
    else:
        raise ValueError(f"Unknown block type: {block.type}")
