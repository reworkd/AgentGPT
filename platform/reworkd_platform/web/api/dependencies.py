from datetime import datetime
from typing import Annotated

from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.exc import NoResultFound

from reworkd_platform.db.crud.user import UserCrud
from reworkd_platform.db.dependencies import get_db_session
from reworkd_platform.schemas.user import UserBase, OrganizationRole


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
        raise _forbidden("Invalid session token")

    if session.expires <= datetime.utcnow():
        raise _forbidden("Session token expired")

    organization = None
    if x_organization_id and (
        org_usr := await crud.get_user_organization(session.user.id, x_organization_id)
    ):
        organization = OrganizationRole(
            id=org_usr.id,
            role=org_usr.role,
            organization_id=org_usr.organization_id,
        )

    return UserBase(
        id=session.user.id,
        name=session.user.name,
        email=session.user.email,
        organization=organization,
    )


def _forbidden(detail: str = "Forbidden") -> HTTPException:
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)
