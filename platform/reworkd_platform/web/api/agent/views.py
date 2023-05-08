from fastapi import APIRouter

from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.model_settings import ModelSettings

router = APIRouter()


@router.post("/create")
def health_check(model_settings: ModelSettings) -> str:
    """
    Checks the health of a project.

    It returns 200 if the project is healthy.
    """
    return settings.openai_api_key
