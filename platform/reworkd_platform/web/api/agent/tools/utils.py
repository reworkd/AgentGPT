from dataclasses import dataclass
from typing import List, AsyncGenerator

from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from lanarky.responses import StreamingResponse
from ollama import Client  # Updated import

@dataclass
class CitedSnippet:
    index: int
    text: str
    url: str = ""

    def __repr__(self) -> str:
        """
        The string representation the AI model will see
        """
        return f"{{i: {self.index}, text: {self.text}, url: {self.url}}}"


@dataclass
class Snippet:
    text: str

    def __repr__(self) -> str:
        """
        The string representation the AI model will see
        """
        return f"{{text: {self.text}}}"


async def summarize(
    client: Client,
    language: str,
    goal: str,
    text: str,
) -> FastAPIStreamingResponse:
    from reworkd_platform.web.api.agent.prompts import summarize_prompt

    response = client.chat(
        model="llama3.2",
        messages=[
            {"role": "system", "content": summarize_prompt},
            {"role": "user", "content": text}
        ],
        stream=True,
    )

    async def stream_response():
        for chunk in response:
            yield chunk['message']['content']

    return FastAPIStreamingResponse(stream_response(), media_type="text/event-stream")


async def summarize_with_sources(
    client: Client,
    language: str,
    goal: str,
    query: str,
    snippets: List[CitedSnippet],
) -> FastAPIStreamingResponse:
    from reworkd_platform.web.api.agent.prompts import summarize_with_sources_prompt

    combined_snippets = "\n".join([snippet.text for snippet in snippets])

    response = client.chat(
        model="llama3.2",
        messages=[
            {"role": "system", "content": summarize_with_sources_prompt},
            {"role": "user", "content": combined_snippets}
        ],
        stream=True,
    )

    async def stream_response():
        for chunk in response:
            yield chunk['message']['content']

    return FastAPIStreamingResponse(stream_response(), media_type="text/event-stream")


async def summarize_sid(
    client: Client,
    language: str,
    goal: str,
    query: str,
    snippets: List[Snippet],
) -> FastAPIStreamingResponse:
    from reworkd_platform.web.api.agent.prompts import summarize_sid_prompt

    combined_snippets = "\n".join([snippet.text for snippet in snippets])

    response = client.chat(
        model="llama3.2",
        messages=[
            {"role": "system", "content": summarize_sid_prompt},
            {"role": "user", "content": combined_snippets}
        ],
        stream=True,
    )

    async def stream_response():
        for chunk in response:
            yield chunk['message']['content']

    return FastAPIStreamingResponse(stream_response(), media_type="text/event-stream")
