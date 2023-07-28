from typing import Literal, TypeVar, Any

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase

T = TypeVar("T", float, str)


class IfInput(BlockIOBase):
    value_one: str
    operator: Literal["==", "!=", "<", ">", "<=", ">="]
    value_two: str


class IfOutput(BlockIOBase):
    result: bool


class IfCondition(Block):
    type = "IfCondition"
    description = "Conditionally take a path"
    input: IfInput

    async def run(self, workflow_id: str, **kwargs: Any) -> IfOutput:
        value_one = self.input.value_one
        value_two = self.input.value_two
        operator = self.input.operator

        result = compare(value_one, operator, value_two)

        return IfOutput(result=result)


def compare(value_one: str, operator: str, value_two: str) -> bool:
    if is_number(value_one) and is_number(value_two):
        return perform_operation(float(value_one), operator, float(value_two))
    else:
        return perform_operation(value_one, operator, value_two)


def perform_operation(value_one: T, operator: str, value_two: T) -> bool:
    if operator == "==":
        return value_one == value_two
    elif operator == "!=":
        return value_one != value_two
    elif operator == "<":
        return value_one < value_two
    elif operator == ">":
        return value_one > value_two
    elif operator == "<=":
        return value_one <= value_two
    elif operator == ">=":
        return value_one >= value_two
    else:
        raise ValueError(f"Invalid operator: {operator}")


def is_number(string: str) -> bool:
    try:
        float(string)
        return True
    except ValueError:
        return False
