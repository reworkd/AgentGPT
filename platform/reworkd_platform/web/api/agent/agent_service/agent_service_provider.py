from typing import Any, Callable, Coroutine

from fastapi import Depends

from reworkd_platform.schemas.agent import AgentRun
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.services.tokenizer.dependencies import get_token_service
from reworkd_platform.services.tokenizer.token_service import TokenService
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.agent_service.agent_service import AgentService
from reworkd_platform.web.api.agent.agent_service.mock_agent_service import (
    MockAgentService,
)
from reworkd_platform.web.api.agent.agent_service.open_ai_agent_service import (
    OpenAIAgentService,
)
from reworkd_platform.web.api.agent.dependancies import get_agent_memory
from reworkd_platform.web.api.agent.model_factory import create_model
from reworkd_platform.web.api.dependencies import get_current_user
from reworkd_platform.web.api.memory.memory import AgentMemory
from reworkd_platform.db.crud.oauth import OAuthCrud


def get_agent_service(
    validator: Callable[..., Coroutine[Any, Any, AgentRun]],
    streaming: bool = False,
    azure: bool = False,  # As of 07/2023, azure does not support functions
) -> Callable[..., AgentService]:
    def func(
        run: AgentRun = Depends(validator),
        user: UserBase = Depends(get_current_user),
        agent_memory: AgentMemory = Depends(get_agent_memory),
        token_service: TokenService = Depends(get_token_service),
        oauth_crud: OAuthCrud = Depends(OAuthCrud.inject),
    ) -> AgentService:
        if settings.ff_mock_mode_enabled:
            return MockAgentService()

        model = create_model(run.model_settings, user, streaming=streaming, azure=azure)
        return OpenAIAgentService(
            model,
            run.model_settings,
            agent_memory,
            token_service,
            callbacks=None,
            user=user,
            oauth_crud=oauth_crud,
        )

    return func
