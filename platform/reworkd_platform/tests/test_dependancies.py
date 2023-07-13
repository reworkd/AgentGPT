import pytest

from reworkd_platform.web.api.agent import dependancies


@pytest.mark.anyio
@pytest.mark.parametrize(
    "validator, step",
    [
        (dependancies.agent_summarize_validator, "summarize"),
        (dependancies.agent_chat_validator, "chat"),
        (dependancies.agent_analyze_validator, "analyze"),
        (dependancies.agent_create_validator, "create"),
        (dependancies.agent_execute_validator, "execute"),
    ],
)
async def test_agent_validate(mocker, validator, step):
    run_id = "asim"
    crud = mocker.Mock()
    body = mocker.Mock()
    body.run_id = run_id

    crud.create_task = mocker.AsyncMock()

    await validator(body, crud)
    crud.create_task.assert_called_once_with(run_id, step)
