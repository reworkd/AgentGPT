from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class APITriggerInput(BlockIOBase):
    message: str


class APITriggerOutput(BlockIOBase):
    message: str


class APITriggerBlock(Block):
    type = "APITriggerBlock"
    description = "Trigger the workflow through an API call"
    image_url = ""

    async def run(self) -> APITriggerOutput:
        return APITriggerOutput(**self.input.dict())
