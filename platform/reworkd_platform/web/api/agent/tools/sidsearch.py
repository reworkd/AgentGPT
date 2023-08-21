import json
from datetime import datetime, timedelta
from typing import Any, List

import aiohttp
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from loguru import logger

from reworkd_platform.db.crud.oauth import OAuthCrud
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.services.security import encryption_service
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.stream_mock import stream_string
from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.agent.tools.utils import (
    Snippet,
    summarize_sid,
)


async def _sid_search_results(
    search_term: str, limit: int, token: str
) -> dict[str, Any]:
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    data = {"query": search_term, "limit": limit}

    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://api.sid.ai/v1/users/me/query",
            headers=headers,
            data=json.dumps(data),
        ) as response:
            response.raise_for_status()
            search_results = await response.json()
            return search_results


async def get_new_token(refresh_token: str) -> tuple[str, datetime]:
    data = {
        "grant_type": "refresh_token",
        "client_id": settings.sid_client_id,
        "client_secret": settings.sid_client_secret,
        "redirect_uri": settings.sid_redirect_uri,
        "refresh_token": refresh_token,
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://auth.sid.ai/oauth/token", data=data
        ) as response:
            response.raise_for_status()
            response_data = await response.json()
            access_token = response_data["access_token"]
            expires_in = response_data["expires_in"]
    return access_token, datetime.now() + timedelta(seconds=expires_in)


class SID(Tool):
    public_description = "Grant access to your Notion, Google Drive, etc."
    description = """
        Find private information by searching through notion, email and google drive.
        Should be used when questions refer to personal information.
    """
    arg_description = (
        "The query to search for. It should be a question in natural language."
    )
    image_url = "/tools/sid.png"

    @staticmethod
    def available() -> bool:
        return settings.sid_enabled

    @staticmethod
    async def dynamic_available(user: UserBase, oauth_crud: OAuthCrud) -> bool:
        installation = await oauth_crud.get_installation_by_user_id(
            user_id=user.id, provider="sid"
        )

        return bool(installation and installation.access_token_enc)

    async def call(
        self,
        goal: str,
        task: str,
        input_str: str,
        user: UserBase,
        oauth_crud: OAuthCrud,
        *args: Any,
        **kwargs: Any,
    ) -> FastAPIStreamingResponse:
        installation = await oauth_crud.get_installation_by_user_id(
            user_id=user.id, provider="sid"
        )

        # if the tool is called, the installation should be available. However, it is possible that it is
        # disconnected in the meantime. In that case, we pretend as if no information is found.
        if not installation or not installation.access_token_enc:
            return stream_string("Unable to fetch SID results", True)

        # update token if close to expiration
        if installation.access_token_expiration > datetime.now() - timedelta(minutes=5):
            refresh_token = encryption_service.decrypt(installation.refresh_token_enc)
            access_token, expiration = await get_new_token(refresh_token)
            installation.access_token_enc = encryption_service.encrypt(access_token)
            installation.access_token_expiration = expiration
            await installation.save(oauth_crud.session)

        token = encryption_service.decrypt(installation.access_token_enc)

        res = await _sid_search_results(input_str, limit=10, token=token)
        try:
            snippets: List[Snippet] = [
                Snippet(text=result["text"]) for result in (res.get("results", []))
            ]
        except Exception as e:
            logger.exception(e)
            return stream_string("Unable to fetch SID results", True)

        if not snippets:
            return stream_string("No good results found by SID", True)

        return summarize_sid(self.model, self.language, goal, task, snippets)
