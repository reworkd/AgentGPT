from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class ManualTriggerBlock(Block):
    type = "ManualTriggerBlock"
    description = "Manually run the workflow"
    image_url = ""

    async def run(self) -> BlockIOBase:
        return BlockIOBase()
