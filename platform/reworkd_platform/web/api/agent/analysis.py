from typing import Literal

from pydantic import BaseModel


class Analysis(BaseModel):
    action: Literal["reason", "search"]
    arg: str


def get_default_analysis() -> Analysis:
    return Analysis(action="reason", arg="Default option when analyzing errors.")
