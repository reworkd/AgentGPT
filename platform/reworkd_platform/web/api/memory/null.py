from typing import List

from reworkd_platform.web.api.memory.memory import AgentMemory


class NullAgentMemory(AgentMemory):
    """
    NullObjectPattern for AgentMemory
    Used when database connections cannot be established
    """

    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc_value, traceback) -> None:
        pass

    def add_tasks(self, task: List[str]) -> None:
        pass

    def get_similar_tasks(self, query: str, score_threshold: float) -> List[str]:
        return []
