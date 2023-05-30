from langchain import LLMChain

from reworkd_platform.web.api.agent.model_settings import ModelSettings, create_model
from reworkd_platform.web.api.agent.tools.tool import Tool


class Reason(Tool):
    description = (
        "Reason about task via existing information or understanding. "
        "Make decisions / selections from options."
    )

    def __init__(self, model_settings: ModelSettings):
        super().__init__(model_settings)

    async def call(self, goal: str, task: str, input_str: str) -> str:
        from reworkd_platform.web.api.agent.prompts import execute_task_prompt

        llm = create_model(self.model_settings)
        chain = LLMChain(llm=llm, prompt=execute_task_prompt)

        return await chain.arun({"goal": goal, "language": "English", "task": task})
