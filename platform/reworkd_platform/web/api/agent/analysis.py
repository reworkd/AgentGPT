from pydantic import BaseModel, validator


class Analysis(BaseModel):
    reasoning: str
    action: str
    arg: str

    @validator("action")
    def action_must_be_valid_tool(cls, v: str) -> str:
        # TODO: Remove circular import
        from reworkd_platform.web.api.agent.tools.tools import get_available_tools_names

        if v not in get_available_tools_names():
            raise ValueError("Analysis action is not a valid tool")
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
