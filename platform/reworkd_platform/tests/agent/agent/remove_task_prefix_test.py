import pytest
from reworkd_platform.web.api.agent.helpers import remove_task_prefix


@pytest.mark.parametrize(
    "task_input, expected_output",
    [
        ("Task: This is a sample task", "This is a sample task"),
        ("Task 1: Perform a comprehensive analysis of system performance.", "Perform a comprehensive analysis of system performance."),
        ("Task 2. Create a python script", "Create a python script"),
        ("5 - This is a sample task", "This is a sample task"),
        ("2: This is a sample task", "This is a sample task"),
        ("This is a sample task without a prefix", "This is a sample task without a prefix"),
        ("Step: This is a sample task", "This is a sample task"),
        ("Step 1: Perform a comprehensive analysis of system performance.", "Perform a comprehensive analysis of system performance."),
        ("Step 2:Create a python script", "Create a python script"),
        ("Step:This is a sample task", "This is a sample task"),
        (". Conduct research on the history of Nike", "Conduct research on the history of Nike"),
        (".This is a sample task", "This is a sample task"),
        ("1. Research the history and background of Nike company.", "Research the history and background of Nike company."),
    ],
)
def test_remove_task_prefix(task_input, expected_output) -> None:
    task_input = "Task: This is a sample task"
    output = remove_task_prefix(task_input)
    assert output == "This is a sample task"
