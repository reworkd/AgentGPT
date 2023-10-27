import itertools

import pytest
from langchain.chat_models import AzureChatOpenAI, ChatOpenAI

from reworkd_platform.schemas import ModelSettings, UserBase
from reworkd_platform.settings import Settings
from reworkd_platform.web.api.agent.model_factory import (
    WrappedAzureChatOpenAI,
    WrappedChatOpenAI,
    create_model,
    get_base_and_headers,
)


def test_helicone_enabled_without_custom_api_key():
    model_settings = ModelSettings()
    user = UserBase(id="user_id")
    settings = Settings(
        helicone_api_key="some_key",
        helicone_api_base="helicone_base",
        openai_api_base="openai_base",
    )

    base, headers, use_helicone = get_base_and_headers(settings, model_settings, user)

    assert use_helicone is True
    assert base == "helicone_base"
    assert headers == {
        "Helicone-Auth": "Bearer some_key",
        "Helicone-Cache-Enabled": "true",
        "Helicone-User-Id": "user_id",
        "Helicone-OpenAI-Api-Base": "openai_base",
    }


def test_helicone_disabled():
    model_settings = ModelSettings()
    user = UserBase(id="user_id")
    settings = Settings()

    base, headers, use_helicone = get_base_and_headers(settings, model_settings, user)
    assert base == "https://api.openai.com/v1"
    assert headers is None
    assert use_helicone is False


def test_helicone_enabled_with_custom_api_key():
    model_settings = ModelSettings(
        custom_api_key="custom_key",
    )
    user = UserBase(id="user_id")
    settings = Settings(
        openai_api_base="openai_base",
        helicone_api_key="some_key",
        helicone_api_base="helicone_base",
    )

    base, headers, use_helicone = get_base_and_headers(settings, model_settings, user)

    assert base == "https://api.openai.com/v1"
    assert headers is None
    assert use_helicone is False


@pytest.mark.parametrize(
    "streaming, use_azure",
    list(
        itertools.product(
            [True, False],
            [True, False],
        )
    ),
)
def test_create_model(streaming, use_azure):
    user = UserBase(id="user_id")
    settings = Settings()
    model_settings = ModelSettings(
        temperature=0.7,
        model="gpt-3.5-turbo",
        max_tokens=100,
    )

    settings.openai_api_base = (
        "https://api.openai.com" if not use_azure else "https://oai.azure.com"
    )
    settings.openai_api_key = "key"
    settings.openai_api_version = "version"

    result = create_model(settings, model_settings, user, streaming)
    assert issubclass(result.__class__, WrappedChatOpenAI)
    assert issubclass(result.__class__, ChatOpenAI)

    # Check if the required keys are set properly
    assert result.openai_api_base == settings.openai_api_base
    assert result.openai_api_key == settings.openai_api_key
    assert result.temperature == model_settings.temperature
    assert result.max_tokens == model_settings.max_tokens
    assert result.streaming == streaming
    assert result.max_retries == 5

    # For Azure specific checks
    if use_azure:
        assert isinstance(result, WrappedAzureChatOpenAI)
        assert issubclass(result.__class__, AzureChatOpenAI)
        assert result.openai_api_version == settings.openai_api_version
        assert result.deployment_name == "gpt-35-turbo"
        assert result.openai_api_type == "azure"


@pytest.mark.parametrize(
    "model_settings, streaming",
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
def test_custom_model_settings(model_settings: ModelSettings, streaming: bool):
    model = create_model(
        Settings(),
        model_settings,
        UserBase(id="", email="test@example.com"),
        streaming=streaming,
    )

    assert model.temperature == model_settings.temperature
    assert model.model_name.startswith(model_settings.model)
    assert model.max_tokens == model_settings.max_tokens
    assert model.streaming == streaming
