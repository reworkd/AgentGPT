from typing import Any, Dict, Optional, Tuple, Type, Union

from langchain.chat_models import AzureChatOpenAI, ChatOpenAI
from pydantic import Field

from reworkd_platform.schemas.agent import LLM_Model, ModelSettings
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.settings import Settings


class WrappedChatOpenAI(ChatOpenAI):
    client: Any = Field(
        default=None,
        description="Meta private value but mypy will complain its missing",
    )
    max_tokens: int
    model_name: LLM_Model = Field(alias="model")


class WrappedAzureChatOpenAI(AzureChatOpenAI, WrappedChatOpenAI):
    openai_api_base: str
    openai_api_version: str
    deployment_name: str


WrappedChat = Union[WrappedAzureChatOpenAI, WrappedChatOpenAI]


def create_model(
    settings: Settings,
    model_settings: ModelSettings,
    user: UserBase,
    streaming: bool = False,
    force_model: Optional[LLM_Model] = None,
) -> WrappedChat:
    llm_model = force_model or model_settings.model
    model: Type[WrappedChat] = WrappedChatOpenAI
    base, headers, use_helicone, provider = get_base_and_headers(
        settings, model_settings, user
    )

    # Default API key to a non-empty string if provider is Ollama,
    # as ChatOpenAI client requires it, even if not used.
    api_key = (
        model_settings.custom_api_key
        or settings.openai_api_key
        or ("ollama" if provider == "ollama" else None)
    )

    kwargs = {
        "openai_api_base": base,
        "openai_api_key": api_key,
        "temperature": model_settings.temperature,
        "model": llm_model,
        "max_tokens": model_settings.max_tokens,
        "streaming": streaming,
        "max_retries": 5,
        "model_kwargs": {"user": user.email, "headers": headers},
    }

    if provider == "azure":
        model = WrappedAzureChatOpenAI
        deployment_name = llm_model.replace(".", "")
        kwargs.update(
            {
                "openai_api_version": settings.openai_api_version,
                "deployment_name": deployment_name,
                "openai_api_type": "azure",
                "openai_api_base": base.rstrip("v1") if base else None,
            }
        )
        if use_helicone: # Helicone with Azure not fully supported yet by Helicone
            kwargs["model"] = deployment_name


    return model(**kwargs)  # type: ignore


def get_base_and_headers(
    settings_: Settings, model_settings: ModelSettings, user: UserBase
) -> Tuple[Optional[str], Optional[Dict[str, str]], bool, Optional[str]]:
    use_custom_key = bool(model_settings.custom_api_key)
    use_ollama = settings_.ollama_enabled and not use_custom_key
    use_azure = (
        settings_.openai_api_base
        and "azure" in settings_.openai_api_base
        and not use_custom_key
        and not use_ollama
    )
    use_helicone = settings_.helicone_enabled and not use_custom_key and not use_ollama

    provider: Optional[str] = None
    base: Optional[str] = None
    headers: Optional[Dict[str, str]] = None

    if use_ollama:
        provider = "ollama"
        base = settings_.ollama_api_base
    elif use_custom_key:
        provider = "custom_openai"
        base = "https://api.openai.com/v1"  # Default for custom keys, can be overridden by model_settings if needed
    elif use_azure:
        provider = "azure"
        base = settings_.openai_api_base
    elif use_helicone:
        provider = "helicone"
        base = settings_.helicone_api_base
        headers = {
            "Helicone-Auth": f"Bearer {settings_.helicone_api_key}",
            "Helicone-Cache-Enabled": "true",
            "Helicone-User-Id": user.id,
            "Helicone-OpenAI-Api-Base": settings_.openai_api_base or "https://api.openai.com/v1",
        }
    elif settings_.openai_api_base:
        provider = "openai"
        base = settings_.openai_api_base
    else: # Default to OpenAI public API if no other provider is configured
        provider = "openai"
        base = "https://api.openai.com/v1"


    return base, headers, use_helicone, provider
