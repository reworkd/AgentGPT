from typing import Any, Callable, Coroutine, TypeVar

from fastapi import Body, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from reworkd_platform.db.crud import AgentCRUD
from reworkd_platform.db.dependencies import get_db_session
from reworkd_platform.schemas import (
    AgentRun,
    AgentRunCreate,
    AgentTaskAnalyze,
    AgentTaskCreate,
    AgentTaskExecute,
    Loop_Step,
    UserBase,
)
from reworkd_platform.services.pinecone.pinecone import PineconeMemory
from reworkd_platform.services.vecs.dependencies import get_supabase_vecs
from reworkd_platform.services.vecs.vecs import VecsMemory
from reworkd_platform.settings import settings
from reworkd_platform.web.api.dependencies import get_current_user
from reworkd_platform.web.api.memory.memory import AgentMemory
from reworkd_platform.web.api.memory.memory_with_fallback import MemoryWithFallback
from reworkd_platform.web.api.memory.null import NullAgentMemory
from reworkd_platform.web.api.memory.weaviate import WeaviateMemory

T = TypeVar("T", AgentTaskAnalyze, AgentTaskExecute, AgentTaskCreate)


def agent_crud(
    user: UserBase = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> AgentCRUD:
    return AgentCRUD(session, user)


def get_agent_memory(
    request: Request,
    user: UserBase = Depends(get_current_user),
) -> AgentMemory:
    if settings.ff_mock_mode_enabled:
        return NullAgentMemory()

    if PineconeMemory.should_use():
        return MemoryWithFallback(PineconeMemory(user.id), NullAgentMemory())

    if settings.supabase_vecs_url:
        vecs = get_supabase_vecs(request)
        return MemoryWithFallback(VecsMemory(vecs, user.id), NullAgentMemory())
    elif settings.vector_db_url:
        return MemoryWithFallback(WeaviateMemory(user.id), NullAgentMemory())
    else:
        return NullAgentMemory()


def agent_start_validator(
    **kwargs: Any,
) -> Callable[[AgentRunCreate, AgentCRUD], Coroutine[Any, Any, AgentRunCreate]]:
    async def func(
        body: AgentRunCreate = Body(**kwargs),
        crud: AgentCRUD = Depends(agent_crud),
    ) -> AgentRun:
        id_ = (await crud.create_run(body.goal)).id
        return AgentRun(**body.dict(), run_id=str(id_))

    return func


async def validate(body: T, crud: AgentCRUD, type_: Loop_Step):
    _id = (await crud.create_task(body.run_id, type_)).id
    body.run_id = str(_id)
    return body


def agent_analyze_validator(
    **kwargs: Any,
) -> Callable[[AgentTaskAnalyze, AgentCRUD], Coroutine[Any, Any, AgentTaskAnalyze]]:
    async def func(
        body: AgentTaskAnalyze = Body(**kwargs),
        crud: AgentCRUD = Depends(agent_crud),
    ) -> AgentTaskAnalyze:
        return await validate(body, crud, "analyze")

    return func


def agent_execute_validator(
    **kwargs: Any,
) -> Callable[[AgentTaskExecute, AgentCRUD], Coroutine[Any, Any, AgentTaskExecute]]:
    async def func(
        body: AgentTaskExecute = Body(**kwargs),
        crud: AgentCRUD = Depends(agent_crud),
    ) -> AgentTaskExecute:
        return await validate(body, crud, "execute")

    return func


def agent_create_validator(
    **kwargs: Any,
) -> Callable[[AgentTaskCreate, AgentCRUD], Coroutine[Any, Any, AgentTaskCreate]]:
    async def func(
        body: AgentTaskCreate = Body(**kwargs),
        crud: AgentCRUD = Depends(agent_crud),
    ) -> AgentTaskCreate:
        return await validate(body, crud, "create")

    return func
