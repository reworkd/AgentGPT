from functools import wraps
from typing import Any, Callable, Coroutine, TypeVar

from reworkd_platform.services.sockets import websockets

STATUS_EVENT = "workflow:node:status"

_T = TypeVar("_T")


def websocket_status(
    func: Callable[..., Coroutine[Any, Any, _T]]
) -> Callable[..., Coroutine[Any, Any, _T]]:
    @wraps(func)
    async def wrapper(engine: Any, *args: Any, **kwargs: Any) -> _T:
        workflow_id = engine.workflow.workflow_id
        node_id = engine.workflow.queue[0].id

        websockets.emit(
            workflow_id,
            STATUS_EVENT,
            {
                "nodeId": node_id,
                "status": "running",
            },
        )

        try:
            result = await func(engine, *args, **kwargs)
        except Exception as e:
            websockets.emit(
                workflow_id,
                STATUS_EVENT,
                {
                    "nodeId": node_id,
                    "status": "error",
                },
            )
            websockets.log(workflow_id, f"Workflow failed: {e}")
            raise e

        # Emit 'success' status at the end
        websockets.emit(
            workflow_id,
            STATUS_EVENT,
            {
                "nodeId": node_id,
                "status": "success",
                "remaining": len(engine.workflow.queue),
            },
        )

        return result

    return wrapper
