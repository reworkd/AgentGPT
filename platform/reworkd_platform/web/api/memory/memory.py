from abc import ABC
from typing import Any, List, Tuple

SimilarTasks = List[Tuple[str, float]]


class AgentMemory(ABC):
    """
    Base class for AgentMemory
    Expose __enter__ and __exit__ to ensure connections get closed within requests
    """

    def __enter__(self) -> "AgentMemory":
        raise NotImplementedError()

    def __exit__(self, exc_type: Any, exc_value: Any, traceback: Any) -> None:
        raise NotImplementedError()

    def add_tasks(self, tasks: List[str]) -> List[str]:
        raise NotImplementedError()

    def get_similar_tasks(self, query: str, score_threshold: float) -> List[str]:
        raise NotImplementedError()

    def reset_class(self) -> None:
        pass
