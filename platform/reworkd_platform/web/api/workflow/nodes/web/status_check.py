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
    input_config: UrlStatusCheckNodeInput

    def __init__(self, node_id: str, input_config: UrlStatusCheckNodeInput):
        super().__init__(node_id, input_config)

    def run(self):
        try:
            response = requests.get(self.input_config.url)
            code = response.status_code
        except RequestException:
            code = None
            
        output = UrlStatusCheckNodeOutput(status=code)
        return output
