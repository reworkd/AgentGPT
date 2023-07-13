from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import mapped_column, relationship

from reworkd_platform.db.base import Base, TrackedModel, UserMixin
from reworkd_platform.web.api.workflow.schemas import Edge, Node, Workflow


class WorkflowModel(TrackedModel, UserMixin):
    __tablename__ = "workflow"

    name = mapped_column(String, nullable=False)
    description = mapped_column(String, nullable=False)

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
    ref = mapped_column(String, nullable=False)
    workflow_id = mapped_column(String, ForeignKey("workflow.id"))

    pos_x = mapped_column(Float)
    pos_y = mapped_column(Float)

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
    workflow_id = mapped_column(String, ForeignKey("workflow.id"))

    source = mapped_column(String)
    target = mapped_column(String)

    workflow = relationship("WorkflowModel", back_populates="edges")

    def to_schema(self) -> Edge:
        return Edge(
            id=self.id,
            source=self.source,
            target=self.target,
        )
