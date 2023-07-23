from sqlalchemy import String
from sqlalchemy.orm import mapped_column

from reworkd_platform.db.base import TrackedModel


class Organization(TrackedModel):
    __tablename__ = "organization"

    name = mapped_column(String, nullable=False)
    created_by = mapped_column(String, nullable=False)


class OrganizationUser(TrackedModel):
    __tablename__ = "organization_user"

    user_id = mapped_column(String, nullable=False)
    organization_id = mapped_column(String, nullable=False)
    role = mapped_column(String, nullable=False, default="member")
