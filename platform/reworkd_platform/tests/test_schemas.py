import pytest

from reworkd_platform.schemas import ModelSettings


@pytest.mark.parametrize(
    "settings",
    [
        {
            "model": "gpt-4",
            "max_tokens": 7000,
            "temperature": 0.5,
            "language": "french",
        },
        {
            "model": "gpt-3.5-turbo",
            "max_tokens": 3000,
        },
        {
            "model": "gpt-3.5-turbo-16k",
            "max_tokens": 16000,
        },
    ],
)
def test_model_settings_valid(settings):
    result = ModelSettings(**settings)
    assert result.model == settings.get("model", "gpt-3.5-turbo")
    assert result.max_tokens == settings.get("max_tokens", 500)
    assert result.temperature == settings.get("temperature", 0.9)
    assert result.language == settings.get("language", "English")


@pytest.mark.parametrize(
    "settings",
    [
        {
            "model": "gpt-4-32k",
        },
        {
            "temperature": -1,
        },
        {
            "max_tokens": 8000,
        },
        {
            "model": "gpt-4",
            "max_tokens": 32000,
        },
    ],
)
def test_model_settings_invalid(settings):
    with pytest.raises(Exception):
        ModelSettings(**settings)


def test_model_settings_default():
    settings = ModelSettings(**{})
    assert settings.model == "gpt-3.5-turbo"
    assert settings.temperature == 0.9
    assert settings.max_tokens == 500
    assert settings.language == "English"
