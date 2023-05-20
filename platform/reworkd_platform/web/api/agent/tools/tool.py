from abc import ABC, abstractmethod

from reworkd_platform.web.api.agent.model_settings import ModelSettings


class Tool(ABC):
    description: str = ""
    public_description: str = ""
    model_settings: ModelSettings

    def __init__(self, model_settings: ModelSettings):
        self.model_settings = model_settings

    @abstractmethod
    def call(self, goal: str, task: str, input_str: str) -> str:
        pass
