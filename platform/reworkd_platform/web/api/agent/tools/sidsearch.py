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
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im9lOTV3WWlYbTdCcmhvTWJveU96ViJ9.eyJpc3MiOiJodHRwczovL2F1dGguc2lkLmFpLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTE0NTMwNDAzNjQzNzA2MzIxMDg5IiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2lkLmFpL2FwaS92MS8iLCJpYXQiOjE2OTEyNTU3NjcsImV4cCI6MTY5MTM0MjE2NywiYXpwIjoicjFCeUw1QmlyOUZCOEVRb1BwSFVvc2ZyOHVTbHVqVFciLCJzY29wZSI6InF1ZXJ5OmRhdGEgb2ZmbGluZV9hY2Nlc3MifQ.a8J7oRaF8rxvmMxSneLIEQzFyKSsooOc2r1ySTVBi4xtQugMpBstRILgYxxqHgB36iallENbwM9RUK5iuxtqpJehLXmJ4c4lMCQqzKPM6fNpY4AphzM3onVXrJziZl_wj1NnQa40NBfRhScSbEpL-IVdtTBjY7W1YDZesdCxU-GGzW81fr6Q2MWPrTl6B_BDy4S91B_6pVQe4rwSyNqdJJwkD-KReCWt2xdSzCLFkGa8q5iOimZyfYu7iHOt1aB7IVW5iGWw25ouWZ0kTcThqbKvABztjku4sC1I6QEA_A9XMm0coAKYCaVD1rwZYm6KbMsX3tdyJIuZLzGJrzDmqA',
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
    description = "Search through the users Google Drive, Notion, GMail, etc."
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
