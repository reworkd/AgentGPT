import uuid

from sqlalchemy import Column, func, String
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped

from reworkd_platform.db.meta import meta


class Base(DeclarativeBase):
    """Base for all models."""

    metadata = meta
    id: Mapped[str] = Column(
        String,
        primary_key=True,
        default=lambda _: str(uuid.uuid4()),
        unique=True,
        nullable=False,
    )


class TrackedModel(Base):
    """Base for all tracked models."""

    __abstract__ = True

    create_date = Column(
        String, name="createDate", server_default=func.now(), nullable=False
    )
    delete_date = Column(String, name="deleteDate")

    @classmethod
    async def get(cls, session: AsyncSession, id_: str):
        return await session.get(cls, id_)

    async def save(self, session: AsyncSession):
        session.add(self)
        await session.flush()
        return self
