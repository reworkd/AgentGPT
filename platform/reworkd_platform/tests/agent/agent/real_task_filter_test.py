import pytest

from reworkd_platform.web.api.agent.helpers import real_tasks_filter


@pytest.mark.parametrize(
    "input_text, expected_result",
    [
        ("Write the report", True),
        ("No new task needed", False),
        ("Task completed", False),
        ("Do nothing", False),
        ("", False),  # empty_string
        ("no new task needed", False),  # case_insensitive
    ]
)
def test_real_tasks_filter_no_task(input_text, expected_result) -> None:
    assert real_tasks_filter(input_text) == expected_result
