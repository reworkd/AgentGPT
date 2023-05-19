from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from sqlalchemy.orm.exc import NoResultFound

from reworkd_platform.db.dependencies import get_db_session
from reworkd_platform.db.models.user import UserSession

router = APIRouter()


class UserBase(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None


# Dependency
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
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid session token"
        )

    if session.expires > datetime.utcnow():
        return UserBase(name=session.user.name, email=session.user.email)

    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Token expired")


@router.get("/validate-session")
async def validate_session(
    current_user: UserBase = Depends(get_current_user),
) -> UserBase:
    try:
        return current_user
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while validating the session. {error}",
        )
