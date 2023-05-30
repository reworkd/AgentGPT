from typing import List

from lanarky.responses import StreamingResponse
from langchain import LLMChain

from reworkd_platform.web.api.agent.model_settings import ModelSettings, create_model


async def summarize(
    model_settings: ModelSettings, goal: str, query: str, snippets: List[str]
) -> StreamingResponse:
    from reworkd_platform.web.api.agent.prompts import summarize_prompt

    chain = LLMChain(llm=create_model(model_settings), prompt=summarize_prompt)

    return StreamingResponse.from_chain(
        chain,
        {"goal": goal, "query": query, "snippets": snippets},
        media_type="text/event-stream",
    )
