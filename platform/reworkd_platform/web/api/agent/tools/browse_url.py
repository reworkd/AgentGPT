from typing import Any

from lanarky.responses import StreamingResponse

from reworkd_platform.web.api.agent.stream_mock import stream_string
from reworkd_platform.web.api.agent.tools.tool import Tool

import trafilatura
import json


class Browser(Tool):
    description = "use this to read a website"
    public_description = "use this to read a website"
    arg_description = 'need a JSON string: { "url": "URL of the website to read", "cursor": "Defaul is 0. Start reading from this character. Use when the first response was truncated and you want to continue reading the page."}'
    image_url = "/tools/web.png"

    async def call(
        self, goal: str, task: str, input_str: str, *args: Any, **kwargs: Any
    ) -> StreamingResponse:
        try:
            input = json.loads(input_str)
        except json.decoder.JSONDecodeError:
            return stream_string(
                "Could not parse JSON input, need a JSON string with keys 'url' and 'cursor'"
            )
        cursor = input.get("cursor", 0)
        page_contents = self._run(input["url"], cursor)
        return stream_string(page_contents)

    def _run(self, url: str, cursor: int = 0) -> str:
        page_contents = self._get_url(url)
        if len(page_contents) > 4000:
            page_contents = self._page_result(page_contents, cursor, 4000)
            page_contents += f"\nPAGE WAS TRUNCATED. TO CONTINUE READING, USE CURSOR={cursor+len(page_contents)}."

        return page_contents

    def _page_result(self, text: str, cursor: int, max_length: int) -> str:
        """Page through `text` and return a substring of `max_length` characters starting from `cursor`."""
        return text[cursor : cursor + max_length]

    def _get_url(self, url: str) -> str:
        """Fetch URL and return the contents as a string."""

        downloaded = trafilatura.fetch_url(url)
        if downloaded is None:
            return "Could not download web"
        result = trafilatura.extract(downloaded)
        if result:
            return result
        else:
            return "Could not extract web"
