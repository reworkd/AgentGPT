import requests
from requests import RequestException

from reworkd_platform.web.api.workflow.nodes.node import (
    WorkflowNode,
    WorkflowNodeIOBase,
)


class UrlStatusCheckNodeInput(WorkflowNodeIOBase):
    url: str


class UrlStatusCheckNodeOutput(WorkflowNodeIOBase):
    code: str


class UrlStatusCheckNode(WorkflowNode):
    type = "UrlStatusCheckNode"
    description = "Outputs the status code of a GET request to a URL"
    image_url = ""

    def __init__(self, node_id: str, config: UrlStatusCheckNodeInput):
        super().__init__(node_id, config)
        self.config = config

    def run(self):
        try:
            response = requests.get(self.config.url)
            success = response.status_code != 404
            code = response.status_code
        except RequestException:
            success = False
            code = None
        output = UrlStatusCheckNodeOutput(status=code)
        return output
