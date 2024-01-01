from ssl import CERT_REQUIRED

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from reworkd_platform.services.ssl import get_ssl_context
from reworkd_platform.settings import settings


def create_engine() -> AsyncEngine:
    """
    Creates SQLAlchemy engine instance.

    :return: SQLAlchemy engine instance.
    """
    if settings.environment == "development":
        return create_async_engine(
            str(settings.db_url),
            echo=settings.db_echo,
        )

    ssl_context = get_ssl_context(settings)
    ssl_context.verify_mode = CERT_REQUIRED
    connect_args = {"ssl": ssl_context}

    return create_async_engine(
        str(settings.db_url),
        echo=settings.db_echo,
        connect_args=connect_args,
    )


async def create_database() -> None:
    """Create a database."""
    engine = create_async_engine(str(settings.db_url.with_path("/mysql")))

    async with engine.connect() as conn:
        database_existance = await conn.execute(
            text(
                "SELECT 1 FROM INFORMATION_SCHEMA.SCHEMATA"  # noqa: S608
                f" WHERE SCHEMA_NAME='{settings.db_base}';",
            )
        )
        database_exists = database_existance.scalar() == 1

    if database_exists:
        await drop_database()

    async with engine.connect() as conn:  # noqa: WPS440
        await conn.execute(text(f"CREATE DATABASE {settings.db_base};"))


async def drop_database() -> None:
    """Drop current database."""
    engine = create_async_engine(str(settings.db_url.with_path("/mysql")))
    async with engine.connect() as conn:
        await conn.execute(text(f"DROP DATABASE {settings.db_base};"))
