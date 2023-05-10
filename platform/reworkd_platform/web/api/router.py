from fastapi.routing import APIRouter

from reworkd_platform.web.api import monitoring

api_router = APIRouter()
api_router.include_router(monitoring.router)
