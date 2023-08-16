from reworkd_platform.schemas import ModelSettings, UserBase
from reworkd_platform.settings import Settings
from reworkd_platform.web.api.agent.model_factory import get_base_and_headers


def test_helicone_enabled_without_custom_api_key():
    model_settings = ModelSettings()
    user = UserBase(id="user_id")
    settings = Settings(
        helicone_api_key="some_key",
        helicone_api_base="helicone_base",
    )

    base, headers = get_base_and_headers(settings, model_settings, user)

    assert base == "helicone_base"
    assert headers == {
        "Helicone-Auth": "Bearer some_key",
        "Helicone-Cache-Enabled": "true",
        "Helicone-User-Id": "user_id",
    }


def test_helicone_disabled():
    model_settings = ModelSettings()
    user = UserBase(id="user_id")
    settings = Settings()

    base, headers = get_base_and_headers(settings, model_settings, user)
    assert base == "https://api.openai.com/v1"
    assert headers is None


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

    base, headers = get_base_and_headers(settings, model_settings, user)

    assert base == "openai_base"
    assert headers is None
