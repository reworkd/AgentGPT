import json
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


async def _sid_search_results(search_term: str, limit: int) -> dict[str, Any]:
    #TODO instead of hardcoding the access token it needs to be obtained through an auth token exchange
    headers = {
        'Authorization': 'Bearer <add authorization>',
        'Content-Type': 'application/json'
    }
    data = {
        'query': search_term,
        'limit': limit
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://api.sid.ai/api/v1/users/me/data/query", headers=headers,
            data=json.dumps(data)
        ) as response:
            response.raise_for_status()
            search_results = await response.json()
            return search_results


class SIDSearch(Tool):
    description = "Retrieve personal information of the user from their files and emails."
    public_description = "Grant access to your Notion, Google Drive, etc."
    arg_description = "The query argument to search for. This value is always populated and cannot be an empty string."
    image_url = "/tools/sid.png"

    @staticmethod
    def available() -> bool:
        return settings.refresh_token_debug is not None and settings.refresh_token_debug != ""

    async def call(
        self, goal: str, task: str, input_str: str
    ) -> FastAPIStreamingResponse:
        res = await _sid_search_results(
            input_str, limit=5
        )

        k = 5  # Number of results to return
        snippets: List[CitedSnippet] = []
        results = res.get("results")

        for i, result in enumerate(results[:k]):
            snippets.append(CitedSnippet(i + 1, result, ""))

        if len(snippets) == 0:
            return stream_string("No good SIDSearch Result was found", True)

        return summarize_with_sources(self.model, self.language, goal, task, snippets)
