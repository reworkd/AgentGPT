from pydantic import BaseModel, validator

from reworkd_platform.web.api.agent.tools.tools import (
    get_tool_name,
    get_available_tools,
    get_default_tool,
)

tool_names = [get_tool_name(tool) for tool in get_available_tools()]


class Analysis(BaseModel):
    reasoning: str
    action: str
    arg: str

    @validator("action")
    def action_must_be_valid_tool(cls, v):
        if v not in tool_names:
            raise ValueError("Analysis action is not a valid tool")
        return v


def get_default_analysis() -> Analysis:
    return Analysis(
        reasoning="Hmm... I'll have to try again",
        action=get_tool_name(get_default_tool()),
        arg="Analyze errored out",
    )
