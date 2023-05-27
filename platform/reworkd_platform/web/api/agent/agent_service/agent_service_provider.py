from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.agent_service.agent_service import AgentService
from reworkd_platform.web.api.agent.agent_service.mock_agent_service import (
    MockAgentService,
)
from reworkd_platform.web.api.agent.agent_service.open_ai_agent_service import (
    OpenAIAgentService,
)
from reworkd_platform.web.api.agent.model_settings import ModelSettings


def get_agent_service(model_settings: ModelSettings) -> AgentService:
    if settings.ff_mock_mode_enabled:
        return MockAgentService()
    else:
        return OpenAIAgentService(model_settings)
