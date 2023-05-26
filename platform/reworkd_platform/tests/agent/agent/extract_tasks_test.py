import pytest

from reworkd_platform.web.api.agent.helpers import extract_tasks


@pytest.mark.parametrize(
    "input_text, completed_tasks, expected_output",
    [
        (  # no completed tasks
            '["Task 1: Task one", "Task 2: Task two", "Task 3: Task three"]',
            [],
            ["Task one", "Task two", "Task three"]
        ),
        (  # tasks with completed tasks
            '["Task 1: Task one", "Task 2: Task two", "Task 3: Task three"]',
            ["Task two"],
            ["Task one", "Task three"]
        ),
        (  # only completed tasks
            '["Task 1: Task one", "Task 2: Task two", "Task 3: Task three"]',
            ["Task one", "Task two", "Task three"],
            []
        ),
        (  # empty input
            '[]',
            [],
            []
        ),
        (  # no valid tasks
            '["No tasks added", "Task complete", "Do nothing"]',
            [],
            []
        ),

    ]

)
def test_extract_tasks(input_text, completed_tasks, expected_output) -> None:
    output = extract_tasks(input_text, completed_tasks)
    assert output == expected_output
