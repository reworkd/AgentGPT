import secrets
from typing import Optional

from fastapi import Depends
from sqlalchemy import select
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