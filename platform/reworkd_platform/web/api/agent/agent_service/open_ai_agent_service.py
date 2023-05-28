from typing import List, Optional

from lanarky.responses import StreamingResponse
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser

from reworkd_platform.web.api.agent.agent_service.agent_service import AgentService
from reworkd_platform.web.api.agent.analysis import Analysis, get_default_analysis
from reworkd_platform.web.api.agent.helpers import extract_tasks
from reworkd_platform.web.api.agent.model_settings import ModelSettings, create_model
from reworkd_platform.web.api.agent.prompts import (
    start_goal_prompt,
    analyze_task_prompt,
    create_tasks_prompt,
)
from reworkd_platform.web.api.agent.tools.tools import (
    get_tools_overview,
    get_tool_from_name,
    get_user_tools,
)


class OpenAIAgentService(AgentService):
    def __init__(self, model_settings: ModelSettings):
        self.model_settings = model_settings
        self._language = model_settings.language or "English"

    async def start_goal_agent(self, *, goal: str) -> List[str]:
        llm = create_model(self.model_settings)
        chain = LLMChain(llm=llm, prompt=start_goal_prompt)

        completion = await chain.arun({"goal": goal, "language": self._language})
        print(f"Goal: {goal}, Completion: {completion}")
        return extract_tasks(completion, [])

    async def analyze_task_agent(
        self, *, goal: str, task: str, tool_names: List[str]
    ) -> Analysis:
        llm = create_model(self.model_settings)
        chain = LLMChain(llm=llm, prompt=analyze_task_prompt)

        pydantic_parser = PydanticOutputParser(pydantic_object=Analysis)
        print(get_tools_overview(get_user_tools(tool_names)))
        completion = await chain.arun(
            {
                "goal": goal,
                "task": task,
                "tools_overview": get_tools_overview(get_user_tools(tool_names)),
            }
        )

        print("Analysis completion:\n", completion)
        try:
            return pydantic_parser.parse(completion)
        except Exception as error:
            print(f"Error parsing analysis: {error}")
            return get_default_analysis()

    def execute_task_agent(
        self,
        *,
        goal: str,
        task: str,
        analysis: Analysis,
    ) -> StreamingResponse:
        tool_class = get_tool_from_name(analysis.action)
        return tool_class(self.model_settings).call(goal, task, analysis.arg)

    async def create_tasks_agent(
        self,
        *,
        goal: str,
        tasks: List[str],
        last_task: str,
        result: str,
        completed_tasks: Optional[List[str]] = None,
    ) -> List[str]:
        llm = create_model(self.model_settings)
        chain = LLMChain(llm=llm, prompt=create_tasks_prompt)

        completion = await chain.arun(
            {
                "goal": goal,
                "language": self._language,
                "tasks": tasks,
                "lastTask": last_task,
                "result": result,
            }
        )

        return extract_tasks(completion, completed_tasks or [])
