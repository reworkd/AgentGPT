from typing import Any

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.services.sockets import websockets


class ManualTriggerBlock(Block):
    type = "ManualTrigger"
    description = "Manually trigger the workflow"
    image_url = ""
    input: BlockIOBase

    async def run(self, workflow_id: Any, **kwargs: Any) -> BlockIOBase:
        websockets.log(workflow_id, f"Manual workflow started")
        return BlockIOBase()
