import openai
from langchain.chat_models import ChatOpenAI
from pydantic import Field

from reworkd_platform.schemas import ModelSettings, UserBase, LLM_Model
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.api_utils import rotate_keys

openai.api_base = settings.openai_api_base


class WrappedChatOpenAI(ChatOpenAI):
    max_tokens: int
    model_name: LLM_Model = Field(alias="model")


def create_model(
    model_settings: ModelSettings, user: UserBase, streaming: bool = False
) -> WrappedChatOpenAI:
    if model_settings.custom_api_key != "":
        api_key = model_settings.custom_api_key
    else:
        api_key = rotate_keys(
            gpt_3_key=settings.openai_api_key,
            gpt_4_key=settings.secondary_openai_api_key,
            model=model_settings.model,
        )

    return WrappedChatOpenAI(
        client=None,  # Meta private value but mypy will complain its missing
        openai_api_key=api_key,
        temperature=model_settings.temperature,
        model=model_settings.model,
        max_tokens=model_settings.max_tokens,
        streaming=streaming,
        max_retries=5,
        model_kwargs={"user": user.email},
    )
