from typing import Optional

import requests
from loguru import logger
from requests import RequestException

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class UrlStatusCheckBlockInput(BlockIOBase):
    url: str


class UrlStatusCheckBlockOutput(BlockIOBase):
    code: Optional[int]


class UrlStatusCheckBlock(Block):
    type = "UrlStatusCheck"
    description = "Outputs the status code of a GET request to a URL"
    image_url = ""
    input: UrlStatusCheckBlockInput

    async def run(self) -> BlockIOBase:
        logger.info("Starting UrlStatusCheckBlock")
        try:
            response = requests.get(self.input.url)
            code = response.status_code
        except RequestException:
            code = None

        logger.info("UrlStatusCheckBlock Code", code)
        output = UrlStatusCheckBlockOutput(code=code)
        return output
