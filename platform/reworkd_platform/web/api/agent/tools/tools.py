from typing import Type, List

from reworkd_platform.web.api.agent.tools.conclude import Conclude
from reworkd_platform.web.api.agent.tools.image import Image
from reworkd_platform.web.api.agent.tools.reason import Reason
from reworkd_platform.web.api.agent.tools.search import Search
from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.agent.tools.wikipedia_search import Wikipedia


def get_available_tools() -> List[Type[Tool]]:
    return get_external_tools() + get_default_tools()


def get_external_tools() -> List[Type[Tool]]:
    return [
        Wikipedia,
        Image,
        Search,
    ]


def get_default_tools() -> List[Type[Tool]]:
    return [
        Reason,
        Conclude,
    ]


def get_tool_name(tool: Type[Tool]) -> str:
    return format_tool_name(tool.__name__)


def format_tool_name(tool_name: str) -> str:
    return tool_name.lower()


def get_tools_overview() -> str:
    """Return a formatted string of name: description pairs for all available tools"""
    return "\n".join(
        [f"{get_tool_name(tool)}: {tool.description}" for tool in get_available_tools()]
    )


def get_tool_from_name(tool_name: str) -> Type[Tool]:
    for tool in get_available_tools():
        if get_tool_name(tool) == format_tool_name(tool_name):
            return tool

    return get_default_tool()


def get_default_tool() -> Type[Tool]:
    return Reason
