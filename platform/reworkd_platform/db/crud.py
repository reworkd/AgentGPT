from fastapi import HTTPException
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from reworkd_platform.db.models.agent import AgentRun, AgentTask
from reworkd_platform.db.models.user import UserSession
from reworkd_platform.schemas import Loop_Step, UserBase
from reworkd_platform.settings import settings
from reworkd_platform.web.api.errors import MaxLoopsError


class BaseCrud:
    def __init__(self, session: AsyncSession):
        self.session = session


class AgentCRUD(BaseCrud):
    def __init__(self, session: AsyncSession, user: UserBase):
        super().__init__(session)
        self.user = user

    async def create_run(self, goal: str) -> AgentRun:
        return await AgentRun(
            user_id=self.user.id,
            goal=goal,
        ).save(self.session)

    async def create_task(self, run_id: str, type_: Loop_Step) -> AgentTask:
        await self.validate_task_count(run_id, type_)
        return await AgentTask(
            run_id=run_id,
            type_=type_,
        ).save(self.session)

    async def validate_task_count(self, run_id: str, type_: str) -> None:
        if not await AgentRun.get(self.session, run_id):
            raise HTTPException(404, f"Run {run_id} not found")

        query = select(func.count(AgentTask.id)).where(
            and_(
                AgentTask.run_id == run_id,
                AgentTask.type_ == type_,
            )
        )

        task_count = (await self.session.execute(query)).scalar_one()
        max_ = settings.max_loops

        if task_count >= max_:
            raise MaxLoopsError(
                StopIteration(),
                f"Max loops of {max_} exceeded, shutting down.",
                429,
            )


class UserCrud(BaseCrud):
    async def get_user_session(self, token: str) -> UserSession:
        query = (
            select(UserSession)
            .filter(UserSession.session_token == token)
            .options(selectinload(UserSession.user))
        )
        return (await self.session.execute(query)).scalar_one()
