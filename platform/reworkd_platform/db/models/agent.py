from sqlalchemy import Column, String, Text

from reworkd_platform.db.base import TrackedModel


class AgentRun(TrackedModel):
    __tablename__ = "agent_run"
    user_id = Column(String, nullable=False)
    goal = Column(Text, nullable=False)


class AgentTask(TrackedModel):
    __tablename__ = "agent_task"
    run_id = Column(String, nullable=False)
    type_ = Column(String, nullable=False, name="type")
