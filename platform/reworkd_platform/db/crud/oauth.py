import secrets
from typing import Dict, Optional

from fastapi import Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from reworkd_platform.db.crud.base import BaseCrud
from reworkd_platform.db.dependencies import get_db_session
from reworkd_platform.db.models.auth import OauthCredentials
from reworkd_platform.schemas import UserBase


class OAuthCrud(BaseCrud):
    @classmethod
    async def inject(
        cls,
        session: AsyncSession = Depends(get_db_session),
    ) -> "OAuthCrud":
        return cls(session)

    async def create_installation(
        self, user: UserBase, provider: str, redirect_uri: Optional[str]
    ) -> OauthCredentials:
        return await OauthCredentials(
            user_id=user.id,
            organization_id=user.organization_id,
            provider=provider,
            state=secrets.token_hex(16),
            redirect_uri=redirect_uri,
        ).save(self.session)

    async def get_installation_by_state(self, state: str) -> Optional[OauthCredentials]:
        query = select(OauthCredentials).filter(OauthCredentials.state == state)

        return (await self.session.execute(query)).scalar_one_or_none()

    async def get_installation_by_user_id(
        self, user_id: str, provider: str
    ) -> Optional[OauthCredentials]:
        query = select(OauthCredentials).filter(
            OauthCredentials.user_id == user_id,
            OauthCredentials.provider == provider,
            OauthCredentials.access_token_enc.isnot(None),
        )

        return (await self.session.execute(query)).scalars().first()

    async def get_installation_by_organization_id(
        self, organization_id: str, provider: str
    ) -> Optional[OauthCredentials]:
        query = select(OauthCredentials).filter(
            OauthCredentials.organization_id == organization_id,
            OauthCredentials.provider == provider,
            OauthCredentials.access_token_enc.isnot(None),
            OauthCredentials.organization_id.isnot(None),
        )

        return (await self.session.execute(query)).scalars().first()

    async def get_all(self, user: UserBase) -> Dict[str, str]:
        query = (
            select(
                OauthCredentials.provider,
                func.any_value(OauthCredentials.access_token_enc),
            )
            .filter(
                OauthCredentials.access_token_enc.isnot(None),
                OauthCredentials.organization_id == user.organization_id,
            )
            .group_by(OauthCredentials.provider)
        )

        return {
            provider: token
            for provider, token in (await self.session.execute(query)).all()
        }
