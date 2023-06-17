from fastapi import APIRouter, Depends
from pydantic import Field, BaseModel

from reworkd_platform.schemas import UserBase, LLM_MODEL_MAX_TOKENS
from reworkd_platform.web.api.dependencies import get_current_user

router = APIRouter()


class ModelWithAccess(BaseModel):
    name: str
    max_tokens: int
    has_access: bool = Field(
        default=False, description="Whether the user has access to this model"
    )

    @staticmethod
    def from_model(name: str, max_tokens: int, user: UserBase):
        has_access = user is not None
        return ModelWithAccess(name=name, max_tokens=max_tokens, has_access=has_access)


@router.get("")
async def get_models(user: UserBase = Depends(get_current_user)):
    return [
        ModelWithAccess(user=user, name=model, max_tokens=tokens)
        for model, tokens in LLM_MODEL_MAX_TOKENS.items()
    ]
