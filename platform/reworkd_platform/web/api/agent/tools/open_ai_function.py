from typing import List, Type, TypedDict

from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.agent.tools.tools import get_tool_name


class FunctionDescription(TypedDict):
    """Representation of a callable function to the OpenAI API."""

    name: str
    """The name of the function."""
    description: str
    """A description of the function."""
    parameters: dict[str, object]
    """The parameters of the function."""


def analysis_function(tools: List[Type[Tool]]) -> FunctionDescription:
    """A function that will return the tool specifications from OpenAI"""
    tool_names = [get_tool_name(tool) for tool in tools]
    tool_name_to_description = [
        f"{get_tool_name(tool)}: {tool.description}" for tool in tools
    ]

    return {
        "name": "analysis",
        "description": (
            "Return an object for what specific 'action'/'tool' to call based on their descriptions:\n"
            f"{tool_name_to_description}"
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "reasoning": {
                    "type": "string",
                    "description": (
                        f"You must use one of the tools available to you: {tool_names}"
                        "This reasoning should be how you will accomplish the task with the provided action."
                        "Detail your overall plan along with any concerns you have."
                        "Ensure this reasoning value is in the user defined langauge "
                    ),
                },
                "action": {"type": "string", "enum": tool_names},
                "arg": {
                    "type": "string",
                    "description": "The appropriate action argument based on the action type",
                },
            },
            "required": ["reasoning", "action", "arg"],
        },
    }
