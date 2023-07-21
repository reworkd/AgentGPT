from loguru import logger

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class IfInput(BlockIOBase):
    pass


class IfOutput(BlockIOBase):
    result: bool


class IfCondition(Block):
    type = "If"
    description = "Conditionally take a path"
    input: IfInput

    async def run(self) -> BlockIOBase:
        logger.info(f"Starting {self.type}")
        return IfOutput(result=True)
