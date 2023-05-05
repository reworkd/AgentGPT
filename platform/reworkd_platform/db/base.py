from sqlalchemy.orm import DeclarativeBase

from reworkd_platform.db.meta import meta


class Base(DeclarativeBase):
    """Base for all models."""

    metadata = meta
