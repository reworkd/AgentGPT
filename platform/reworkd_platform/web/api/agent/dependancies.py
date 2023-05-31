from typing import Dict, Any, Optional, Callable, Coroutine

from fastapi import Body

from reworkd_platform.schemas import AgentRequestBody


def agent_validator(
    example: Optional[Dict[str, Any]] = None, **kwargs: Any
) -> Callable[[AgentRequestBody], Coroutine[Any, Any, AgentRequestBody]]:
    async def func(
        body: AgentRequestBody = Body(example=example, **kwargs),
    ) -> AgentRequestBody:
        settings = body.modelSettings

        if settings.model not in ["gpt-3.5-turbo", "gpt-4"]:
            raise ValueError(f"Model {settings.model} is not supported")

        if settings.max_tokens > 2000:
            raise ValueError(f"Max tokens {settings.max_tokens} is too high")

        return body

    return func
