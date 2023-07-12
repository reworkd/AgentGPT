from typing import Optional

import requests
from requests import RequestException

from reworkd_platform.web.api.workflow.schemas import Block, BlockIOBase


class UrlStatusCheckBlockInput(BlockIOBase):
    url: str


class UrlStatusCheckBlockOutput(BlockIOBase):
    code: Optional[int]


class UrlStatusCheckBlock(Block):
    type = "UrlStatusCheckNode"
    description = "Outputs the status code of a GET request to a URL"
    image_url = ""
    input_config: UrlStatusCheckBlockInput

    def run(self) -> BlockIOBase:
        try:
            response = requests.get(self.input_config.url)
            code = response.status_code
        except RequestException:
            code = None

        output = UrlStatusCheckBlockOutput(code=code)
        return output
