from typing import Type, List

from reworkd_platform.web.api.agent.tools.think import Think
from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.agent.tools.wikipedia_search import Wikipedia


def get_available_tools() -> List[Type[Tool]]:
    return [
        Wikipedia,
        Think,
    ]


def get_tool_descriptions() -> str:
    """Return a formatted string of name: description pairs for all available tools"""
    return "\n".join(
        [
            f"{tool.__name__.lower()}: {tool.description}"
            for tool in get_available_tools()
        ]
    )


def get_tool_from_name(tool_name: str) -> Type[Tool]:
    for tool in get_available_tools():
        if tool.__name__.lower() == tool_name.lower():
            return tool

    return get_default_tool()


def get_default_tool() -> Type[Tool]:
    return Think
