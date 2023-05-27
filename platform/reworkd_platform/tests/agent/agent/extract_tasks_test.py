from typing import List

import pytest

from reworkd_platform.web.api.agent.helpers import extract_tasks


@pytest.mark.parametrize(
    "input_text, completed_tasks, expected_output",
    [
        (  # no completed tasks
            '["Task 1: Task one", "Task 2: Task two", "Task 3: Task three"]',
            [],
            ["Task one", "Task two", "Task three"],
        ),
        (  # tasks with completed tasks
            '["Task 1: Task one", "Task 2: Task two", "Task 3: Task three"]',
            ["Task two"],
            ["Task one", "Task three"],
        ),
        (  # only completed tasks
            '["Task 1: Task one", "Task 2: Task two", "Task 3: Task three"]',
            ["Task one", "Task two", "Task three"],
            [],
        ),
        ("[]", [], []),  # empty input
        ('["No tasks added", "Task complete", "Do nothing"]', [], []),  # no valid tasks
    ],
)
def test_extract_tasks(
    input_text: str, completed_tasks: List[str], expected_output: List[str]
) -> None:
    output = extract_tasks(input_text, completed_tasks)
    assert output == expected_output
