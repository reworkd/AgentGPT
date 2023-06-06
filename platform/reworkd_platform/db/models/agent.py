from sqlalchemy import String, Column, Text, Float, Integer

from reworkd_platform.db.base import TrackedModel


# TODO: use a table for models in the future
# class Model(TrackedModel):
#     __tablename__ = "model"


class AgentRun(TrackedModel):
    __tablename__ = "agent_run"
    user_id = Column(String, nullable=False)
    goal = Column(Text, nullable=False)


class AgentRunInfo(TrackedModel):
    __tablename__ = "agent_run_info"
    run_id = Column(String, nullable=False)
    model = Column(String, nullable=False)
    max_tokens = Column(Integer, nullable=False)
    temperature = Column(Float, nullable=False)
    language = Column(String, nullable=False)


class AgentTask(TrackedModel):
    __tablename__ = "agent_task"
    run_id = Column(String, nullable=False)
    type_ = Column(String, nullable=False, name="type")


class AgentTaskInfo(TrackedModel):
    __tablename__ = "agent_task_info"
    task_id = Column(String, nullable=False)
    prompt_tokens = Column(Integer, nullable=False)
    context_tokens = Column(Integer, nullable=True)
    completion_tokens = Column(Integer, nullable=False)
