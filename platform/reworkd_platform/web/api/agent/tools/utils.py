from typing import List

from langchain import LLMChain

from reworkd_platform.web.api.agent.model_settings import ModelSettings, create_model


def summarize(
    model_settings: ModelSettings, goal: str, query: str, snippets: List[str]
) -> str:
    from reworkd_platform.web.api.agent.prompts import summarize_prompt

    chain = LLMChain(llm=create_model(model_settings), prompt=summarize_prompt)

    return chain.run({"goal": goal, "query": query, "snippets": snippets})
