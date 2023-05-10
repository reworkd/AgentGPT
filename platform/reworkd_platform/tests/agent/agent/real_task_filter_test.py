from reworkd_platform.web.api.agent.helpers import real_tasks_filter


def test_real_tasks_filter_valid_task() -> None:
    input_text = "Write the report"
    assert real_tasks_filter(input_text)


def test_real_tasks_filter_no_task() -> None:
    input_text = "No new task needed"
    assert not real_tasks_filter(input_text)


def test_real_tasks_filter_task_complete() -> None:
    input_text = "Task completed"
    assert not real_tasks_filter(input_text)


def test_real_tasks_filter_do_nothing() -> None:
    input_text = "Do nothing"
    assert not real_tasks_filter(input_text)


def test_real_tasks_filter_empty_string() -> None:
    input_text = ""
    assert not real_tasks_filter(input_text)


def test_real_tasks_filter_case_insensitive() -> None:
    input_text = "no new task needed"
    assert real_tasks_filter(input_text) == False
