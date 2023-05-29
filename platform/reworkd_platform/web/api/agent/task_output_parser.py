import json
import re
from typing import List

from langchain.schema import BaseOutputParser, OutputParserException


class TaskOutputParser(BaseOutputParser[List[str]]):
    """
    Extension of LangChain's BaseOutputParser
    Responsible for parsing task creation output into a list of task strings
    """

    def parse(self, text: str) -> List[str]:
        try:
            array_str = extract_array(text)
            return [
                remove_prefix(task) for task in array_str if real_tasks_filter(task)
            ]
        except Exception as e:
            msg = f"Failed to parse tasks from completion {text}. Got: {e}"
            raise OutputParserException(msg)

    def get_format_instructions(self) -> str:
        raise NotImplementedError(
            "TaskOutputParser does not support format instructions"
        )


def extract_array(input_str: str) -> List[str]:
    regex = (
        r"\[\s*\]|"  # Empty array check`
        r"(\[(?:\s*(?:\"(?:[^\"\\]|\\.|\\n)*\"|\'(?:[^\'\\]|\\.|\\n)*\')\s*,"
        r"?)+\s*\])"
    )
    match = re.search(regex, input_str)
    return json.loads(match[0])


def remove_prefix(input_str: str) -> str:
    prefix_pattern = (
        r"^(Task\s*\d*\.\s*|Task\s*\d*[-:]?\s*|Step\s*\d*["
        r"-:]?\s*|Step\s*[-:]?\s*|\d+\.\s*|\d+\s*[-:]?\s*|^\.\s*|^\.*)"
    )
    return re.sub(prefix_pattern, "", input_str, flags=re.IGNORECASE)


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
