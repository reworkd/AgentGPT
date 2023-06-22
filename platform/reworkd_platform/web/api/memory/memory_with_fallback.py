from __future__ import annotations

from typing import Any, List

from loguru import logger

from reworkd_platform.web.api.memory.memory import AgentMemory


class MemoryWithFallback(AgentMemory):
    """
    Wrap a primary AgentMemory provider and use a fallback in the case that it fails
    We do this because we've had issues with Weaviate crashing and causing memory to randomly fail
    """

    def __init__(self, primary: AgentMemory, secondary: AgentMemory):
        self.primary = primary
        self.secondary = secondary

    def __enter__(self) -> AgentMemory:
        try:
            return self.primary.__enter__()
        except Exception as e:
            logger.exception(e)
            return self.secondary.__enter__()

    def __exit__(self, exc_type: Any, exc_value: Any, traceback: Any) -> None:
        try:
            self.primary.__exit__(exc_type, exc_value, traceback)
        except Exception as e:
            logger.exception(e)
            self.secondary.__exit__(exc_type, exc_value, traceback)

    def add_tasks(self, tasks: List[str]) -> List[str]:
        try:
            return self.primary.add_tasks(tasks)
        except Exception as e:
            logger.exception(e)
            return self.secondary.add_tasks(tasks)

    def get_similar_tasks(self, query: str, score_threshold: float = 0) -> List[str]:
        try:
            return self.primary.get_similar_tasks(query)
        except Exception as e:
            logger.exception(e)
            return self.secondary.get_similar_tasks(query)

    def reset_class(self) -> None:
        try:
            self.primary.reset_class()
        except Exception as e:
            logger.exception(e)
            self.secondary.reset_class()
