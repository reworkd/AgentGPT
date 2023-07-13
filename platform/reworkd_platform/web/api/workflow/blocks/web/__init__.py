from reworkd_platform.web.api.workflow.blocks.web.status_check import (
    UrlStatusCheckBlock,
)
from reworkd_platform.web.api.workflow.schemas import Block


def get_block_runner(block: Block) -> Block:
    if block.type == "UrlStatusCheck":
        return UrlStatusCheckBlock(**block.dict())
    else:
        raise ValueError(f"Unknown block type: {block.type}")
