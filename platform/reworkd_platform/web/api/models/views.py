from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from reworkd_platform.schemas.agent import LLM_MODEL_MAX_TOKENS, LLM_Model
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.settings import Settings, settings as global_settings
from reworkd_platform.web.api.dependencies import get_current_user

router = APIRouter()


class ModelWithAccess(BaseModel):
    name: str
    max_tokens: int
    has_access: bool = Field(
        default=False, description="Whether the user has access to this model"
    )

    @staticmethod
    def from_model(
        name: str, max_tokens: int, user: UserBase, settings: Settings
    ) -> "ModelWithAccess":
        has_access = False
        is_ollama_model = name.startswith("ollama/")

        if is_ollama_model:
            has_access = settings.ollama_enabled
        elif user is not None: # For OpenAI models, user needs to be authenticated (or have a custom key)
            has_access = True

        # If a custom API key is provided by the user, they effectively have access to any model they define
        # The frontend store for modelSettings would typically hold this customApiKey
        # However, this specific endpoint doesn't have direct access to user's client-side modelSettings store.
        # Access for custom key scenarios is implicitly handled by allowing users to input any model name.
        # The critical check is whether the backend is configured for the *type* of model (OpenAI, Ollama).

        return ModelWithAccess(name=name, max_tokens=max_tokens, has_access=has_access)


@router.get("")
async def get_models(
    user: UserBase = Depends(get_current_user),
    settings: Settings = Depends(lambda: global_settings),
) -> List[ModelWithAccess]:
    available_models = []
    for model_name_literal, tokens in LLM_MODEL_MAX_TOKENS.items():
        # Ensure we are working with the string value of the Literal
        model_name = str(model_name_literal)

        is_ollama_model = model_name.startswith("ollama/")
        is_openai_model = model_name.startswith("gpt-")

        access_granted = False
        if is_ollama_model:
            if settings.ollama_enabled:
                access_granted = True
        elif is_openai_model:
            # OpenAI models are accessible if user is logged in (for platform keys)
            # or if they might provide their own key (implicitly handled by frontend)
            # or if a general OpenAI endpoint is configured.
            if user or settings.openai_api_key or settings.openai_api_base:
                access_granted = True

        if access_granted:
             available_models.append(
                ModelWithAccess.from_model(
                    name=model_name, max_tokens=tokens, user=user, settings=settings
                )
            )
    return available_models
