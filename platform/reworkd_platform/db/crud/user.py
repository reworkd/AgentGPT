from sqlalchemy import select
from sqlalchemy.orm import selectinload

from reworkd_platform.db.crud.base import BaseCrud
from reworkd_platform.db.models.user import UserSession


class UserCrud(BaseCrud):
    async def get_user_session(self, token: str) -> UserSession:
        query = (
            select(UserSession)
            .filter(UserSession.session_token == token)
            .options(selectinload(UserSession.user))
        )
        return (await self.session.execute(query)).scalar_one()
