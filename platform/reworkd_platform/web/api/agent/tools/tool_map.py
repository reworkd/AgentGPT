from typing import Dict, Type

from reworkd_platform.web.api.agent.tools.think import Think
from reworkd_platform.web.api.agent.tools.tool import Tool
from reworkd_platform.web.api.agent.tools.wikipedia_search import WikipediaSearch

tool_map: Dict[str, Type[Tool]] = {
    "wikipedia": WikipediaSearch,
    "think": Think,
}


def get_default_tool() -> Type[Tool]:
    return tool_map["think"]
