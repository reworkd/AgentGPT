from typing import Any, List
from unittest.mock import Mock

import pytest
from fastapi import HTTPException
from pytest_mock import MockerFixture

from reworkd_platform.db.crud.workflow import WorkflowCRUD
from reworkd_platform.db.models.workflow import WorkflowModel
from reworkd_platform.schemas.user import UserBase


@pytest.mark.asyncio
async def test_get_all_returns_empty_list_if_user_has_no_workflows(
    mocker: MockerFixture,
):
    mock_session = mock_async_db_session(mocker, return_value=[])
    user = UserBase(id="1", name="test", email="test@test.com")
    workflow_crud = WorkflowCRUD(mock_session, user)

    result = await workflow_crud.get_all()

    assert result == []


@pytest.mark.asyncio
async def test_get_returns_404_if_workflow_id_is_invalid(mocker: MockerFixture):
    mocker.patch.object(
        WorkflowModel, "get", new_callable=mocker.AsyncMock, return_value=None
    )
    mock_session = mocker.Mock()
    workflow_crud = WorkflowCRUD(
        mock_session, UserBase(id="1", name="test", email="test@test.com")
    )

    with pytest.raises(HTTPException) as error:
        await workflow_crud.get("invalid_id")

    assert error.value.status_code == 404


@pytest.mark.asyncio
async def test_create_raises_exception_if_name_or_description_is_missing(
    mocker: MockerFixture,
):
    mock_session = mocker.Mock()
    workflow_crud = WorkflowCRUD(
        mock_session, UserBase(id="1", name="test", email="test@test.com")
    )

    with pytest.raises(Exception):
        await workflow_crud.create(name=None, description="description")

    with pytest.raises(Exception):
        await workflow_crud.create(name="name", description=None)


def mock_async_db_session(mocker: MockerFixture, return_value: List[Any]) -> Mock:
    # Mock the session
    mock_session = mocker.Mock()

    # Mock the async execute method to return an object that has scalars and all methods
    mock_execute_result = mocker.Mock()
    mock_session.execute = mocker.AsyncMock(return_value=mock_execute_result)

    # Mock scalars method to return an object that has all method
    mock_scalars_result = mocker.Mock()
    mock_execute_result.scalars.return_value = mock_scalars_result

    # Mock all method to return an empty list
    mock_scalars_result.all.return_value = return_value

    return mock_session
