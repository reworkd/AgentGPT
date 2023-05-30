from typing import Optional

import openai
from langchain.chat_models import ChatOpenAI
from pydantic import BaseModel

from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.api_utils import rotate_keys


class ModelSettings(BaseModel):
    customModelName: Optional[str] = None
    customTemperature: Optional[float] = None
    customMaxLoops: Optional[int] = None
    maxTokens: Optional[int] = None
    language: Optional[str] = "English"


GPT_35_TURBO = "gpt-3.5-turbo"

openai.api_base = settings.openai_api_base


def create_model(
    model_settings: Optional[ModelSettings], streaming: bool = False
) -> ChatOpenAI:
    return ChatOpenAI(
        client=None,  # Meta private value but mypy will complain its missing
        openai_api_key=rotate_keys(
            primary_key=settings.openai_api_key,
            secondary_key=settings.secondary_openai_api_key,
        ),
        temperature=model_settings.customTemperature
        if model_settings and model_settings.customTemperature is not None
        else 0.9,
        model_name=model_settings.customModelName
        if model_settings and model_settings.customModelName is not None
        else GPT_35_TURBO,
        max_tokens=model_settings.maxTokens
        if model_settings and model_settings.maxTokens is not None
        else 400,
        streaming=streaming,
    )
