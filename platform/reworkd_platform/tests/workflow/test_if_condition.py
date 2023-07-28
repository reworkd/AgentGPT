import pytest

from reworkd_platform.schemas.workflow.blocks.conditions.if_condition import (
    IfCondition,
    IfInput,
    IfOutput,
)


@pytest.mark.parametrize(
    "value_one,operator,value_two,expected_result",
    [
        # Ints
        ("1", "==", "1", True),
        ("1", "!=", "2", True),
        ("1", "<", "2", True),
        ("2", ">", "1", True),
        ("2", "<=", "2", True),
        ("1", ">=", "1", True),
        # Floats
        ("1.5", "==", "1.5", True),
        ("1.5", "!=", "2.5", True),
        ("1.5", "<", "2.5", True),
        ("2.5", ">", "1.5", True),
        ("2.5", "<=", "2.5", True),
        ("1.5", ">=", "1.5", True),
        # Strings
        ("a", "==", "a", True),
        ("a", "!=", "b", True),
        ("a", "<", "b", True),
        ("b", ">", "a", True),
        ("a", "<=", "a", True),
        ("b", ">=", "a", True),
        # Edge cases
        ("", "==", "", True),
        (" ", "!=", "", True),
        (" ", "<", "a", True),
        ("b", ">", " ", True),
        (" ", "<=", " ", True),
        ("b", ">=", " ", True),
        ("1.5", "==", "1.50", True),  # Tests precision handling
    ],
)
async def test_if_condition_success(value_one, operator, value_two, expected_result):
    workflow_id = "123"
    block = IfCondition(
        input=IfInput(value_one=value_one, operator=operator, value_two=value_two)
    )
    result = await block.run(workflow_id)
    assert result == IfOutput(result=expected_result)


@pytest.mark.parametrize(
    "value_one,operator,value_two",
    [
        ("1", "invalid_operator", "2"),
        ("1", "==", "a"),
        ("1.5", "==", "a"),
        ("1", "==", ""),
    ],
)
async def test_if_condition_errors(value_one, operator, value_two):
    workflow_id = "123"
    block = IfCondition(
        input=IfInput(value_one=value_one, operator=operator, value_two=value_two)
    )
    with pytest.raises(ValueError):
        await block.run(workflow_id)
