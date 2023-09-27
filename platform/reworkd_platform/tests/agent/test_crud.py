from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException
from pytest_mock import MockerFixture

from reworkd_platform.db.crud.agent import AgentCRUD
from reworkd_platform.settings import settings
from reworkd_platform.web.api.errors import MaxLoopsError, MultipleSummaryError


@pytest.mark.asyncio
async def test_validate_task_count_no_error(mocker) -> None:
    mock_agent_run_exists(mocker, True)
    session = mock_session_with_run_count(mocker, 0)
    agent_crud: AgentCRUD = AgentCRUD(session, mocker.MagicMock())

    # Doesn't throw an exception
    await agent_crud.validate_task_count("test", "summarize")


@pytest.mark.asyncio
async def test_validate_task_count_when_run_not_found(mocker: MockerFixture) -> None:
    mock_agent_run_exists(mocker, False)
    agent_crud: AgentCRUD = AgentCRUD(mocker.AsyncMock(), mocker.MagicMock())

    with pytest.raises(HTTPException):
        await agent_crud.validate_task_count("test", "test")


@pytest.mark.asyncio
async def test_validate_task_count_max_loops_error(mocker: MockerFixture) -> None:
    mock_agent_run_exists(mocker, True)
    session = mock_session_with_run_count(mocker, settings.max_loops)
    agent_crud: AgentCRUD = AgentCRUD(session, mocker.AsyncMock())

    with pytest.raises(MaxLoopsError):
        await agent_crud.validate_task_count("test", "test")


@pytest.mark.asyncio
async def test_validate_task_count_multiple_summary_error(
    mocker: MockerFixture,
) -> None:
    mock_agent_run_exists(mocker, True)
    session = mock_session_with_run_count(mocker, 2)
    agent_crud: AgentCRUD = AgentCRUD(session, mocker.MagicMock())

    with pytest.raises(MultipleSummaryError):
        await agent_crud.validate_task_count("test", "summarize")


def mock_agent_run_exists(mocker: MockerFixture, exists: bool) -> None:
    mocker.patch("reworkd_platform.db.models.agent.AgentRun.get", return_value=exists)


def mock_session_with_run_count(mocker: MockerFixture, run_count: int) -> AsyncMock:
    session = mocker.AsyncMock()
    scalar_mock = mocker.MagicMock()

    session.execute.return_value = scalar_mock
    scalar_mock.scalar_one.return_value = run_count
    return session
