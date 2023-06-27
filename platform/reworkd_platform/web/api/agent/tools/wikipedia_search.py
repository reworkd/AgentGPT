from lanarky.responses import StreamingResponse
from langchain import WikipediaAPIWrapper

from reworkd_platform.web.api.agent.stream_mock import stream_string
from reworkd_platform.web.api.agent.tools.tool import Tool


class Wikipedia(Tool):
    description = (
        "Search Wikipedia for information about historical people, companies, events, "
        "places or research. This should be used over search for broad overviews of "
        "specific nouns."
    )
    public_description = "Search Wikipedia for historical information."
    arg_description = "A simple query string of just the noun in question."

    async def call(self, goal: str, task: str, input_str: str) -> StreamingResponse:
        wikipedia_client = WikipediaAPIWrapper(
            wiki_client=None,  # Meta private value but mypy will complain its missing
        )

        # TODO: Make the below async
        wikipedia_search = wikipedia_client.run(input_str)
        # return summarize(self.model, self.language, goal, task, [wikipedia_search])
        return stream_string("Wikipedia is currently not working")
