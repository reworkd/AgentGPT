from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class DoNothingBlock(Block):
    type = "DoNothing"
    description = "Literally does nothing"
    image_url = ""
    input: BlockIOBase

    async def run(self) -> BlockIOBase:
        return BlockIOBase()
