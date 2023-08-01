from typing import Any

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class DoNothingBlock(Block):
    type = "DoNothing"
    description = "Literally does nothing"
    image_url = ""
    input: BlockIOBase

    async def run(self, workflow_id: Any, **kwargs: Any) -> BlockIOBase:
        return BlockIOBase()
