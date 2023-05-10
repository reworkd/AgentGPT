from langchain import WikipediaAPIWrapper

from reworkd_platform.web.api.agent.model_settings import ModelSettings
from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.agent.tools.utils import summarize


class WikipediaSearch(Tool):
    def __init__(self, model_settings: ModelSettings):
        super().__init__("Wiki", model_settings)
        self.wikipedia = WikipediaAPIWrapper()

    def call(self, goal: str, task: str, input_str: str) -> str:
        wikipedia_search = self.wikipedia.run(input_str)
        return summarize(self.model_settings, goal, task, [wikipedia_search])
