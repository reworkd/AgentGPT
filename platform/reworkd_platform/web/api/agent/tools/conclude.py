from reworkd_platform.web.api.agent.model_settings import ModelSettings
from reworkd_platform.web.api.agent.tools.tool import Tool


class Conclude(Tool):
<<<<<<< HEAD
    description = (
        "Use when there is nothing else to do. The task has been concluded."
    )
=======
    description = "Use when there is nothing else to do. The task has been concluded."
>>>>>>> main

    def __init__(self, model_settings: ModelSettings):
        super().__init__(model_settings)

    def call(self, goal: str, task: str, input_str: str) -> str:
        return ""
