from dataclasses import dataclass
from typing import List

from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from lanarky.responses import StreamingResponse
from langchain import LLMChain
from langchain.chat_models.base import BaseChatModel


@dataclass
class CitedSnippet:
    index: int
    text: str
    url: str

    def __repr__(self) -> str:
        """
        The string representation the AI model will see
        """
        return f"{{i: {self.index}, text: {self.text}, url: {self.url}}}"


def summarize(
    model: BaseChatModel,
    language: str,
    goal: str,
    query: str,
    snippets: List[CitedSnippet],
) -> FastAPIStreamingResponse:
    from reworkd_platform.web.api.agent.prompts import summarize_prompt

    chain = LLMChain(llm=model, prompt=summarize_prompt)

    print(
        summarize_prompt.format_prompt(
            goal=goal, query=query, snippets=snippets, language=language
        )
    )
    return StreamingResponse.from_chain(
        chain,
        {
            "goal": goal,
            "query": query,
            "language": language,
            "snippets": snippets,
        },
        media_type="text/event-stream",
    )
