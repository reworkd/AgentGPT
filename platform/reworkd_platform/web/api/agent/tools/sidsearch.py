import json
from typing import Any, List

import aiohttp
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse

from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.stream_mock import stream_string
from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.agent.tools.utils import (
    Snippet,
    summarize_sid,
)

from reworkd_platform.db.crud.oauth import OAuthCrud
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.services.security import encryption_service

async def _sid_search_results(search_term: str, limit: int, token: str) -> dict[str, Any]:
    headers = {
        'Authorization': f'Bearer {token}',
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


class SID(Tool):
    public_description = "Grant access to your Notion, Google Drive, etc."
    description = """
        Retrieve snippets of non-public information by searching through google drive, notion, and gmail.
        Contains results which are unavailable from public sources.
    """
    arg_description = "The query to search for. It should be a question in natural language."
    image_url = "/tools/sid.png"

    @staticmethod
    def available() -> bool:
        return settings.refresh_token_debug is not None and settings.refresh_token_debug != ""

    async def call(
        self, goal: str, task: str, input_str: str, user: UserBase, oauth_crud: OAuthCrud,
    ) -> FastAPIStreamingResponse:
        installation = await oauth_crud.get_installation_by_user_id(user_id=user.id, provider='sid')
        if installation is None:
            return stream_string("Unable to fetch SID results", True)

        token = encryption_service.decrypt(installation.access_token_enc)

        res = await _sid_search_results(
            input_str, limit=10, token=token
        )

        snippets: List[Snippet] = [Snippet(text=result) for result in res.get("results")]

        if len(snippets) == 0:
            return stream_string("No good results found by SID", True)

        return summarize_sid(self.model, self.language, goal, task, snippets)
