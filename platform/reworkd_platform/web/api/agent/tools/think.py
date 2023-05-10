from langchain import LLMChain

from reworkd_platform.web.api.agent.agent_service.open_ai_agent_service import (
    create_model,
)
from reworkd_platform.web.api.agent.model_settings import ModelSettings
from reworkd_platform.web.api.agent.prompts import execute_task_prompt
from reworkd_platform.web.api.agent.tools.tool import Tool


class Think(Tool):
    def __init__(self, model_settings: ModelSettings):
        super().__init__(
            "Reason about via existing information or understanding.", model_settings
        )

    def call(self, goal: str, task: str, input_str: str) -> str:
        llm = create_model(self.model_settings)
        chain = LLMChain(llm=llm, prompt=execute_task_prompt)

        return chain.run({"goal": goal, "language": "English", "task": task})
