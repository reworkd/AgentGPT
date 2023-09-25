from typing import Any, List

import aiohttp
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from googleapiclient.discovery import build

from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.stream_mock import stream_string
from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.agent.tools.utils import (
    CitedSnippet,
    summarize_with_sources,
)


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


async def _google_cse_search(query: str, k: int) -> List[CitedSnippet]:
    service = build("customsearch", "v1", developerKey=settings.google_api_key)
    request = service.cse().list(q=query, cx=settings.google_cse_id, num=k)
    response = request.execute()
    results = response.get("items", [])
    metadata_results = []
    for i, result in enumerate(results):
        texts = []
        link = ""
        if "snippet" in result:
            texts.append(result["snippet"])
        if "link" in result:
            link = result["link"]
        for attribute, value in result.get("attributes", {}).items():
            texts.append(f"{attribute}: {value}.")
        metadata_results.append(CitedSnippet(i + 1, "\n".join(texts), link))
    return metadata_results


class Search(Tool):
    description = (
        "Search Google for short up to date searches for simple questions about public information "
        "news and people.\n"
    )
    public_description = "Search google for information about current events."
    arg_description = "The query argument to search for. This value is always populated and cannot be an empty string."
    image_url = "/tools/google.png"

    @staticmethod
    def available() -> bool:
        if settings.google_search_api == "google_serp" and settings.serp_api_key:
            return True
        elif (
            settings.google_search_api == "google_cse"
            and settings.google_cse_id
            and settings.google_api_key
        ):
            return True
        return False

    async def call(
        self, goal: str, task: str, input_str: str, *args: Any, **kwargs: Any
    ) -> FastAPIStreamingResponse:
        snippets: List[CitedSnippet] = []
        k = 5  # Number of results to return

        if settings.google_search_api == "google_cse":
            snippets = await _google_cse_search(input_str, k)
        elif settings.google_search_api == "google_serp":
            results = await _google_serper_search_results(
                input_str,
            )

            if results.get("answerBox"):
                answer_values = []
                answer_box = results.get("answerBox", {})
                if answer_box.get("answer"):
                    answer_values.append(answer_box.get("answer"))
                elif answer_box.get("snippet"):
                    answer_values.append(answer_box.get("snippet").replace("\n", " "))
                elif answer_box.get("snippetHighlighted"):
                    answer_values.append(
                        ", ".join(answer_box.get("snippetHighlighted"))
                    )

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

        return summarize_with_sources(self.model, self.language, goal, task, snippets)
