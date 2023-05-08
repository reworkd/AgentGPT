from dataclasses import dataclass
from typing import Literal


@dataclass
class Analysis:
    action: Literal["reason", "search"]
    arg: str


def get_default_analysis() -> Analysis:
    return Analysis("reason", "No analysis")
