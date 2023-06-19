from typing import Type, TypedDict

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


def get_tool_function(tool: Type[Tool]) -> FunctionDescription:
    """A function that will return the tool's function specification"""
    name = get_tool_name(tool)

    return {
        "name": name,
        "description": tool.description,
        "parameters": {
            "type": "object",
            "properties": {
                "reasoning": {
                    "type": "string",
                    "description": (
                        f"Reasoning is how the task will be accomplished with the current function. "
                        "Detail your overall plan along with any concerns you have."
                        "Ensure this reasoning value is in the user defined langauge "
                    ),
                },
                "arg": {
                    "type": "string",
                    "description": tool.arg_description,
                },
            },
            "required": ["reasoning", "arg"],
        },
    }
