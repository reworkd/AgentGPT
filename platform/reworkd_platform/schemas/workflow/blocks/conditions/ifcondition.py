from typing import Literal, Union

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class IfInput(BlockIOBase):
    value_one: Union[str, int, float, bool]
    operator: Literal["==", "!=", "<", ">", "<=", ">="]
    value_two: Union[str, int, float, bool]


class IfOutput(BlockIOBase):
    result: bool


class IfCondition(Block):
    type = "IfCondition"
    description = "Conditionally take a path"
    input: IfInput

    async def run(self) -> IfOutput:
        value_one = self.input.value_one
        value_two = self.input.value_two
        operator = self.input.operator

        if operator == "==":
            result = value_one == value_two
        elif operator == "!=":
            result = value_one != value_two
        elif operator == "<":
            result = value_one < value_two
        elif operator == ">":
            result = value_one > value_two
        elif operator == "<=":
            result = value_one <= value_two
        elif operator == ">=":
            result = value_one >= value_two
        else:
            raise ValueError(f"Invalid operator: {operator}")

        return IfOutput(result=result)
