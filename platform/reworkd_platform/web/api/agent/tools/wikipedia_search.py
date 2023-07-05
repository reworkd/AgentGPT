import json
from typing import Any, Dict, List

import aiohttp
from lanarky.responses import StreamingResponse
from langchain.schema import Document
from pydantic import BaseModel, Extra, root_validator

from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.agent.tools.utils import (
    CitedSnippet,
    summarize_with_sources,
)


class Wikipedia(Tool):
    description = (
        "Search Wikipedia for information about historical people, companies, events, "
        "places or research. This should be used over search for broad overviews of "
        "specific nouns."
    )
    public_description = "Search Wikipedia for historical information."
    arg_description = "A simple query string of just the noun in question."

    async def call(self, goal: str, task: str, input_str: str) -> StreamingResponse:
        wikipedia_client = WikipediaAPIWrapper()  # type: ignore

        # TODO: Make the below async
        wikipedia_search = await wikipedia_client.run(input_str)
        snippets = [
            CitedSnippet(0, doc.page_content, doc.metadata["source"])
            for doc in wikipedia_search
        ]
        print(snippets)

        # return stream_string("Wikipedia is currently not working")
        return summarize_with_sources(
            self.model, self.language, goal, task, list(snippets)
        )


class WikipediaAPI:
    BASE_URL = "https://en.wikipedia.org/w/api.php"

    async def search(self, query: str):
        params = {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "format": "json",
        }

        async with aiohttp.ClientSession() as session:
            async with session.get(self.BASE_URL, params=params) as resp:
                response_text = await resp.text()

        data: Dict[str, Any] = json.loads(response_text)
        return data["query"]["search"]

    async def get_page(self, title: str):
        params = {
            "action": "query",
            "prop": "extracts|info",
            "inprop": "url",
            "explaintext": "True",
            "titles": title,
            "format": "json",
        }

        async with aiohttp.ClientSession() as session:
            async with session.get(self.BASE_URL, params=params) as resp:
                response_text = await resp.text()

        data: Dict[str, Any] = json.loads(response_text)
        pages_data = data["query"]["pages"]
        pages = list(pages_data.values())
        return pages[0]  # Returns multiple pages but we only expect a single result


class WikipediaAPIWrapper(BaseModel):
    wiki_client: Any
    top_k_results: int = 1
    doc_content_chars_max: int = 4000

    class Config:
        extra = Extra.forbid

    @root_validator()
    def validate_environment(cls, values: Dict) -> Dict:
        values["wiki_client"] = WikipediaAPI()
        return values

    async def run(self, query: str) -> List[Document]:
        search_results = await self.wiki_client.search(query)
        documents = []
        for result in search_results[: self.top_k_results]:
            page_data = await self.wiki_client.get_page(result["title"])
            document = self._page_to_document(page_data)
            documents.append(document)
        return documents

    def _page_to_document(self, page_data: Dict) -> Document:
        page_content = page_data.get("extract", "")[: self.doc_content_chars_max]
        metadata = {
            "title": page_data.get("title"),
            "source": page_data.get("fullurl"),
        }
        return Document(page_content=page_content, metadata=metadata)
