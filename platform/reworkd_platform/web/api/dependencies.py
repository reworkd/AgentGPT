from datetime import datetime

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.exc import NoResultFound

from reworkd_platform.db.crud import UserCrud
from reworkd_platform.db.dependencies import get_db_session
from reworkd_platform.db.models.user import User
from reworkd_platform.schemas import UserBase


def user_crud(
    session: AsyncSession = Depends(get_db_session),
) -> UserCrud:
    return UserCrud(session)


async def get_current_user(
    bearer: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    crud: UserCrud = Depends(user_crud),
) -> UserBase:
    session_token = bearer.credentials
    try:
        session = await crud.get_user_session(session_token)
    except NoResultFound:
        raise _forbidden("Invalid session token")

    user: User = session.user

    if session.expires > datetime.utcnow():
        return UserBase(
            id=str(user.id),
            name=str(user.name),
            email=str(user.email),
        )

    raise _forbidden("Session token expired")


def _forbidden(detail: str = "Forbidden") -> HTTPException:
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)
