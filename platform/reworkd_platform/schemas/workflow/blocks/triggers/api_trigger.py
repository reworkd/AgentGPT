from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class APITriggerBlock(Block):
    type = "APITriggerBlock"
    description = "Trigger the workflow through an API call"
    image_url = ""

    async def run(self) -> BlockIOBase:
        return BlockIOBase()
