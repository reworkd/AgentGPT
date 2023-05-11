from reworkd_platform.web.api.agent.tools.think import Think
from reworkd_platform.web.api.agent.tools.tools import (get_tool_descriptions,
                                                        get_tool_from_name,
                                                        get_default_tool)
from reworkd_platform.web.api.agent.tools.wikipedia_search import Wikipedia


def test_get_tool_descriptions() -> None:
    """Simple test to assert that the wikipedia description is what we expect."""
    descriptions = get_tool_descriptions().split("\n")
    wikipedia_description = "wikipedia: Search Wikipedia for information."
    assert wikipedia_description in descriptions


def test_get_tool_from_name() -> None:
    assert get_tool_from_name("Wikipedia") == Wikipedia
    assert get_tool_from_name("WiKiPeDia") == Wikipedia
    assert get_tool_from_name("Think") == Think
    assert get_tool_from_name("NonExistingTool") == Think


def test_get_default_tool() -> None:
    assert get_default_tool() == Think
