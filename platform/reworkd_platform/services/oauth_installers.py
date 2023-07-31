from abc import ABC, abstractmethod

from fastapi import Depends, Path
from slack_sdk import WebClient
from slack_sdk.oauth import AuthorizeUrlGenerator

from reworkd_platform.db.crud.oauth import OAuthCrud
from reworkd_platform.db.models.auth import OauthCredentials
from reworkd_platform.schemas import UserBase
from reworkd_platform.services.security import encryption_service
from reworkd_platform.settings import Settings, settings as platform_settings
from reworkd_platform.web.api.http_responses import forbidden


class OAuthInstaller(ABC):
    def __init__(self, crud: OAuthCrud, settings: Settings):
        self.crud = crud
        self.settings = settings

    @abstractmethod
    async def install(self, user: UserBase, redirect_uri: str) -> str:
        raise NotImplementedError()

    @abstractmethod
    async def install_callback(self, code: str, state: str) -> OauthCredentials:
        raise NotImplementedError()

    @staticmethod
    def store_access_token(creds: OauthCredentials, access_token: str) -> None:
        creds.access_token_enc = encryption_service.encrypt(access_token)


class SlackInstaller(OAuthInstaller):
    PROVIDER = "slack"

    async def install(self, user: UserBase, redirect_uri: str) -> str:
        installation = await self.crud.create_installation(
            user, self.PROVIDER, redirect_uri
        )

        return AuthorizeUrlGenerator(
            client_id=self.settings.slack_client_id,
            redirect_uri=self.settings.slack_redirect_uri,
            scopes=["chat:write"],
        ).generate(
            state=installation.state,
        )

    async def install_callback(self, code: str, state: str) -> OauthCredentials:
        creds = await self.crud.get_installation_by_state(state)
        if not creds:
            raise forbidden()

        oauth_response = WebClient().oauth_v2_access(
            client_id=self.settings.slack_client_id,
            client_secret=self.settings.slack_client_secret,
            code=code,
            state=state,
            redirect_uri=self.settings.slack_redirect_uri,
        )

        OAuthInstaller.store_access_token(creds, oauth_response["access_token"])
        creds.token_type = oauth_response["token_type"]
        creds.scope = oauth_response["scope"]
        return await creds.save(self.crud.session)


integrations = {
    SlackInstaller.PROVIDER: SlackInstaller,
}


def installer_factory(
    provider: str = Path(description="OAuth Provider"),
    crud: OAuthCrud = Depends(OAuthCrud.inject),
) -> OAuthInstaller:
    """Factory for OAuth installers
    Args:
        provider (str): OAuth Provider (can be slack, github, etc.) (injected)
        crud (OAuthCrud): OAuth Crud (injected)
    """

    if provider in integrations:
        return integrations[provider](crud, platform_settings)
    raise NotImplementedError()
