from fastapi.routing import APIRouter

from reworkd_platform.web.api import agent, memory, monitoring, models

api_router = APIRouter()
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["monitoring"])
api_router.include_router(agent.router, prefix="/agent", tags=["agent"])
api_router.include_router(memory.router, prefix="/memory", tags=["memory"])
api_router.include_router(models.router, prefix="/models", tags=["models"])
