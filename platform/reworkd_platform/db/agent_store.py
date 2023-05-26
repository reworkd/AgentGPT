from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from reworkd_platform.db.models.agent import AgentRun, AgentTask


class AgentStore:
    def __init__(self, session: AsyncSession, user_id: str):
        self.session = session
        self.user_id = user_id

    async def create_agent_run(self, goal: str, name: str) -> AgentRun:
        run = AgentRun(user_id=self.user_id, goal=goal, name=name)

        self.session.add(run)
        await self.session.flush()

        return run

    async def get_agent_run(self, run_id: str) -> AgentRun:
        return await AgentRun.get(self.session, run_id)

    async def create_agent_task(
        self, run_id: str, info: Optional[str], value: str
    ) -> AgentTask:
        return await AgentTask(
            agent_run_id=run_id,
            value=value,
            info=info,
            type_="task",
            sort=-1
        ).save(self.session)
