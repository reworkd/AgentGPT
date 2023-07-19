from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class ManualTriggerBlock(Block):
    type = "ManualTriggerBlock"
    description = "Outputs the status code of a GET request to a URL"
    image_url = ""

    async def run(self) -> BlockIOBase:
        return BlockIOBase()
