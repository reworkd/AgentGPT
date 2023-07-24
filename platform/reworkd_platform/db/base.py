import uuid
from datetime import datetime
from typing import Optional, Type, TypeVar

from sqlalchemy import DateTime, String, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from reworkd_platform.db.meta import meta
from reworkd_platform.web.api.http_responses import not_found

T = TypeVar("T", bound="Base")


class Base(DeclarativeBase):
    """Base for all models."""

    metadata = meta
    id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
        default=lambda _: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )

    @classmethod
    async def get(cls: Type[T], session: AsyncSession, id_: str) -> Optional[T]:
        return await session.get(cls, id_)

    @classmethod
    async def get_or_404(cls: Type[T], session: AsyncSession, id_: str) -> T:
        if model := await cls.get(session, id_):
            return model

        raise not_found(detail=f"{cls.__name__}[{id_}] not found")

    async def save(self: T, session: AsyncSession) -> T:
        session.add(self)
        await session.flush()
        return self

    async def delete(self: T, session: AsyncSession) -> None:
        await session.delete(self)


class TrackedModel(Base):
    """Base for all tracked models."""

    __abstract__ = True

    create_date = mapped_column(
        DateTime, name="create_date", server_default=func.now(), nullable=False
    )
    update_date = mapped_column(
        DateTime, name="update_date", onupdate=func.now(), nullable=True
    )
    delete_date = mapped_column(DateTime, name="delete_date", nullable=True)

    async def delete(self, session: AsyncSession) -> None:
        """Marks the model as deleted."""
        self.delete_date = datetime.now()
        await self.save(session)


class UserMixin:
    user_id = mapped_column(String, name="user_id", nullable=False)
    organization_id = mapped_column(String, name="organization_id", nullable=True)
