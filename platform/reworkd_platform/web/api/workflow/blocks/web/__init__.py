from reworkd_platform.schemas.workflow.base import Block
from reworkd_platform.schemas.workflow.blocks.agents.web_interaction_agent import (
    WebInteractionAgent,
)
from reworkd_platform.schemas.workflow.blocks.conditions.if_condition import IfCondition
from reworkd_platform.schemas.workflow.blocks.do_nothing import DoNothingBlock
from reworkd_platform.schemas.workflow.blocks.openai_agent import OpenAIContextAgent
from reworkd_platform.schemas.workflow.blocks.pdf.diff_pdf import DiffPDF
from reworkd_platform.schemas.workflow.blocks.slack_webhook import SlackWebhook
from reworkd_platform.schemas.workflow.blocks.summary_agent import SummaryAgent
from reworkd_platform.schemas.workflow.blocks.text_input_webhook import TextInputWebhook
from reworkd_platform.schemas.workflow.blocks.triggers.api_trigger import (
    APITriggerBlock,
)
from reworkd_platform.schemas.workflow.blocks.triggers.manual_trigger import (
    ManualTriggerBlock,
)
from reworkd_platform.schemas.workflow.blocks.url_status_check import (
    UrlStatusCheckBlock,
)


def get_block_runner(block: Block) -> Block:
    if block.type == "IfCondition":
        return IfCondition(**block.dict())
    if block.type == "DiffPDF":
        return DiffPDF(**block.dict())
    if block.type == "WebInteractionAgent":
        return WebInteractionAgent(**block.dict())
    if block.type == "APITriggerBlock":
        return APITriggerBlock(**block.dict())
    if block.type == "ManualTriggerBlock":
        return ManualTriggerBlock(**block.dict())
    if block.type == "UrlStatusCheck":
        return UrlStatusCheckBlock(**block.dict())
    if block.type == "SlackWebhook":
        return SlackWebhook(**block.dict())
    if block.type == "TextInputWebhook":
        return TextInputWebhook(**block.dict())
    if block.type == "SummaryAgent":
        return SummaryAgent(**block.dict())
    if block.type == "OpenAIAgent":
        return OpenAIContextAgent(**block.dict())
    if block.type == "FileUploadBlock":
        return DoNothingBlock(**block.dict())
    else:
        raise ValueError(f"Unknown block type: {block.type}")
