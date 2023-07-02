from sqlalchemy import String, Text
from sqlalchemy.orm import mapped_column

from reworkd_platform.db.base import TrackedModel


class AgentRun(TrackedModel):
    __tablename__ = "agent_run"
    user_id = mapped_column(String, nullable=False)
    goal = mapped_column(Text, nullable=False)


class AgentTask(TrackedModel):
    __tablename__ = "agent_task"
    run_id = mapped_column(String, nullable=False)
    type_ = mapped_column(String, nullable=False, name="type")
