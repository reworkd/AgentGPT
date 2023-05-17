from reworkd_platform.web.api.agent.helpers import remove_task_prefix


def test_removes_task_colon() -> None:
    task_input = "Task: This is a sample task"
    output = remove_task_prefix(task_input)
    assert output == "This is a sample task"


def test_removes_task_n_colon() -> None:
    task_input = "Task 1: Perform a comprehensive analysis of system performance."
    output = remove_task_prefix(task_input)
    assert output == "Perform a comprehensive analysis of system performance."


def test_removes_task_n_dot() -> None:
    task_input = "Task 2. Create a python script"
    output = remove_task_prefix(task_input)
    assert output == "Create a python script"


def test_removes_n_hyphen() -> None:
    task_input = "5 - This is a sample task"
    output = remove_task_prefix(task_input)
    assert output == "This is a sample task"


def test_removes_n_colon() -> None:
    task_input = "2: This is a sample task"
    output = remove_task_prefix(task_input)
    assert output == "This is a sample task"


def test_no_prefix() -> None:
    task_input = "This is a sample task without a prefix"
    output = remove_task_prefix(task_input)
    assert output == task_input


def test_removes_step_colon() -> None:
    task_input = "Step: This is a sample task"
    output = remove_task_prefix(task_input)
    assert output == "This is a sample task"


def test_removes_step_n_colon() -> None:
    task_input = "Step 1: Perform a comprehensive analysis of system performance."
    output = remove_task_prefix(task_input)
    assert output == "Perform a comprehensive analysis of system performance."


def test_removes_step_n_colon_no_space() -> None:
    task_input = "Step 2:Create a python script"
    output = remove_task_prefix(task_input)
    assert output == "Create a python script"


def test_removes_step_colon_no_space() -> None:
    task_input = "Step:This is a sample task"
    output = remove_task_prefix(task_input)
    assert output == "This is a sample task"


def test_removes_leading_dot_space() -> None:
    task_input = ". Conduct research on the history of Nike"
    output = remove_task_prefix(task_input)
    assert output == "Conduct research on the history of Nike"


def test_removes_leading_dot() -> None:
    task_input = ".This is a sample task"
    output = remove_task_prefix(task_input)
    assert output == "This is a sample task"


def test_removes_digit_dot_space_prefix() -> None:
    task_input = "1. Research the history and background of Nike company."
    output = remove_task_prefix(task_input)
    assert output == "Research the history and background of Nike company."
