from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ActionBlock(BaseModel):
    id: str
    name: str
    hasInput: bool
    hasOutput: bool


class Node(BaseModel):
    id: str
    actionBlock: ActionBlock
    ref: str
    workflowId: str
    codeBlockId: str
    posX: int
    posY: int
    createdAt: datetime
    updatedAt: datetime
    deletedAt: Optional[datetime]


class Edge(BaseModel):
    id: str
    source: str
    target: str


class Workflow(BaseModel):
    id: str
    name: str
    description: str
