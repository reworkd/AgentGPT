from reworkd_platform.schemas import ModelSettings
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.agent_service.agent_service import AgentService
from reworkd_platform.web.api.agent.agent_service.mock_agent_service import (
    MockAgentService,
)
from reworkd_platform.web.api.agent.agent_service.open_ai_agent_service import (
    OpenAIAgentService,
)
from reworkd_platform.web.api.memory.memory import AgentMemory


def get_agent_service(
    model_settings: ModelSettings, agent_memory: AgentMemory
) -> AgentService:
    if settings.ff_mock_mode_enabled:
        return MockAgentService()
    else:
        return OpenAIAgentService(model_settings, agent_memory)
