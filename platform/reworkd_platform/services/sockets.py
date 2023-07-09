from loguru import logger
from pusher import Pusher
from pusher.errors import PusherBadRequest
from requests import ReadTimeout

from reworkd_platform.settings import Settings, settings


class WebsocketService:
    def __init__(self, settings: Settings):
        self._client = Pusher(
            app_id=settings.pusher_app_id,
            key=settings.pusher_key,
            secret=settings.pusher_secret,
            cluster=settings.pusher_cluster,
            ssl=True,
        )

    def emit(self, channel: str, event: str, data: dict) -> None:
        try:
            self._client.trigger(channel, event, data)
        except (PusherBadRequest, ReadTimeout) as e:
            logger.warning(f"Failed to emit event: {data}")


websockets = WebsocketService(settings=settings)
