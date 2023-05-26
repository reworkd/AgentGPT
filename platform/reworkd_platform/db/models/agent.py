from sqlalchemy import Column, String

from reworkd_platform.db.base import TrackedModel


class AgentRun(TrackedModel):
    __tablename__ = "Agent"

    user_id = Column(String, name="userId")
    name = Column(String, name="name")
    goal = Column(String, name="goal")


class AgentTask(TrackedModel):
    __tablename__ = "AgentTask"

    agent_run_id = Column(String, name="agentId")
    type_ = Column(String, name="type")
    status = Column(String, name="status")
    value = Column(String, name="value")
    info = Column(String, name="info")
    sort = Column(String, name="sort")
