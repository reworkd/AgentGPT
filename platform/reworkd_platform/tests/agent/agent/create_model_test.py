import pytest

from reworkd_platform.schemas import ModelSettings
from reworkd_platform.web.api.agent.agent_service.open_ai_agent_service import (
    create_model,
)


@pytest.mark.parametrize(
    "settings",
    [
        ModelSettings(
            customTemperature=0.222,
            customModelName="gpt-4",
            maxTokens=1234,
        ),
        ModelSettings(),
    ],
)
def test_create_model(
    settings: ModelSettings,
):
    model = create_model(settings)

    assert model.temperature == settings.temperature
    assert model.model_name == settings.model
    assert model.max_tokens == settings.max_tokens
