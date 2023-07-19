from reworkd_platform.schemas.workflow.base import Block
from reworkd_platform.schemas.workflow.blocks.slack_webhook import SlackWebhook
from reworkd_platform.schemas.workflow.blocks.status_check import UrlStatusCheckBlock
from reworkd_platform.schemas.workflow.blocks.openai_webhook import OpenAIWebhook
from reworkd_platform.schemas.workflow.blocks.text_input_webhook import TextInputWebhook

def get_block_runner(block: Block) -> Block:
    if block.type == "UrlStatusCheck":
        return UrlStatusCheckBlock(**block.dict())
    if block.type == "SlackWebhook":
        return SlackWebhook(**block.dict())
    if block.type == "TextInputWebhook":
        return TextInputWebhook(**block.dict())
    if block.type == "OpenAIWebhook":
        return OpenAIWebhook(**block.dict())
    else:
        raise ValueError(f"Unknown block type: {block.type}")
