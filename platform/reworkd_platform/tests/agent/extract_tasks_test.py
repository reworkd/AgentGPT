from typing import List

from reworkd_platform.web.api.agent.helpers import extract_tasks


def test_extract_tasks_no_completed_tasks() -> None:
    input_text = '["Task 1: Task one", "Task 2: Task two", "Task 3: Task three"]'
    expected_output = ["Task one", "Task two", "Task three"]

    output = extract_tasks(input_text, [])

    assert output == expected_output


def test_extract_tasks_with_completed_tasks() -> None:
    input_text = '["Task 1: Task one", "Task 2: Task two", "Task 3: Task three"]'
    completed_tasks = ["Task two"]
    expected_output = ["Task one", "Task three"]

    output = extract_tasks(input_text, completed_tasks)

    assert output == expected_output


def test_extract_tasks_only_completed_tasks() -> None:
    input_text = '["Task 1: Task one", "Task 2: Task two", "Task 3: Task three"]'
    completed_tasks = ["Task one", "Task two", "Task three"]
    expected_output: List[str] = []

    output = extract_tasks(input_text, completed_tasks)

    assert output == expected_output


def test_extract_tasks_empty_input() -> None:
    input_text = "[]"
    completed_tasks: List[str] = []
    expected_output: List[str] = []

    output = extract_tasks(input_text, completed_tasks)

    assert output == expected_output


def test_extract_tasks_no_valid_tasks() -> None:
    input_text = '["No tasks added", "Task complete", "Do nothing"]'
    completed_tasks: List[str] = []
    expected_output: List[str] = []

    output = extract_tasks(input_text, completed_tasks)

    assert output == expected_output
