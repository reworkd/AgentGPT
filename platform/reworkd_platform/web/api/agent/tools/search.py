from typing import Any

import requests

from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.model_settings import ModelSettings
from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.agent.tools.utils import summarize


# Search google via serper.dev. Adapted from LangChain
# https://github.com/hwchase17/langchain/blob/master/langchain/utilities


def _google_serper_search_results(
    search_term: str, search_type: str = "search", **kwargs: Any
) -> dict:
    headers = {
        "X-API-KEY": settings.serp_api_key or "",
        "Content-Type": "application/json",
    }
    params = {
        "q": search_term,
        **{key: value for key, value in kwargs.items() if value is not None},
    }
    response = requests.post(
        f"https://google.serper.dev/{search_type}", headers=headers, params=params
    )
    response.raise_for_status()
    search_results = response.json()
    return search_results


class Search(Tool):
    description = (
        "Search Google for short up to date searches for simple questions "
        "news and people.\n"
        "The argument should be the search query."
    )
    public_description = "Search google for information about current events."

    def __init__(self, model_settings: ModelSettings):
        super().__init__(model_settings)

    def call(self, goal: str, task: str, input_str: str) -> str:
        results = _google_serper_search_results(
            input_str,
        )

        k = 6  # Number of results to return
        max_links = 3  # Number of links to return
        snippets = []
        links = []

        if results.get("answerBox"):
            answer_values = []
            answer_box = results.get("answerBox", {})
            if answer_box.get("answer"):
                answer_values.append(answer_box.get("answer"))
            elif answer_box.get("snippet"):
                answer_values.append(answer_box.get("snippet").replace("\n", " "))
            elif answer_box.get("snippetHighlighted"):
                answer_values.append(", ".join(answer_box.get("snippetHighlighted")))

            if len(answer_values) > 0:
                return "\n".join(answer_values)

        if results.get("knowledgeGraph"):
            kg = results.get("knowledgeGraph", {})
            title = kg.get("title")
            entity_type = kg.get("type")
            if entity_type:
                snippets.append(f"{title}: {entity_type}.")
            description = kg.get("description")
            if description:
                snippets.append(description)
            for attribute, value in kg.get("attributes", {}).items():
                snippets.append(f"{title} {attribute}: {value}.")

        for result in results["organic"][:k]:
            if "snippet" in result:
                snippets.append(result["snippet"])
            if "link" in result and len(links) < max_links:
                links.append(result["link"])
            for attribute, value in result.get("attributes", {}).items():
                snippets.append(f"{attribute}: {value}.")

        if len(snippets) == 0:
            return "No good Google Search Result was found"

        summary = summarize(self.model_settings, goal, task, snippets)

        return f"{summary}\n\nLinks:\n" + "\n".join([f"- {link}" for link in links])
