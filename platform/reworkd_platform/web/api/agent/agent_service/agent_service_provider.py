from fastapi import Depends

from reworkd_platform.schemas import UserBase, ModelSettings
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.agent_service.agent_service import AgentService
from reworkd_platform.web.api.agent.agent_service.mock_agent_service import (
    MockAgentService,
)
from reworkd_platform.web.api.agent.agent_service.open_ai_agent_service import (
    OpenAIAgentService,
)
from reworkd_platform.web.api.dependencies import get_current_user
from reworkd_platform.web.api.memory.null import NullAgentMemory
from reworkd_platform.web.api.memory.weaviate import WeaviateMemory


def get_agent_memory(
    user: UserBase = Depends(get_current_user),
):
    vector_db_exists = settings.vector_db_url and settings.vector_db_url != ""
    if vector_db_exists and not settings.ff_mock_mode_enabled:
        return WeaviateMemory(user.id)

    return NullAgentMemory()


def get_agent_service(agent_memory: Depends(get_agent_memory)) -> AgentService:
    if settings.ff_mock_mode_enabled:
        return MockAgentService()

    return OpenAIAgentService(ModelSettings(), agent_memory)
