from typing import Any, Dict, Tuple, Optional

import openai
from langchain.chat_models import ChatOpenAI, AzureChatOpenAI
from pydantic import Field

from reworkd_platform.schemas.agent import LLM_Model, ModelSettings
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.settings import settings, Settings
from reworkd_platform.web.api.agent.api_utils import rotate_keys

openai.api_base = settings.openai_api_base


class WrappedChatOpenAI(ChatOpenAI):
    client: Any = Field(
        default=None,
        description="Meta private value but mypy will complain its missing",
    )
    max_tokens: int
    model_name: LLM_Model = Field(alias="model")


class WrappedAzureChatOpenAI(WrappedChatOpenAI, AzureChatOpenAI):
    openai_api_base: str = Field(default=settings.azure_openai_api_base)
    openai_api_version: str = Field(default=settings.azure_openai_api_version)
    deployment_name: str = Field(default=settings.azure_openai_deployment_name)


def create_model(
    model_settings: ModelSettings,
    user: UserBase,
    streaming: bool = False,
    azure: bool = False,
) -> WrappedChatOpenAI:
    if (
        not model_settings.custom_api_key
        and model_settings.model == "gpt-3.5-turbo"
        and azure
        and settings.azure_openai_enabled
    ):
        return _create_azure_model(model_settings, user, streaming)

    api_key = model_settings.custom_api_key or rotate_keys(
        gpt_3_key=settings.openai_api_key,
        gpt_4_key=settings.secondary_openai_api_key,
        model=model_settings.model,
    )

    base, headers = get_base_and_headers(settings, model_settings, user)

    return WrappedChatOpenAI(
        openai_api_base=base,
        openai_api_key=api_key,
        temperature=model_settings.temperature,
        model=model_settings.model,
        max_tokens=model_settings.max_tokens,
        streaming=streaming,
        max_retries=5,
        model_kwargs={"user": user.email, "headers": headers},
    )


def _create_azure_model(
    model_settings: ModelSettings, user: UserBase, streaming: bool = False
) -> WrappedChatOpenAI:
    return WrappedAzureChatOpenAI(
        openai_api_key=settings.azure_openai_api_key,
        temperature=model_settings.temperature,
        model=model_settings.model,
        max_tokens=model_settings.max_tokens,
        streaming=streaming,
        max_retries=5,
        model_kwargs={"user": user.email},
    )


def get_base_and_headers(
    settings_: Settings, model_settings: ModelSettings, user: UserBase
) -> Tuple[str, Optional[Dict[str, str]]]:
    use_helicone = settings_.helicone_enabled and not model_settings.custom_api_key
    base = settings_.helicone_api_base if use_helicone else settings_.openai_api_base
    headers = (
        {
            "Helicone-Auth": f"Bearer {settings_.helicone_api_key}",
            "Helicone-Cache-Enabled": "true",
            "Helicone-User-Id": user.id,
        }
        if use_helicone
        else None
    )

    return base, headers
