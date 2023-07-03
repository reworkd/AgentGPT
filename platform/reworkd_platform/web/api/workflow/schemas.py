from typing import Optional, List

from pydantic import BaseModel, Field


class ActionBlock(BaseModel):
    id: str
    name: str
    hasInput: bool
    hasOutput: bool


class EdgeUpsert(BaseModel):
    id: Optional[str]
    source: str
    target: str


class NodeUpsert(BaseModel):
    id: Optional[str]
    ref: str = Field(description="Reference ID generate by the frontend")
    pos_x: float
    pos_y: float


class Node(BaseModel):
    id: str
    ref: str
    pos_x: float
    pos_y: float


class Edge(BaseModel):
    id: str
    source: str
    target: str


class Workflow(BaseModel):
    id: str
    user_id: str
    organization_id: Optional[str] = Field(default=None)
    name: str
    description: str


class WorkflowFull(Workflow):
    nodes: list[Node]
    edges: list[Edge]


class WorkflowUpdate(BaseModel):
    nodes: List[NodeUpsert]
    edges: List[EdgeUpsert]
