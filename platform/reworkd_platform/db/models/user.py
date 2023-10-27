from typing import List

from sqlalchemy import DateTime, ForeignKey, Index, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from reworkd_platform.db.base import Base


class UserSession(Base):
    __tablename__ = "Session"

    session_token = mapped_column(String, unique=True, name="sessionToken")
    user_id = mapped_column(
        String, ForeignKey("User.id", ondelete="CASCADE"), name="userId"
    )
    expires = mapped_column(DateTime)

    user = relationship("User")

    __table_args__ = (Index("user_id"),)


class User(Base):
    __tablename__ = "User"

    name = mapped_column(String, nullable=True)
    email = mapped_column(String, nullable=True, unique=True)
    email_verified = mapped_column(DateTime, nullable=True, name="emailVerified")
    image = mapped_column(String, nullable=True)
    create_date = mapped_column(
        DateTime, server_default=text("(now())"), name="createDate"
    )

    sessions: Mapped[List["UserSession"]] = relationship(
        "UserSession", back_populates="user"
    )

    __table_args__ = (Index("email"),)
