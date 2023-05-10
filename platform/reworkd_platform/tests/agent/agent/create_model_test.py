import pytest

from reworkd_platform.web.api.agent.agent_service.open_ai_agent_service import (
    GPT_35_TURBO,
)
from reworkd_platform.web.api.agent.agent_service.open_ai_agent_service import (
    create_model,
)
from reworkd_platform.web.api.agent.model_settings import ModelSettings


@pytest.mark.parametrize(
    "custom_settings, expected_temperature, expected_model_name, expected_max_tokens",
    [
        (
            ModelSettings(
                customApiKey="test_api_key",
                customTemperature=0.222,
                customModelName="Custom_Model",
                maxTokens=1234,
            ),
            0.222,
            "Custom_Model",
            1234,
        ),
        (
            ModelSettings(
                customTemperature=0.222,
                customModelName="Custom_Model",
                maxTokens=1234,
            ),
            0.9,
            GPT_35_TURBO,
            400,
        ),
    ],
)
def test_create_model(
    custom_settings: ModelSettings,
    expected_temperature: float,
    expected_model_name: str,
    expected_max_tokens: int,
) -> None:
    model = create_model(custom_settings)

    assert model.temperature == expected_temperature
    assert model.model_name == expected_model_name
    assert model.max_tokens == expected_max_tokens
