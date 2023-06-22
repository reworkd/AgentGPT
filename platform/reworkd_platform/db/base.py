import uuid
from typing import Optional, Type, TypeVar

from sqlalchemy import Column, DateTime, String, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase

from reworkd_platform.db.meta import meta


class Base(DeclarativeBase):
    """Base for all models."""

    metadata = meta
    id = Column(
        String,
        primary_key=True,
        default=lambda _: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )


T = TypeVar("T")


class TrackedModel(Base):
    """Base for all tracked models."""

    __abstract__ = True

    create_date = Column(
        DateTime, name="create_date", server_default=func.now(), nullable=False
    )

    @classmethod
    async def get(cls: Type[T], session: AsyncSession, id_: str) -> Optional[T]:
        return await session.get(cls, id_)

    async def save(self: T, session: AsyncSession) -> T:
        session.add(self)
        await session.flush()
        return self
