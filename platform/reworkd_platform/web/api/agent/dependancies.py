from typing import Any, Callable, Coroutine, TypeVar

from fastapi import Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from reworkd_platform.db.crud import AgentCRUD
from reworkd_platform.db.dependencies import get_db_session
from reworkd_platform.schemas import (
    AgentRunCreate,
    AgentTaskAnalyze,
    AgentTaskExecute,
    AgentTaskCreate,
    Loop_Step,
    AgentRun,
    UserBase,
)
from reworkd_platform.web.api.dependencies import get_current_user

T = TypeVar("T", AgentTaskAnalyze, AgentTaskExecute, AgentTaskCreate)


def agent_crud(
    user: UserBase = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
):
    return AgentCRUD(session, user)


def agent_start_validator(
    **kwargs: Any,
) -> Callable[[AgentRunCreate, AgentCRUD], Coroutine[Any, Any, AgentRunCreate]]:
    async def func(
        body: AgentRunCreate = Body(**kwargs),
        crud: AgentCRUD = Depends(agent_crud),
    ) -> AgentRun:
        id_ = (await crud.create_run(body.goal)).id
        return AgentRun(**body.dict(), run_id=id_)

    return func


async def validate(body: T, crud: AgentCRUD, type_: Loop_Step):
    body.run_id = (await crud.create_task(body.run_id, type_)).id
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
