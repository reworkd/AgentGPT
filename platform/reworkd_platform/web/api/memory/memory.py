from abc import ABC, abstractmethod
from typing import Any, List, Tuple

SimilarTasks = List[Tuple[str, float]]


class AgentMemory(ABC):
    """
    Base class for AgentMemory
    Expose __enter__ and __exit__ to ensure connections get closed within requests
    """

    @abstractmethod
    def __enter__(self) -> "AgentMemory":
        raise NotImplementedError()

    @abstractmethod
    def __exit__(self, exc_type: Any, exc_value: Any, traceback: Any) -> None:
        raise NotImplementedError()

    @abstractmethod
    def add_tasks(self, tasks: List[str]) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def get_similar_tasks(self, query: str, score_threshold: float = 0.95) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def reset_class(self) -> None:
        raise NotImplementedError()

    @staticmethod
    def should_use() -> bool:
        return True
