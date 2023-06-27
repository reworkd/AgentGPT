import uuid
from typing import List

from sqlalchemy import Column, DateTime, ForeignKey, Index, String, text
from sqlalchemy.orm import Mapped, relationship

from reworkd_platform.db.base import Base


class UserSession(Base):
    __tablename__ = "Session"

    id = Column(
        String,
        primary_key=True,
        default=lambda _: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    session_token = Column(String, unique=True, name="sessionToken")
    user_id = Column(String, ForeignKey("User.id", ondelete="CASCADE"), name="userId")
    expires = Column(DateTime)

    user = relationship("User")

    __table_args__ = (Index("user_id"),)


class User(Base):
    __tablename__ = "User"

    id = Column(
        String,
        primary_key=True,
        default=lambda _: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )
    name = Column(String, nullable=True)
    email = Column(String, nullable=True, unique=True)
    email_verified = Column(DateTime, nullable=True, name="emailVerified")
    image = Column(String, nullable=True)
    create_date = Column(DateTime, server_default=text("(now())"), name="createDate")

    sessions: Mapped[List["UserSession"]] = relationship(
        "UserSession", back_populates="user"
    )

    __table_args__ = (Index("email"),)
