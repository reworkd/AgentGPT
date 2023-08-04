from datetime import datetime
from typing import Any, Dict

from loguru import logger
from pusher import Pusher
from pusher.errors import PusherBadRequest
from requests import ReadTimeout

from reworkd_platform.schemas import UserBase
from reworkd_platform.settings import Settings
from reworkd_platform.settings import settings as app_settings


class WebsocketService:
    def __init__(self, settings: Settings):
        self._client = settings.pusher_enabled and Pusher(
            app_id=settings.pusher_app_id,
            key=settings.pusher_key,
            secret=settings.pusher_secret,
            cluster=settings.pusher_cluster,
            ssl=True,
        )

    def emit(self, channel: str, event: str, data: Dict[str, Any]) -> None:
        try:
            self._client and self._client.trigger("presence-" + channel, event, data)
        except (PusherBadRequest, ReadTimeout) as e:
            logger.warning(f"Failed to emit event: {data}")

    def log(self, workflow_id: str, msg: Any) -> None:
        self.emit(
            workflow_id,
            "workflow:log",
            {"date": datetime.now().__str__(), "msg": str(msg)},
        )

    def authenticate(
        self, user: UserBase, channel: str, socket_id: str
    ) -> Dict[str, Any]:
        if not self._client:
            return {}

        # TODO: should probably make sure the user is allowed to authenticate to each channel
        return self._client.authenticate(
            channel=channel,
            socket_id=socket_id,
            custom_data={
                "user_id": user.id,
                "user_info": {
                    "name": user.name,
                    "email": user.email,
                    "image": user.image,
                },
            },
        )


websockets = WebsocketService(settings=app_settings)
