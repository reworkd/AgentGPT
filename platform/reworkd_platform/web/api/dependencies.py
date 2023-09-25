from datetime import datetime
from typing import Annotated

from fastapi import Depends, Header
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.exc import NoResultFound

from reworkd_platform.db.crud.user import UserCrud
from reworkd_platform.db.dependencies import get_db_session
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.web.api.http_responses import forbidden


def user_crud(
    session: AsyncSession = Depends(get_db_session),
) -> UserCrud:
    return UserCrud(session)


async def get_current_user(
    x_organization_id: Annotated[str | None, Header()] = None,
    bearer: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    crud: UserCrud = Depends(user_crud),
) -> UserBase:
    session_token = bearer.credentials

    try:
        session = await crud.get_user_session(session_token)
    except NoResultFound:
        raise forbidden("Invalid session token")

    if session.expires <= datetime.utcnow():
        raise forbidden("Session token expired")

    return UserBase(
        id=session.user.id,
        name=session.user.name,
        email=session.user.email,
        image=session.user.image,
    )
