import asyncio
from asyncio.events import AbstractEventLoop
import sys
from typing import Any, Generator, AsyncGenerator

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
import uuid
from unittest.mock import Mock
from aiokafka import AIOKafkaProducer
from reworkd_platform.services.kafka.dependencies import get_kafka_producer
from reworkd_platform.services.kafka.lifetime import init_kafka, shutdown_kafka

from reworkd_platform.settings import settings
from reworkd_platform.web.application import get_app
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    AsyncEngine,
    AsyncConnection,
    async_sessionmaker,
)
from reworkd_platform.db.dependencies import get_db_session
from reworkd_platform.db.utils import create_database, drop_database


@pytest.fixture(scope="session")
def anyio_backend() -> str:
    """
    Backend for anyio pytest plugin.

    :return: backend name.
    """
    return "asyncio"


@pytest.fixture(scope="session")
async def _engine() -> AsyncGenerator[AsyncEngine, None]:
    """
    Create engine and databases.

    :yield: new engine.
    """
    from reworkd_platform.db.meta import meta  # noqa: WPS433
    from reworkd_platform.db.models import load_all_models  # noqa: WPS433

    load_all_models()

    await create_database()

    engine = create_async_engine(str(settings.db_url))
    async with engine.begin() as conn:
        await conn.run_sync(meta.create_all)

    try:
        yield engine
    finally:
        await engine.dispose()
        await drop_database()


@pytest.fixture
async def dbsession(
    _engine: AsyncEngine,
) -> AsyncGenerator[AsyncSession, None]:
    """
    Get session to database.

    Fixture that returns a SQLAlchemy session with a SAVEPOINT, and the rollback to it
    after the test completes.

    :param _engine: current engine.
    :yields: async session.
    """
    connection = await _engine.connect()
    trans = await connection.begin()

    session_maker = async_sessionmaker(
        connection,
        expire_on_commit=False,
    )
    session = session_maker()

    try:
        yield session
    finally:
        await session.close()
        await trans.rollback()
        await connection.close()


@pytest.fixture
async def test_kafka_producer() -> AsyncGenerator[AIOKafkaProducer, None]:
    """
    Creates kafka's producer.

    :yields: kafka's producer.
    """
    app_mock = Mock()
    await init_kafka(app_mock)
    yield app_mock.state.kafka_producer
    await shutdown_kafka(app_mock)


@pytest.fixture
def fastapi_app(
    dbsession: AsyncSession,
    test_kafka_producer: AIOKafkaProducer,
) -> FastAPI:
    """
    Fixture for creating FastAPI app.

    :return: fastapi app with mocked dependencies.
    """
    application = get_app()
    application.dependency_overrides[get_db_session] = lambda: dbsession
    application.dependency_overrides[get_kafka_producer] = lambda: test_kafka_producer
    return application  # noqa: WPS331


@pytest.fixture
async def client(
    fastapi_app: FastAPI, anyio_backend: Any
) -> AsyncGenerator[AsyncClient, None]:
    """
    Fixture that creates client for requesting server.

    :param fastapi_app: the application.
    :yield: client for the app.
    """
    async with AsyncClient(app=fastapi_app, base_url="http://test") as ac:
        yield ac
