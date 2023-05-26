from datetime import datetime
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from sqlalchemy.orm.exc import NoResultFound

from reworkd_platform.db.dependencies import get_db_session
from reworkd_platform.db.models.user import UserSession


class UserBase(BaseModel):
    id: str
    name: Optional[str]
    email: Optional[str]


async def get_current_user(
    bearer: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: AsyncSession = Depends(get_db_session),
) -> UserBase:
    session_token = bearer.credentials
    try:
        session: UserSession = (
            await db.execute(
                select(UserSession)
                .options(joinedload(UserSession.user))
                .filter(UserSession.session_token == session_token)
            )
        ).scalar_one()
    except NoResultFound:
        raise _forbidden("Invalid session token")

    if session.expires > datetime.utcnow():
        return UserBase(
            id=session.user.id, name=session.user.name, email=session.user.email
        )

    raise _forbidden("Session token expired")


async def admin_only(user: UserBase = Depends(get_current_user)):
    if user.email.endswith("@reworkd.ai"):
        return user

    raise _forbidden("Invalid session token")


def _forbidden(detail: str = "Forbidden") -> HTTPException:
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)
