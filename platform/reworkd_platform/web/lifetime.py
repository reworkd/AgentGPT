from typing import Awaitable, Callable

from fastapi import FastAPI
from sqlalchemy.ext.asyncio import async_sessionmaker

from reworkd_platform.db.meta import meta
from reworkd_platform.db.models import load_all_models
from reworkd_platform.db.utils import create_engine
from reworkd_platform.services.pinecone.lifetime import init_pinecone
from reworkd_platform.services.vecs.lifetime import (
    init_supabase_vecs,
    shutdown_supabase_vecs,
)


def _setup_db(app: FastAPI) -> None:  # pragma: no cover
    """
    Creates connection to the database.

    This function creates SQLAlchemy engine instance,
    session_factory for creating sessions
    and stores them in the application's state property.

    :param app: fastAPI application.
    """
    engine = create_engine()
    session_factory = async_sessionmaker(
        engine,
        expire_on_commit=False,
    )
    app.state.db_engine = engine
    app.state.db_session_factory = session_factory


async def _create_tables() -> None:  # pragma: no cover
    """Populates tables in the database."""
    load_all_models()

    engine = create_engine()
    async with engine.begin() as connection:
        await connection.run_sync(meta.create_all)
    await engine.dispose()


def register_startup_event(
    app: FastAPI,
) -> Callable[[], Awaitable[None]]:  # pragma: no cover
    """
    Actions to run on application startup.

    This function uses fastAPI app to store data
    in the state, such as db_engine.

    :param app: the fastAPI application.
    :return: function that actually performs actions.
    """

    @app.on_event("startup")
    async def _startup() -> None:  # noqa: WPS430
        _setup_db(app)
        init_pinecone()
        init_supabase_vecs(
            app
        )  # create pg_connection connection pool at startup as its expensive
        # await _create_tables()
        # await init_kafka(app)

    return _startup


def register_shutdown_event(
    app: FastAPI,
) -> Callable[[], Awaitable[None]]:  # pragma: no cover
    """
    Actions to run on application's shutdown.

    :param app: fastAPI application.
    :return: function that actually performs actions.
    """

    @app.on_event("shutdown")
    async def _shutdown() -> None:  # noqa: WPS430
        await app.state.db_engine.dispose()
        shutdown_supabase_vecs(app)
        # await shutdown_kafka(app)

    return _shutdown
