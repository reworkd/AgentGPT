from os import environ
from random import randint
from typing import List, Optional

from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI

from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.agent_service.agent_service import AgentService
from reworkd_platform.web.api.agent.analysis import Analysis, get_default_analysis
from reworkd_platform.web.api.agent.helpers import extract_tasks
from reworkd_platform.web.api.agent.model_settings import ModelSettings
from reworkd_platform.web.api.agent.prompts import (
    start_goal_prompt,
    analyze_task_prompt,
    execute_task_prompt,
    create_tasks_prompt,
)

GPT_35_TURBO = "gpt-3.5-turbo"


def get_server_side_key() -> str:
    keys = [
        key.strip() for key in (settings.openai_api_key or "").split(",") if key.strip()
    ]
    return keys[randint(0, len(keys) - 1)] if keys else ""


def create_model(model_settings: Optional[ModelSettings]) -> ChatOpenAI:
    _model_settings = model_settings

    if not model_settings or not model_settings.customApiKey:
        _model_settings = None

    return ChatOpenAI(
        openai_api_key=_model_settings.customApiKey
        if _model_settings
        else get_server_side_key(),
        temperature=_model_settings.customTemperature
        if _model_settings and _model_settings.customTemperature is not None
        else 0.9,
        model_name=_model_settings.customModelName
        if _model_settings and _model_settings.customModelName is not None
        else GPT_35_TURBO,
        max_tokens=_model_settings.maxTokens
        if _model_settings and _model_settings.maxTokens is not None
        else 400,
    )


class OpenAIAgentService(AgentService):
    async def start_goal_agent(
        self, model_settings: ModelSettings, goal: str, language: str
    ) -> List[str]:
        llm = create_model(model_settings)
        chain = LLMChain(llm=llm, prompt=start_goal_prompt)

        completion = chain.run({"goal": goal, "language": language})
        print(f"Goal: {goal}, Completion: {completion}")
        return extract_tasks(completion, [])

    async def analyze_task_agent(
        self, model_settings: ModelSettings, goal: str, task: str
    ) -> Analysis:
        llm = create_model(model_settings)
        chain = LLMChain(llm=llm, prompt=analyze_task_prompt)
        actions = ["reason", "search"]

        completion = chain.run({"goal": goal, "task": task, "actions": actions})
        print("Analysis completion:\n", completion)
        try:
            return Analysis.parse_raw(completion)
        except Exception as error:
            print(f"Error parsing analysis: {error}")
            return get_default_analysis()

    async def execute_task_agent(
        self,
        model_settings: ModelSettings,
        goal: str,
        language: str,
        task: str,
        analysis: Analysis,
    ) -> str:
        print("Execution analysis:", analysis)

        if analysis.action == "search" and environ.get("SERP_API_KEY"):
            # Implement SERP API call using Serper class if available
            pass

        llm = create_model(model_settings)
        chain = LLMChain(llm=llm, prompt=execute_task_prompt)

        completion = chain.run({"goal": goal, "language": language, "task": task})

        if analysis.action == "search" and not environ.get("SERP_API_KEY"):
            return (
                f"ERROR: Failed to search as no SERP_API_KEY is provided in ENV."
                f"\n\n{completion}"
            )
        return completion

    async def create_tasks_agent(
        self,
        model_settings: ModelSettings,
        goal: str,
        language: str,
        tasks: List[str],
        last_task: str,
        result: str,
        completed_tasks: Optional[List[str]] = None,
    ) -> List[str]:
        llm = create_model(model_settings)
        chain = LLMChain(llm=llm, prompt=create_tasks_prompt)

        completion = chain.run(
            {
                "goal": goal,
                "language": language,
                "tasks": tasks,
                "last_task": last_task,
                "result": result,
            }
        )

        return extract_tasks(completion, completed_tasks or [])
