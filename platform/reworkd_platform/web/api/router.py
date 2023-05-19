from fastapi.routing import APIRouter

from reworkd_platform.web.api import agent
from reworkd_platform.web.api import monitoring
from reworkd_platform.web.api import user

api_router = APIRouter()
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["monitoring"])
api_router.include_router(agent.router, prefix="/agent", tags=["agent"])
api_router.include_router(user.router, prefix="/user", tags=["user"])
