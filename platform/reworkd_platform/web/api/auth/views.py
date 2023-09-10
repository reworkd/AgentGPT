from typing import Annotated, Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Form, HTTPException
from fastapi.responses import RedirectResponse
from loguru import logger
from pydantic import BaseModel
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

from reworkd_platform.db.crud.oauth import OAuthCrud
from reworkd_platform.db.crud.organization import OrganizationCrud, OrganizationUsers
from reworkd_platform.schemas import UserBase
from reworkd_platform.schemas.user import OrganizationRole
from reworkd_platform.services.oauth_installers import OAuthInstaller, installer_factory
from reworkd_platform.services.security import encryption_service
from reworkd_platform.settings import settings
from reworkd_platform.web.api.dependencies import get_current_user, get_organization
from reworkd_platform.web.api.http_responses import not_found

router = APIRouter()


@router.get("/organization/{name}")
async def organizations(
    name: str, crud: OrganizationCrud = Depends(OrganizationCrud.inject)
) -> OrganizationUsers:
    if org := await crud.get_by_name(name):
        return org
    raise HTTPException(status_code=404)


@router.get("/{provider}")
async def oauth_install(
    redirect: str = settings.frontend_url,
    user: UserBase = Depends(get_current_user),
    installer: OAuthInstaller = Depends(installer_factory),
) -> str:
    """Install an OAuth App"""
    return await installer.install(user, redirect)


@router.get("/{provider}/uninstall")
async def oauth_uninstall(
    user: UserBase = Depends(get_current_user),
    installer: OAuthInstaller = Depends(installer_factory),
) -> Dict[str, Any]:
    res = await installer.uninstall(user)
    return {
        "success": res,
    }


@router.get("/{provider}/callback")
async def oauth_callback(
    code: Optional[str] = None,
    state: Optional[str] = None,
    installer: OAuthInstaller = Depends(installer_factory),
) -> RedirectResponse:
    """Callback for OAuth App"""

    # if code or state are missing (user cancelled), redirect to frontend
    if not code or not state:
        return RedirectResponse(url=settings.frontend_url)

    creds = await installer.install_callback(code, state)
    return RedirectResponse(url=creds.redirect_uri)


@router.get("/sid/info")
async def sid_info(
    user: UserBase = Depends(get_current_user),
    crud: OAuthCrud = Depends(OAuthCrud.inject),
) -> Dict[str, Any]:
    creds = await crud.get_installation_by_user_id(user.id, "sid")
    return {
        "connected": bool(creds and creds.access_token_enc),
    }


class Channel(BaseModel):
    name: str
    id: str


def get_all_conversations(client: WebClient) -> List[Channel]:
    all_conversations = []
    cursor = None

    while True:
        try:
            response = client.conversations_list(
                cursor=cursor, limit=1000, types=["public_channel"]
            )
            all_conversations.extend(response["channels"])

            if not (cursor := response["response_metadata"]["next_cursor"]):
                break

        except SlackApiError as e:
            logger.exception(e)
            break

    return [Channel(name=c["name"], id=c["id"]) for c in all_conversations]
