from typing import Any, Coroutine, Callable

from fastapi import Depends

from reworkd_platform.schemas import AgentRun, UserBase
from reworkd_platform.services.tokenizer.dependencies import get_token_service
from reworkd_platform.services.tokenizer.service import TokenService
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.agent_service.agent_service import AgentService
from reworkd_platform.web.api.agent.agent_service.mock_agent_service import (
    MockAgentService,
)
from reworkd_platform.web.api.agent.agent_service.open_ai_agent_service import (
    OpenAIAgentService,
)
from reworkd_platform.web.api.agent.dependancies import (
    get_agent_memory,
)
from reworkd_platform.web.api.agent.model_settings import create_model
from reworkd_platform.web.api.dependencies import get_current_user
from reworkd_platform.web.api.memory.memory import AgentMemory


def get_agent_service(
    validator: Callable[..., Coroutine[Any, Any, AgentRun]],
    streaming: bool = False,
) -> Callable[..., AgentService]:
    def func(
        run: AgentRun = Depends(validator),
        user: UserBase = Depends(get_current_user),
        agent_memory: AgentMemory = Depends(get_agent_memory),
        token_service: TokenService = Depends(get_token_service),
    ) -> AgentService:
        if settings.ff_mock_mode_enabled:
            return MockAgentService()

        model = create_model(run.model_settings, user, streaming=streaming)
        return OpenAIAgentService(
            model,
            run.model_settings.language,
            agent_memory,
            token_service,
            callbacks=None,
        )

    return func
