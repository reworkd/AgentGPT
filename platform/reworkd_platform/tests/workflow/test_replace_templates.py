import re

import pytest

from reworkd_platform.schemas.workflow.base import Block
from reworkd_platform.services.worker.execution_engine import (
    get_template,
    replace_templates,
)

TEMPLATE_PATTERN = r"\{\{(?P<id>[\w\d\-]+)\.(?P<key>[\w\d\-]+)\}\}"


def test_get_template() -> None:
    assert get_template("123", "curr") == "{{123.curr}}"


@pytest.mark.parametrize(
    "test_input,expected_output",
    [
        # Success cases
        ("{{1231-asdfds-12312.curr}}", {"id": "1231-asdfds-12312", "key": "curr"}),
        ("{{12-34-56.current}}", {"id": "12-34-56", "key": "current"}),
        ("{{abcd1234.test_key}}", {"id": "abcd1234", "key": "test_key"}),
        # Fail cases (return None)
        ("1231-asdfds-12312.curr", None),  # no curly braces
        ("{{1231-asdfds-12312}}", None),  # missing key
        ("{{.curr}}", None),  # missing id
        ("{{1231-asdfds-12312.}}", None),  # missing key after dot
        ("{{.}}", None),  # missing id and key
        ("{{1231 asdfds 12312.curr}}", None),  # id with spaces
        ("", None),  # empty string
    ],
)
def test_template_pattern(test_input: str, expected_output: dict) -> None:
    match = re.match(TEMPLATE_PATTERN, test_input)
    if match:
        assert match.groupdict() == expected_output
    else:
        assert match is expected_output  # should be None for failed matches


def test_replace_string() -> None:
    block = Block(
        id="12-34-56",
        type="test_type",
        input={"curr": "{{12-34-56.curr}}"},
    )
    outputs = {"{{12-34-56.curr}}": "test_value"}

    block = replace_templates(block, outputs)
    assert block.input.dict() == {"curr": "test_value"}


def test_replace_single_template() -> None:
    block = Block(
        id="12-34-56",
        type="test_type",
        input={"message": "The status code is: {{12-34-56.code}}"},
    )
    outputs = {"{{12-34-56.code}}": "200"}

    block = replace_templates(block, outputs)
    assert block.input.dict() == {"message": "The status code is: 200"}


def test_error_if_non_existent_template() -> None:
    block = Block(
        id="1231-asdfds-12312",
        type="test_type",
        input={"curr": "{{1231-asdfds-12312.curr}}"},
    )
    outputs = {}

    with pytest.raises(RuntimeError):
        replace_templates(block, outputs)
