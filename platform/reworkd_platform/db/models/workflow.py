from sqlalchemy import JSON, Float, ForeignKey, String
from sqlalchemy.orm import mapped_column, relationship

from reworkd_platform.db.base import Base, TrackedModel, UserMixin
from reworkd_platform.schemas.workflow.base import Block, Edge, Node, Workflow


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

    def to_schema(self, block: "NodeBlockModel") -> Node:
        return Node(
            id=self.id,
            ref=self.ref,
            pos_x=self.pos_x,
            pos_y=self.pos_y,
            block=block.to_schema(),
        )


class WorkflowEdgeModel(Base):
    __tablename__ = "workflow_edge"
    workflow_id = mapped_column(String, ForeignKey("workflow.id"))

    source = mapped_column(String)
    source_handle = mapped_column(String, nullable=True)
    target = mapped_column(String)

    workflow = relationship("WorkflowModel", back_populates="edges")

    def to_schema(self) -> Edge:
        return Edge(
            id=self.id,
            source=self.source,
            source_handle=self.source_handle,
            target=self.target,
        )


class NodeBlockModel(Base):
    __tablename__ = "node_block"
    node_id = mapped_column(String, ForeignKey("workflow_node.id"))

    type = mapped_column(String)
    input = mapped_column(JSON)

    def to_schema(self) -> Block:
        return Block(id=self.id, type=self.type, input=self.input)
