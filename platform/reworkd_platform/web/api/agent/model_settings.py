import openai
from langchain.chat_models import ChatOpenAI

from reworkd_platform.schemas import ModelSettings
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.api_utils import rotate_keys

openai.api_base = settings.openai_api_base


def create_model(model_settings: ModelSettings, streaming: bool = False) -> ChatOpenAI:
    return ChatOpenAI(
        client=None,  # Meta private value but mypy will complain its missing
        openai_api_key=rotate_keys(
            primary_key=settings.openai_api_key,
            secondary_key=settings.secondary_openai_api_key,
        ),
        temperature=model_settings.temperature,
        model=model_settings.model,
        max_tokens=model_settings.max_tokens,
        streaming=streaming,
    )
