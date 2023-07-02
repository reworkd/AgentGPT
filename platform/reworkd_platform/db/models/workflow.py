from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from reworkd_platform.db.base import TrackedModel, UserMixin, Base
from reworkd_platform.web.api.workflow.schemas import Workflow, Node, Edge


class WorkflowModel(TrackedModel, UserMixin):
    __tablename__ = "workflow"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)

    nodes = relationship("WorkflowNodeModel", back_populates="workflow", uselist=True)
    edges = relationship("WorkflowEdgeModel", back_populates="workflow", uselist=True)

    def to_schema(self) -> Workflow:
        return Workflow(
            id=str(self.id),
            user_id=self.user_id,
            organization_id=self.organization_id,
            name=self.name,
            description=self.description,
        )


class WorkflowNodeModel(TrackedModel):
    __tablename__ = "workflow_node"
    ref = Column(String, nullable=False)
    workflow_id = Column(String, ForeignKey("workflow.id"))

    pos_x = Column(Float)
    pos_y = Column(Float)

    workflow = relationship("WorkflowModel", back_populates="nodes")

    def to_schema(self) -> Node:
        return Node(
            id=self.id,
            ref=self.ref,
            pos_x=self.pos_x,
            pos_y=self.pos_y,
        )


class WorkflowEdgeModel(Base):
    __tablename__ = "workflow_edge"
    workflow_id = Column(String, ForeignKey("workflow.id"))

    source = Column(String)
    target = Column(String)

    workflow = relationship("WorkflowModel", back_populates="edges")

    def to_schema(self) -> Edge:
        return Edge(
            id=self.id,
            source=self.source,
            target=self.target,
        )
