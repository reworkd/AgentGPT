import pytest
from pydantic import ValidationError

from reworkd_platform.web.api.agent.analysis import Analysis
from reworkd_platform.web.api.agent.tools.tools import get_default_tool, get_tool_name


def test_analysis_model() -> None:
    valid_tool_name = get_tool_name(get_default_tool())
    analysis = Analysis(action=valid_tool_name, arg="arg", reasoning="reasoning")

    assert analysis.action == valid_tool_name
    assert analysis.arg == "arg"
    assert analysis.reasoning == "reasoning"


def test_analysis_model_search_empty_arg() -> None:
    with pytest.raises(ValidationError):
        Analysis(action="search", arg="", reasoning="reasoning")


def test_analysis_model_search_non_empty_arg() -> None:
    analysis = Analysis(action="search", arg="non-empty arg", reasoning="reasoning")
    assert analysis.action == "search"
    assert analysis.arg == "non-empty arg"
    assert analysis.reasoning == "reasoning"


def test_analysis_model_invalid_tool() -> None:
    with pytest.raises(ValidationError):
        Analysis(action="invalid tool name", arg="test argument", reasoning="reasoning")


def test_get_default_analysis() -> None:
    default_analysis = Analysis.get_default_analysis()
    assert isinstance(default_analysis, Analysis)
    assert default_analysis.action == "reason"
    assert default_analysis.arg == "Analyze errored out"
