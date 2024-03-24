from typing import List, Type

from reworkd_platform.web.api.agent.tools.conclude import Conclude
from reworkd_platform.web.api.agent.tools.image import Image
from reworkd_platform.web.api.agent.tools.reason import Reason
from reworkd_platform.web.api.agent.tools.search import Search
from reworkd_platform.web.api.agent.tools.sidsearch import SID
from reworkd_platform.web.api.agent.tools.tools import (
    Tool,
    format_tool_name,
    get_default_tool,
    get_tool_from_name,
    get_tool_name,
    get_tools_overview,
)


def test_get_tool_name() -> None:
    assert get_tool_name(Image) == "image"
    assert get_tool_name(Search) == "search"
    assert get_tool_name(Reason) == "reason"


def test_format_tool_name() -> None:
    assert format_tool_name("Search") == "search"
    assert format_tool_name("reason") == "reason"
    assert format_tool_name("Conclude") == "conclude"
    assert format_tool_name("CoNcLuDe") == "conclude"


def test_get_tools_overview_no_duplicates() -> None:
    """Test to assert that the tools overview doesn't include duplicates."""
    tools: List[Type[Tool]] = [Image, Search, Reason, Conclude, Image, Search]
    overview = get_tools_overview(tools)

    # Check if each unique tool description is included in the overview
    for tool in set(tools):
        expected_description = f"'{get_tool_name(tool)}': {tool.description}"
        assert expected_description in overview

    # Check for duplicates in the overview
    overview_list = overview.split("\n")
    assert len(overview_list) == len(
        set(overview_list)
    ), "Overview includes duplicate entries"


def test_get_default_tool() -> None:
    assert get_default_tool() == Search


def test_get_tool_from_name() -> None:
    assert get_tool_from_name("Search") == Search
    assert get_tool_from_name("CoNcLuDe") == Conclude
    assert get_tool_from_name("NonExistingTool") == Search
    assert get_tool_from_name("SID") == SID
