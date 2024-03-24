from typing import Any, List

from reworkd_platform.web.api.memory.memory import AgentMemory


class NullAgentMemory(AgentMemory):
    """
    NullObjectPattern for AgentMemory
    Used when database connections cannot be established
    """

    def __enter__(self) -> AgentMemory:
        return self

    def __exit__(self, exc_type: Any, exc_value: Any, traceback: Any) -> None:
        pass

    def add_tasks(self, tasks: List[str]) -> List[str]:
        return []

    def get_similar_tasks(self, query: str, score_threshold: float = 0) -> List[str]:
        return []

    def reset_class(self) -> None:
        pass
