from typing import List, Optional

from lanarky.responses import StreamingResponse
from langchain.chat_models.base import BaseChatModel
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate
from loguru import logger
from pydantic import ValidationError

from reworkd_platform.web.api.agent.agent_service.agent_service import AgentService
from reworkd_platform.web.api.agent.analysis import Analysis, AnalysisArguments
from reworkd_platform.web.api.agent.helpers import (
    call_model_with_handling,
    openai_error_handler,
    parse_with_handling,
)
from reworkd_platform.web.api.agent.prompts import (
    analyze_task_prompt,
    create_tasks_prompt,
    start_goal_prompt,
)
from reworkd_platform.web.api.agent.task_output_parser import TaskOutputParser
from reworkd_platform.web.api.agent.tools.open_ai_function import get_tool_function
from reworkd_platform.web.api.agent.tools.tools import (
    get_default_tool,
    get_tool_from_name,
    get_tool_name,
    get_user_tools,
)
from reworkd_platform.web.api.errors import OpenAIError
from reworkd_platform.web.api.memory.memory import AgentMemory


class OpenAIAgentService(AgentService):
    def __init__(
        self,
        model: BaseChatModel,
        language: str,
        agent_memory: AgentMemory,
    ):
        self.model = model
        self.agent_memory = agent_memory
        self.language = language

    async def start_goal_agent(self, *, goal: str) -> List[str]:
        completion = await call_model_with_handling(
            self.model,
            ChatPromptTemplate.from_messages(
                [SystemMessagePromptTemplate(prompt=start_goal_prompt)]
            ),
            {"goal": goal, "language": self.language},
        )

        task_output_parser = TaskOutputParser(completed_tasks=[])
        tasks = parse_with_handling(task_output_parser, completion)

        with self.agent_memory as memory:
            memory.reset_class()
            memory.add_tasks(tasks)

        return tasks

    async def analyze_task_agent(
        self, *, goal: str, task: str, tool_names: List[str]
    ) -> Analysis:
        message = await openai_error_handler(
            func=self.model.apredict_messages,
            messages=analyze_task_prompt.format_prompt(
                goal=goal,
                task=task,
                language=self.language,
            ).to_messages(),
            functions=list(map(get_tool_function, get_user_tools(tool_names))),
        )

        function_call = message.additional_kwargs.get("function_call", {})
        completion = function_call.get("arguments", "")

        try:
            pydantic_parser = PydanticOutputParser(pydantic_object=AnalysisArguments)
            analysis_arguments = parse_with_handling(pydantic_parser, completion)
            return Analysis(
                action=function_call.get("name", get_tool_name(get_default_tool())),
                **analysis_arguments.dict(),
            )
        except (OpenAIError, ValidationError):
            return Analysis.get_default_analysis()

    async def execute_task_agent(
        self,
        *,
        goal: str,
        task: str,
        analysis: Analysis,
    ) -> StreamingResponse:
        print("Execution analysis:", analysis)

        tool_class = get_tool_from_name(analysis.action)
        return await tool_class(self.model, self.language).call(
            goal, task, analysis.arg
        )

    async def create_tasks_agent(
        self,
        *,
        goal: str,
        tasks: List[str],
        last_task: str,
        result: str,
        completed_tasks: Optional[List[str]] = None,
    ) -> List[str]:
        completion = await call_model_with_handling(
            self.model,
            ChatPromptTemplate.from_messages(
                [SystemMessagePromptTemplate(prompt=create_tasks_prompt)]
            ),
            {
                "goal": goal,
                "language": self.language,
                "tasks": "\n".join(tasks),
                "lastTask": last_task,
                "result": result,
            },
        )

        previous_tasks = (completed_tasks or []) + tasks
        tasks = [completion] if completion not in previous_tasks else []

        unique_tasks = []
        with self.agent_memory as memory:
            for task in tasks:
                similar_tasks = memory.get_similar_tasks(task)

                # Check if similar tasks are found
                if not similar_tasks:
                    unique_tasks.append(task)
                else:
                    logger.info(f"Similar tasks to '{task}' found: {similar_tasks}")

            if unique_tasks:
                memory.add_tasks(unique_tasks)

        return unique_tasks
