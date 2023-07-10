from pydantic import BaseModel


class WorkflowNodeIOBase(BaseModel):
    """
    Base input/output type inherited by all Nodes
    """

    class Config:
        extra = "allow"


class WorkflowNode:
    """
    Base class inherited by workflow nodes. All nodes should define the following the class variables
    """

    type: str
    description: str
    image_url: str

    def __init__(self, node_id: str, input_config: WorkflowNodeIOBase):
        self.node_id = node_id
        self.input_config = input_config

    def run(self):
        raise NotImplementedError("Base workflow Node class must be inherited")
