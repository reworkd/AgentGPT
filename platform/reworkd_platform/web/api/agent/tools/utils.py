from typing import List

from langchain import LLMChain

from reworkd_platform.web.api.agent.agent_service.open_ai_agent_service import (
    create_model,
)
from reworkd_platform.web.api.agent.model_settings import ModelSettings
from reworkd_platform.web.api.agent.prompts import summarize_prompt


def summarize(
    model_settings: ModelSettings, goal: str, query: str, snippets: List[str]
) -> str:
    chain = LLMChain(llm=create_model(model_settings), prompt=summarize_prompt)

    return chain.run({"goal": goal, "query": query, "snippets": snippets})
