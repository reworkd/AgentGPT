from sqlalchemy import Column, String, Text, DateTime, func

from reworkd_platform.db.base import Base


class AgentRun(Base):
    __tablename__ = "agent_run"
    user_id = Column(String, nullable=False)
    goal = Column(Text, nullable=False)
    create_date = Column(
        DateTime, name="create_date", server_default=func.now(), nullable=False
    )


class AgentTask(Base):
    __tablename__ = "agent_task"

    run_id = Column(String, nullable=False)
    type_ = Column(String, nullable=False, name="type")
    create_date = Column(
        DateTime, name="create_date", server_default=func.now(), nullable=False
    )
