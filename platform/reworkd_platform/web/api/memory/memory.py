from abc import ABC
from typing import List, Tuple

SimilarTasks = List[Tuple[str, float]]


class AgentMemory(ABC):
    """
    Base class for AgentMemory
    Expose __enter__ and __exit__ to ensure connections get closed within requests
    """

    def __enter__(self) -> "AgentMemory":
        pass

    def __exit__(self, exc_type, exc_value, traceback) -> None:
        pass

    def add_tasks(self, tasks: List[str]) -> None:
        pass

    def get_similar_tasks(self, query: str, score_threshold: float) -> List[str]:
        pass

    def reset_class(self):
        pass
