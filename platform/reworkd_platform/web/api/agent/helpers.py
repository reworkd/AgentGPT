import json
import re
from typing import List


def remove_task_prefix(input_str: str) -> str:
    prefix_pattern = r"^(Task\s*\d*\.\s*|Task\s*\d*[-:]?\s*|-?\d+\s*[-:]?\s*)"
    return re.sub(prefix_pattern, "", input_str, flags=re.IGNORECASE)


def extract_tasks(text: str, completed_tasks: List[str]) -> List[str]:
    filtered_tasks = [
        remove_task_prefix(task)
        for task in extract_array(text)
        if real_tasks_filter(task)
    ]
    return [task for task in filtered_tasks if task not in completed_tasks]


def extract_array(input_str: str) -> List[str]:
    regex = (
        r"(\[(?:\s*(?:\"(?:[^\"\\]|\\.|\\n)*\"|\'(?:[^\'\\]|\\.|\\n)*\')\s*,"
        r"?)+\s*\])"
    )
    match = re.search(regex, input_str)

    if match and match[0]:
        try:
            return json.loads(match[0])
        except Exception as error:
            print(f"Error parsing the matched array: {error}")

    print(f"Error, could not extract array from input_string: {input_str}")
    return []


def real_tasks_filter(input_str: str) -> bool:
    no_task_regex = (
        r"^No( (new|further|additional|extra|other))? tasks? (is )?("
        r"required|needed|added|created|inputted).*"
    )
    task_complete_regex = r"^Task (complete|completed|finished|done|over|success).*"
    do_nothing_regex = r"^(\s*|Do nothing(\s.*)?)$"

    return (
        not re.search(no_task_regex, input_str, re.IGNORECASE)
        and not re.search(task_complete_regex, input_str, re.IGNORECASE)
        and not re.search(do_nothing_regex, input_str, re.IGNORECASE)
    )
