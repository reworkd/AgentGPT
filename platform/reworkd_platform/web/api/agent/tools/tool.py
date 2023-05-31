from abc import ABC, abstractmethod

from lanarky.responses import StreamingResponse

from reworkd_platform.schemas import ModelSettings


class Tool(ABC):
    description: str = ""
    public_description: str = ""
    model_settings: ModelSettings

    def __init__(self, model_settings: ModelSettings):
        self.model_settings = model_settings

    @staticmethod
    def available() -> bool:
        return True

    @abstractmethod
    async def call(self, goal: str, task: str, input_str: str) -> StreamingResponse:
        pass
