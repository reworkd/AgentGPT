from typing import Any, List

import aiohttp
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse

from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.stream_mock import stream_string
from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.agent.tools.utils import CitedSnippet, summarize

# Search google via serper.dev. Adapted from LangChain
# https://github.com/hwchase17/langchain/blob/master/langchain/utilities


async def _google_serper_search_results(
    search_term: str, search_type: str = "search"
) -> dict[str, Any]:
    headers = {
        "X-API-KEY": settings.serp_api_key or "",
        "Content-Type": "application/json",
    }
    params = {
        "q": search_term,
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"https://google.serper.dev/{search_type}", headers=headers, params=params
        ) as response:
            response.raise_for_status()
            search_results = await response.json()
            return search_results


class Search(Tool):
    description = (
        "Search Google for short up to date searches for simple questions "
        "news and people.\n"
    )
    public_description = "Search google for information about current events."
    arg_description = "The query argument to search for. This value is always populated and cannot be an empty string."

    @staticmethod
    def available() -> bool:
        return settings.serp_api_key is not None and settings.serp_api_key != ""

    async def call(
        self, goal: str, task: str, input_str: str
    ) -> FastAPIStreamingResponse:
        results = await _google_serper_search_results(
            input_str,
        )

        k = 5  # Number of results to return
        snippets: List[CitedSnippet] = []

        if results.get("answerBox"):
            answer_values = []
            answer_box = results.get("answerBox", {})
            if answer_box.get("answer"):
                answer_values.append(answer_box.get("answer"))
            elif answer_box.get("snippet"):
                answer_values.append(answer_box.get("snippet").replace("\n", " "))
            elif answer_box.get("snippetHighlighted"):
                answer_values.append(", ".join(answer_box.get("snippetHighlighted")))

            if len(answer_values) > 0:
                return stream_string("\n".join(answer_values), True)

        for i, result in enumerate(results["organic"][:k]):
            texts = []
            link = ""
            if "snippet" in result:
                texts.append(result["snippet"])
            if "link" in result:
                link = result["link"]
            for attribute, value in result.get("attributes", {}).items():
                texts.append(f"{attribute}: {value}.")
            snippets.append(CitedSnippet(i + 1, "\n".join(texts), link))

        if len(snippets) == 0:
            return stream_string("No good Google Search Result was found", True)

        return summarize(self.model, self.language, goal, task, snippets)
