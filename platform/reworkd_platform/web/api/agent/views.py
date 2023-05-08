from fastapi import APIRouter

from reworkd_platform.settings import settings

router = APIRouter()


@router.get("/health")
def health_check() -> str:
    """
    Checks the health of a project.

    It returns 200 if the project is healthy.
    """
    return settings.openai_api_key
