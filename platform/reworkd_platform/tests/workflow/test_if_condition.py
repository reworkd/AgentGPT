import pytest

from reworkd_platform.schemas.workflow.blocks.conditions.ifcondition import (
    IfCondition,
    IfInput,
    IfOutput,
)


@pytest.mark.parametrize(
    "value_one,operator,value_two,expected_result",
    [
        (1, "==", 1, True),
        (1, "!=", 2, True),
        (1, "<", 2, True),
        (2, ">", 1, True),
        (2, "<=", 2, True),
        (1, ">=", 1, True),
        ("a", "==", "a", True),
        ("a", "!=", "b", True),
        ("a", "<", "b", True),
        ("b", ">", "a", True),
        ("a", "<=", "a", True),
        ("b", ">=", "a", True),
        (1.5, "==", 1.5, True),
        (1.5, "!=", 2.5, True),
        (1.5, "<", 2.5, True),
        (2.5, ">", 1.5, True),
        (2.5, "<=", 2.5, True),
        (1.5, ">=", 1.5, True),
        (True, "==", True, True),
        (True, "!=", False, True),
        (False, "<", True, True),
        (True, ">", False, True),
        (False, "<=", False, True),
        (True, ">=", True, True),
    ],
)
async def test_if_condition_success(value_one, operator, value_two, expected_result):
    block = IfCondition(
        input=IfInput(value_one=value_one, operator=operator, value_two=value_two)
    )
    result = await block.run()
    assert result == IfOutput(result=expected_result)


@pytest.mark.parametrize(
    "value_one,operator,value_two",
    [
        (1, "invalid_operator", 2),
        ("a", "==", 1),
        (1.5, "==", "a"),
        (True, "==", 1),
        (1, "==", "a"),
    ],
)
async def test_if_condition_errors(value_one, operator, value_two):
    block = IfCondition(
        input=IfInput(value_one=value_one, operator=operator, value_two=value_two)
    )
    with pytest.raises(ValueError):
        await block.run()
