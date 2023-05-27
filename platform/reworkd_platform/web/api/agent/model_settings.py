from random import randint
from typing import Optional

import openai
from langchain.chat_models import ChatOpenAI
from pydantic import BaseModel

from reworkd_platform.settings import settings


class ModelSettings(BaseModel):
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
    return ChatOpenAI(
        client=None,  # Meta private value but mypy will complain its missing
        openai_api_key=get_server_side_key(),
        temperature=model_settings.customTemperature
        if model_settings and model_settings.customTemperature is not None
        else 0.9,
        model_name=model_settings.customModelName
        if model_settings and model_settings.customModelName is not None
        else GPT_35_TURBO,
        max_tokens=model_settings.maxTokens
        if model_settings and model_settings.maxTokens is not None
        else 400,
    )
