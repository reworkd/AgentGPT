from typing import AsyncGenerator

from loguru import logger
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request


async def get_db_session(request: Request) -> AsyncGenerator[AsyncSession, None]:
    """
    Create and get database session.

    :param request: current request.
    :yield: database session.
    """
    session: AsyncSession = request.app.state.db_session_factory()

    try:
        yield session
        await session.commit()
    except Exception as e:
        logger.exception(e)
        await session.rollback()
    finally:
        await session.close()
