from typing import Dict

from pydantic import BaseModel, validator


class AnalysisArguments(BaseModel):
    """
    Arguments for the analysis function of a tool. OpenAI functions will resolve these values but leave out the action.
    """

    reasoning: str
    arg: str


class Analysis(AnalysisArguments):
    action: str

    @validator("action")
    def action_must_be_valid_tool(cls, v: str) -> str:
        # TODO: Remove circular import
        from reworkd_platform.web.api.agent.tools.tools import get_available_tools_names

        if v not in get_available_tools_names():
            raise ValueError(f"Analysis action '{v}' is not a valid tool")
        return v

    @validator("action")
    def search_action_must_have_arg(cls, v: str, values: Dict[str, str]) -> str:
        from reworkd_platform.web.api.agent.tools.search import Search
        from reworkd_platform.web.api.agent.tools.tools import get_tool_name

        if v == get_tool_name(Search) and not values["arg"]:
            raise ValueError("Analysis arg cannot be empty if action is 'search'")
        return v

    @classmethod
    def get_default_analysis(cls) -> "Analysis":
        # TODO: Remove circular import
        from reworkd_platform.web.api.agent.tools.tools import get_default_tool_name

        return cls(
            reasoning="Hmm... I'll have to try again",
            action=get_default_tool_name(),
            arg="Analyze errored out",
        )
