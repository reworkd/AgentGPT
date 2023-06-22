from typing import List, Type

import pytest
from langchain.schema import OutputParserException

from reworkd_platform.web.api.agent.task_output_parser import (
    TaskOutputParser,
    extract_array,
    real_tasks_filter,
    remove_prefix,
)


@pytest.mark.parametrize(
    "input_text,expected_output",
    [
        (
            '["Task 1: Do something", "Task 2: Do something else", "Task 3: Do '
            'another thing"]',
            ["Do something", "Do something else", "Do another thing"],
        ),
        (
            'Some random stuff ["1: Hello"]',
            ["Hello"],
        ),
        (
            "[]",
            [],
        ),
    ],
)
def test_parse_success(input_text: str, expected_output: List[str]) -> None:
    parser = TaskOutputParser(completed_tasks=[])
    result = parser.parse(input_text)
    assert result == expected_output


def test_parse_with_completed_tasks() -> None:
    input_text = '["One", "Two", "Three"]'
    completed = ["One"]
    expected = ["Two", "Three"]

    parser = TaskOutputParser(completed_tasks=completed)

    result = parser.parse(input_text)
    assert result == expected


@pytest.mark.parametrize(
    "input_text, exception",
    [
        # Test cases for non-array and non-multiline string inputs
        ("This is not an array", OutputParserException),
        ("123456", OutputParserException),
        ("Some random text", OutputParserException),
        ("[abc]", OutputParserException),
        # Test cases for malformed arrays
        ("[1, 2, 3", OutputParserException),
        ("'item1', 'item2']", OutputParserException),
        ("['item1', 'item2", OutputParserException),
        # Test case for invalid multiline strings
        ("This is not\na valid\nmultiline string.", OutputParserException),
        # Test case for multiline strings that don't start with digit + period
        ("Some text\nMore text\nAnd more text.", OutputParserException),
    ],
)
def test_parse_failure(input_text: str, exception: Type[Exception]) -> None:
    parser = TaskOutputParser(completed_tasks=[])
    with pytest.raises(exception):
        parser.parse(input_text)


@pytest.mark.parametrize(
    "input_str, expected",
    [
        # Test cases for empty array
        ("[]", []),
        # Test cases for arrays with one element
        ('["One"]', ["One"]),
        ("['Single quote']", ["Single quote"]),
        # Test cases for arrays with multiple elements
        ('["Research", "Develop", "Integrate"]', ["Research", "Develop", "Integrate"]),
        ('["Search", "Identify"]', ["Search", "Identify"]),
        ('["Item 1","Item 2","Item 3"]', ["Item 1", "Item 2", "Item 3"]),
        # Test cases for arrays with special characters in elements
        ("['Single with \"quote\"']", ['Single with "quote"']),
        ('["Escape \\" within"]', ['Escape " within']),
        # Test case for array embedded in other text
        ("Random stuff ['Search', 'Identify']", ["Search", "Identify"]),
        # Test case for array within JSON
        ('{"array": ["123", "456"]}', ["123", "456"]),
        # Multiline string cases
        (
            "1. Identify the target\n2. Conduct research\n3. Implement the methods",
            [
                "1. Identify the target",
                "2. Conduct research",
                "3. Implement the methods",
            ],
        ),
        ("1. Step one.\n2. Step two.", ["1. Step one.", "2. Step two."]),
        (
            """1. Review and understand the code to be debugged
2. Identify and address any errors or issues found during the review process
3. Print out debug information and setup initial variables
4. Start necessary threads and execute program logic.""",
            [
                "1. Review and understand the code to be debugged",
                "2. Identify and address any errors or issues found during the review "
                "process",
                "3. Print out debug information and setup initial variables",
                "4. Start necessary threads and execute program logic.",
            ],
        ),
        # Test cases with sentences before the digit + period pattern
        (
            "Any text before 1. Identify the task to be repeated\nUnrelated info 2. "
            "Determine the frequency of the repetition\nAnother sentence 3. Create a "
            "schedule or system to ensure completion of the task at the designated "
            "frequency\nMore text 4. Execute the task according to the established "
            "schedule or system",
            [
                "1. Identify the task to be repeated",
                "2. Determine the frequency of the repetition",
                "3. Create a schedule or system to ensure completion of the task at "
                "the designated frequency",
                "4. Execute the task according to the established schedule or system",
            ],
        ),
    ],
)
def test_extract_array_success(input_str: str, expected: List[str]) -> None:
    print(extract_array(input_str), expected)
    assert extract_array(input_str) == expected


@pytest.mark.parametrize(
    "input_str, exception",
    [
        (None, TypeError),
        ("123", RuntimeError),
        ("Some random text", RuntimeError),
        ('"single_string"', RuntimeError),
        ('{"test": 123}', RuntimeError),
        ('["Unclosed array", "other"', RuntimeError),
    ],
)
def test_extract_array_exception(input_str: str, exception: Type[Exception]) -> None:
    with pytest.raises(exception):
        extract_array(input_str)


@pytest.mark.parametrize(
    "task_input, expected_output",
    [
        ("Task: This is a sample task", "This is a sample task"),
        (
            "Task 1: Perform a comprehensive analysis of system performance.",
            "Perform a comprehensive analysis of system performance.",
        ),
        ("Task 2. Create a python script", "Create a python script"),
        ("5 - This is a sample task", "This is a sample task"),
        ("2: This is a sample task", "This is a sample task"),
        (
            "This is a sample task without a prefix",
            "This is a sample task without a prefix",
        ),
        ("Step: This is a sample task", "This is a sample task"),
        (
            "Step 1: Perform a comprehensive analysis of system performance.",
            "Perform a comprehensive analysis of system performance.",
        ),
        ("Step 2:Create a python script", "Create a python script"),
        ("Step:This is a sample task", "This is a sample task"),
        (
            ". Conduct research on the history of Nike",
            "Conduct research on the history of Nike",
        ),
        (".This is a sample task", "This is a sample task"),
        (
            "1. Research the history and background of Nike company.",
            "Research the history and background of Nike company.",
        ),
    ],
)
def test_remove_task_prefix(task_input: str, expected_output: str) -> None:
    output = remove_prefix(task_input)
    assert output == expected_output


@pytest.mark.parametrize(
    "input_text, expected_result",
    [
        ("Write the report", True),
        ("No new task needed", False),
        ("Task completed", False),
        ("Do nothing", False),
        ("", False),  # empty_string
        ("no new task needed", False),  # case_insensitive
    ],
)
def test_real_tasks_filter_no_task(input_text: str, expected_result: bool) -> None:
    assert real_tasks_filter(input_text) == expected_result
