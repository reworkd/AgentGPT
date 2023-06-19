from abc import ABC, abstractmethod

from lanarky.responses import StreamingResponse
from langchain.chat_models.base import BaseChatModel


class Tool(ABC):
    description: str = ""
    public_description: str = ""
    arg_description: str = "The argument to the function."

    model: BaseChatModel
    language: str

    def __init__(self, model: BaseChatModel, language: str):
        self.model = model
        self.language = language

    @staticmethod
    def available() -> bool:
        return True

    @abstractmethod
    async def call(self, goal: str, task: str, input_str: str) -> StreamingResponse:
        pass
