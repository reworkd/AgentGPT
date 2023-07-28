from typing import Annotated, Dict, List

from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from slack_sdk import WebClient

from reworkd_platform.db.crud.oauth import OAuthCrud
from reworkd_platform.db.crud.organization import OrganizationCrud, OrganizationUsers
from reworkd_platform.schemas import UserBase
from reworkd_platform.schemas.user import OrganizationRole
from reworkd_platform.services.oauth_installers import (
    installer_factory,
    OAuthInstaller,
)
from reworkd_platform.services.security import encryption_service
from reworkd_platform.services.sockets import websockets
from reworkd_platform.settings import settings
from reworkd_platform.web.api.dependencies import get_current_user, get_organization
from reworkd_platform.web.api.http_responses import forbidden

router = APIRouter()


@router.get("/organization/{name}")
async def organizations(
    name: str, crud: OrganizationCrud = Depends(OrganizationCrud.inject)
) -> OrganizationUsers:
    if org := await crud.get_by_name(name):
        return org
    raise HTTPException(status_code=404)


# @router.post("/organization")
# async def create_organization():
#     """Create an organization"""
#     pass
#
#
# @router.get("/organization/{organization_id}")
# async def organization(organization_id: str):
#     """Get an organization by ID"""
#     pass
#
#
# @router.put("/organization/{organization_id}")
# async def update_organization(organization_id: str):
#     """Update an organization by ID"""
#     pass


@router.post("/pusher")
async def pusher_authentication(
    channel_name: Annotated[str, Form()],
    socket_id: Annotated[str, Form()],
    user: UserBase = Depends(get_current_user),
) -> Dict[str, str]:
    return websockets.authenticate(user, channel_name, socket_id)


@router.get("/{provider}")
async def oauth_install(
    redirect: str = settings.frontend_url,
    user: UserBase = Depends(get_current_user),
    installer: OAuthInstaller = Depends(installer_factory),
) -> str:
    """Install an OAuth App"""
    return await installer.install(user, redirect)


@router.get("/{provider}/callback")
async def oauth_callback(
    code: str,
    state: str,
    installer: OAuthInstaller = Depends(installer_factory),
) -> RedirectResponse:
    """Callback for OAuth App"""
    creds = await installer.install_callback(code, state)

    return RedirectResponse(url=creds.redirect_uri)


class Channel(BaseModel):
    name: str
    id: str


@router.get("/slack/info")
async def slack_channels(
    org: OrganizationRole = Depends(get_organization),
    crud: OAuthCrud = Depends(OAuthCrud.inject),
) -> List[Channel]:
    """Install an OAuth App"""
    if not (creds := await crud.get_installation_by_organization_id(org.id, "slack")):
        raise forbidden()

    token = encryption_service.decrypt(creds.access_token_enc)
    client = WebClient(token=token)
    channels = [
        Channel(name=c["name"], id=c["id"])
        for c in client.conversations_list(types=["public_channel"])["channels"]
    ]

    return channels
