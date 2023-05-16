from random import randint
from typing import Optional

import openai
from langchain.chat_models import ChatOpenAI
from pydantic import BaseModel

from reworkd_platform.settings import settings


class ModelSettings(BaseModel):
    customApiKey: Optional[str] = None
    customModelName: Optional[str] = None
    customTemperature: Optional[float] = None
    customMaxLoops: Optional[int] = None
    maxTokens: Optional[int] = None


def get_server_side_key() -> str:
    keys = [
        key.strip() for key in (settings.openai_api_key or "").split(",") if key.strip()
    ]
    return keys[randint(0, len(keys) - 1)] if keys else ""


GPT_35_TURBO = "gpt-3.5-turbo"

openai.api_base = settings.openai_api_base


def create_model(model_settings: Optional[ModelSettings]) -> ChatOpenAI:
    _model_settings = model_settings

    if not model_settings or not model_settings.customApiKey:
        _model_settings = None

    return ChatOpenAI(
        openai_api_key=_model_settings.customApiKey
        if _model_settings
        else get_server_side_key(),
        temperature=_model_settings.customTemperature
        if _model_settings and _model_settings.customTemperature is not None
        else 0.9,
        model_name=_model_settings.customModelName
        if _model_settings and _model_settings.customModelName is not None
        else GPT_35_TURBO,
        max_tokens=_model_settings.maxTokens
        if _model_settings and _model_settings.maxTokens is not None
        else 400,
    )
