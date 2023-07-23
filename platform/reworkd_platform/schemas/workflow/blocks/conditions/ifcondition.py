from loguru import logger

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class IfInput(BlockIOBase):
    pass


class IfOutput(BlockIOBase):
    result: bool


class IfCondition(Block):
    type = "IfCondition"
    description = "Conditionally take a path"
    input: IfInput

    async def run(self) -> IfOutput:
        logger.info(f"Starting {self.type}")
        return IfOutput(result=True)
