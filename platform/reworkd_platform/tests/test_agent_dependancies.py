import pytest

from reworkd_platform.schemas import ModelSettings, AgentRequestBody
from reworkd_platform.web.api.agent.dependancies import agent_validator


@pytest.mark.anyio
@pytest.mark.parametrize(
    "settings",
    [
        {
            "customModelName": "gpt-4",
        },
        {
            "customModelName": "gpt-3.5-turbo",
            "maxTokens": 1500,
            "customTemperature": 0.5,
            "language": "french",
        },
    ],
)
async def test_agent_validator_valid(settings):
    body = AgentRequestBody(goal="test", modelSettings=ModelSettings(**settings))
    validated = await agent_validator()(body)

    for k, v in settings.items():
        assert validated.modelSettings.dict(by_alias=True)[k] == v


@pytest.mark.anyio
@pytest.mark.parametrize(
    "settings",
    [
        {
            "customModelName": "gpt-4-32k",
        },
        {
            "customTemperature": -1,
        },
        {
            "customModelName": "gpt-3.5-turbo",
            "maxTokens": 8000,
        },
    ],
)
async def test_agent_validator_invalid(settings):
    body = AgentRequestBody(goal="test", modelSettings=ModelSettings(**settings))

    with pytest.raises(ValueError):
        await agent_validator()(body)
