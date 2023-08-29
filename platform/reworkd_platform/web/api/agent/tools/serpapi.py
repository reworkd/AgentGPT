from typing import Any, List

import aiohttp
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse

from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.stream_mock import stream_string
from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.agent.tools.utils import (
    CitedSnippet,
    summarize_with_sources,
)

_engine_query_key = {
    "ebay": "_nkw",
    "google_maps_reviews": "data_id",
    "google_product": "product_id",
    "google_lens": "url",
    "google_immersive_product": "page_token",
    "google_scholar_author": "author_id",
    "google_scholar_profiles": "mauthors",
    "google_related_questions": "next_page_token",
    "google_finance_markets": "trend",
    "google_health_insurance": "provider_id",
    "home_depot_product": "product_id",
    "walmart": "query",
    "walmart_product": "product_id",
    "walmart_product_reviews": "product_id",
    "yahoo": "p",
    "yahoo_images": "p",
    "yahoo_videos": "p",
    "yandex": "text",
    "yandex_images": "text",
    "yandex_videos": "text",
    "youtube": "search_query",
    "google_play_product": "product_id",
    "yahoo_shopping": "p",
    "apple_app_store": "term",
    "apple_reviews": "product_id",
    "apple_product": "product_id",
    "naver": "query",
    "yelp": "find_desc",
    "yelp_reviews": "place_id",
}


# Search Google/Bing/Yahoo!/Baidu/DuckDuckGo/Yandex/Naver/... via serpapi.com.
async def _serpapi_search_results(search_term: str) -> dict[str, Any]:
    engine = settings.serpapi_engine or "google"
    query_key = _engine_query_key[engine] if engine in _engine_query_key else "q"
    params = {
        "engine": engine,
        query_key: search_term,
        "api_key": settings.serpapi_api_key,
        "source": "serpapi-agentgpt-tool",
    }

    if settings.serpapi_no_cache == True or settings.serpapi_no_cache == "true":
        params["no_cache"] = "true"

    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"https://serpapi.com/search", params=params
        ) as response:
            response.raise_for_status()
            return await response.json()


class SerpApi(Tool):
    description = (
        "Search Google/Bing/Yahoo!/Baidu/DuckDuckGo/Yandex/Naver/... for short up to date searches for simple questions about public information "
        "news and people.\n"
    )
    public_description = "Search the internet for information about current events."
    arg_description = "The query argument to search for. This value is always populated and cannot be an empty string."
    image_url = "/tools/serpapi.png"

    @staticmethod
    def available() -> bool:
        return settings.serpapi_api_key is not None and settings.serpapi_api_key != ""

    async def call(
        self, goal: str, task: str, input_str: str, *args: Any, **kwargs: Any
    ) -> FastAPIStreamingResponse:
        results = await _serpapi_search_results(input_str)

        k = 5  # Number of results to return
        snippets: List[CitedSnippet] = []

        if results.get("answer_box"):
            answer_values = []
            answer_box = results.get("answer_box", {})
            if type(answer_box) == list:
                answer_box = answer_box[0]
            if answer_box.get("answer"):
                answer_values.append(answer_box.get("answer"))
            elif answer_box.get("snippet"):
                answer_values.append(answer_box.get("snippet").replace("\n", " "))
            elif answer_box.get("snippet_highlighted_words"):
                answer_values.append(
                    ", ".join(answer_box.get("snippet_highlighted_words"))
                )

            if len(answer_values) > 0:
                return stream_string("\n".join(answer_values), True)

        for i, result in enumerate(results["organic_results"][:k]):
            texts = []
            link = ""
            if "snippet" in result:
                texts.append(result["snippet"])
            if "link" in result:
                link = result["link"]
            snippets.append(CitedSnippet(i + 1, "\n".join(texts), link))

        if len(snippets) == 0:
            return stream_string("No good search result was found", True)

        return summarize_with_sources(self.model, self.language, goal, task, snippets)
