from reworkd_platform.settings import Settings
from reworkd_platform.web.api.agent.agent_service.mock_agent_service import \
    MockAgentService
from reworkd_platform.web.api.agent.agent_service.open_ai_agent_service import \
    OpenAIAgentService


def get_agent_service():
    if Settings.ff_mock_mode_enabled:
        return MockAgentService()
    else:
        return OpenAIAgentService()
