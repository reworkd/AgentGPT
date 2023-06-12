from dataclasses import dataclass
from typing import List

from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from lanarky.responses import StreamingResponse
from langchain import LLMChain

from reworkd_platform.schemas import ModelSettings
from reworkd_platform.web.api.agent.model_settings import create_model


@dataclass
class CitedSnippet:
    index: int
    text: str
    url: str


def summarize(
    model_settings: ModelSettings, goal: str, query: str, snippets: List[CitedSnippet]
) -> FastAPIStreamingResponse:
    from reworkd_platform.web.api.agent.prompts import summarize_prompt

    chain = LLMChain(
        llm=create_model(model_settings, streaming=True), prompt=summarize_prompt
    )

    return StreamingResponse.from_chain(
        chain,
        {
            "goal": goal,
            "query": query,
            "language": model_settings.language,
            "snippets": snippets,
        },
        media_type="text/event-stream",
    )
