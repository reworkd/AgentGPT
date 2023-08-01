import itertools

import pytest

from reworkd_platform.schemas.agent import ModelSettings
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.web.api.agent.model_factory import create_model


@pytest.mark.parametrize(
    "settings, streaming",
    list(
        itertools.product(
            [
                ModelSettings(
                    customTemperature=0.222,
                    customModelName="gpt-4",
                    maxTokens=1234,
                ),
                ModelSettings(),
            ],
            [True, False],
        )
    ),
)
def test_create_model(settings: ModelSettings, streaming: bool):
    model = create_model(
        settings,
        UserBase(id="", email="test@example.com"),
        streaming=streaming,
    )

    assert model.temperature == settings.temperature
    assert model.model_name.startswith(settings.model)
    assert model.max_tokens == settings.max_tokens
    assert model.streaming == streaming
