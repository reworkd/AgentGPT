from reworkd_platform.schemas.workflow.base import Block
from reworkd_platform.schemas.workflow.blocks.conditions.ifcondition import IfCondition
from reworkd_platform.schemas.workflow.blocks.manual_trigger import ManualTriggerBlock
from reworkd_platform.schemas.workflow.blocks.slack_webhook import SlackWebhook
from reworkd_platform.schemas.workflow.blocks.status_check import UrlStatusCheckBlock
from reworkd_platform.schemas.workflow.blocks.summarization_webhook import (
    SummaryWebhook,
)
from reworkd_platform.schemas.workflow.blocks.text_input_webhook import TextInputWebhook


def get_block_runner(block: Block) -> Block:
    if block.type == "IfCondition":
        return IfCondition(**block.dict())
    if block.type == "ManualTriggerBlock":
        return ManualTriggerBlock(**block.dict())
    if block.type == "UrlStatusCheck":
        return UrlStatusCheckBlock(**block.dict())
    if block.type == "SlackWebhook":
        return SlackWebhook(**block.dict())
    if block.type == "TextInputWebhook":
        return TextInputWebhook(**block.dict())
    if block.type == "SummaryWebhook":
        return SummaryWebhook(**block.dict())
    else:
        raise ValueError(f"Unknown block type: {block.type}")
