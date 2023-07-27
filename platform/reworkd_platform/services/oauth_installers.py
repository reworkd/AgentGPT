# from slack.web import WebClient
from abc import ABC, abstractmethod
from typing import TypeVar

from fastapi import Depends, Path
from slack_sdk import WebClient
from slack_sdk.oauth import AuthorizeUrlGenerator

from reworkd_platform.db.crud.oauth import OAuthCrud
from reworkd_platform.db.models.auth import OauthCredentials
from reworkd_platform.schemas import UserBase
from reworkd_platform.settings import Settings, settings as platform_settings
from reworkd_platform.web.api.http_responses import forbidden

T = TypeVar("T", bound="OAuthInstaller")


class OAuthInstaller(ABC):
    def __init__(self, crud: OAuthCrud, settings: Settings):
        self.crud = crud
        self.settings = settings

    @abstractmethod
    async def install(self, user: UserBase) -> str:
        raise NotImplementedError()

    @abstractmethod
    async def install_callback(self, code: str, state: str) -> None:
        raise NotImplementedError()


class SlackInstaller(OAuthInstaller):
    PROVIDER = "slack"

    async def install(self, user: UserBase) -> str:
        installation = await self.crud.create_installation(user, self.PROVIDER)

        return AuthorizeUrlGenerator(
            client_id=self.settings.slack_client_id,
            redirect_uri=self.settings.slack_redirect_uri,
            scopes=["chat:write"],
        ).generate(
            state=installation.state,
        )

    async def install_callback(self, code: str, state: str) -> None:
        installation = await self.crud.get_installation_by_state(state)
        if not installation:
            raise forbidden()

        oauth_response = WebClient().oauth_v2_access(
            client_id=self.settings.slack_client_id,
            client_secret=self.settings.slack_client_secret,
            code=code,
            state=state,
        )

        # We should handle token rotation / refresh tokens eventually
        # TODO: encode token
        await OauthCredentials(
            installation_id=installation.id,
            provider="slack",
            token_type=oauth_response["token_type"],
            access_token=oauth_response["access_token"],
            scope=oauth_response["scope"],
            data=oauth_response.data,
        ).save(self.crud.session)


integrations = {
    SlackInstaller.PROVIDER: SlackInstaller,
}


def installer_factory(
    provider: str = Path(description="OAuth Provider"),
    crud: OAuthCrud = Depends(OAuthCrud.inject),
) -> OAuthInstaller:
    if provider in integrations:
        return integrations[provider](crud, platform_settings)
    raise NotImplementedError()
