# from
from typing import List, Optional

from fastapi import Depends
from pydantic import BaseModel
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from reworkd_platform.db.crud.base import BaseCrud
from reworkd_platform.db.dependencies import get_db_session
from reworkd_platform.db.models.auth import Organization, OrganizationUser
from reworkd_platform.db.models.user import User
from reworkd_platform.schemas import UserBase
from reworkd_platform.web.api.dependencies import get_current_user


class OrgUser(BaseModel):
    id: str
    role: str
    user: UserBase


class OrganizationUsers(BaseModel):
    id: str
    name: str
    users: List[OrgUser]


class OrganizationCrud(BaseCrud):
    def __init__(self, session: AsyncSession, user: UserBase):
        super().__init__(session)
        self.user = user

    @classmethod
    def inject(
        cls,
        session: AsyncSession = Depends(get_db_session),
        user: UserBase = Depends(get_current_user),
    ) -> "OrganizationCrud":
        return cls(session, user)

    async def create_organization(self, name: str) -> Organization:
        return await Organization(
            created_by=self.user.id,
            name=name,
        ).save(self.session)

    async def get_by_name(self, name: str) -> Optional[OrganizationUsers]:
        owner = aliased(OrganizationUser, name="owner")

        query = (
            select(
                Organization,
                User,
                OrganizationUser,
            )
            .join(
                OrganizationUser,
                and_(
                    Organization.id == OrganizationUser.organization_id,
                ),
            )
            .join(
                User,
                User.id == OrganizationUser.user_id,
            )
            .join(  # Owner
                owner,
                and_(
                    OrganizationUser.organization_id == Organization.id,
                    OrganizationUser.user_id == self.user.id,
                ),
            )
            .filter(Organization.name == name)
        )

        rows = (await self.session.execute(query)).all()
        if not rows:
            return None

        org: Organization = rows[0][0]
        return OrganizationUsers(
            id=org.id,
            name=org.name,
            users=[
                OrgUser(
                    id=org_user.user_id,
                    role=org_user.role,
                    user=UserBase(
                        id=user.id,
                        email=user.email,
                        name=user.name,
                    ),
                )
                for [_, user, org_user] in rows
            ],
        )
