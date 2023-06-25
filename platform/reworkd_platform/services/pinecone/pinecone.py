from __future__ import annotations

import uuid
from typing import Any, Dict, List

import pinecone
from langchain.embeddings import OpenAIEmbeddings
from langchain.embeddings.base import Embeddings
from pydantic import BaseModel

from reworkd_platform.settings import settings
from reworkd_platform.timer import timed_function
from reworkd_platform.web.api.memory.memory import AgentMemory

OPENAI_EMBEDDING_DIM = 1536


class Row(BaseModel):
    id: str
    values: List[float]
    metadata: Dict[str, Any] = {}


class QueryResult(BaseModel):
    id: str
    score: float
    metadata: Dict[str, Any] = {}


class PineconeMemory(AgentMemory):
    """
    Wrapper around pinecone
    """

    def __init__(self, index_name: str):
        self.index = pinecone.Index(settings.pinecone_index_name)
        self.namespace = index_name

    @timed_function(level="DEBUG")
    def __enter__(self) -> AgentMemory:
        self.embeddings: Embeddings = OpenAIEmbeddings(
            client=None,  # Meta private value but mypy will complain its missing
            openai_api_key=settings.openai_api_key,
        )

        return self

    def __exit__(self, *args: Any, **kwargs: Any) -> None:
        pass

    @timed_function(level="DEBUG")
    def reset_class(self) -> None:
        self.index.delete(delete_all=True, namespace=self.namespace)

    @timed_function(level="DEBUG")
    def add_tasks(self, tasks: List[str]) -> List[str]:
        if len(tasks) == 0:
            return []

        embeds = self.embeddings.embed_documents(tasks)

        if len(tasks) != len(embeds):
            raise ValueError("Embeddings and tasks are not the same length")

        rows = [
            Row(values=vector, metadata={"text": tasks[i]}, id=str(uuid.uuid4()))
            for i, vector in enumerate(embeds)
        ]

        self.index.upsert(
            vectors=[row.dict() for row in rows], namespace=self.namespace
        )

        return [row.id for row in rows]

    @timed_function(level="DEBUG")
    def get_similar_tasks(
        self, text: str, score_threshold: float = 0.95
    ) -> List[QueryResult]:
        # Get similar tasks
        vector = self.embeddings.embed_query(text)
        results = self.index.query(
            vector=vector,
            top_k=5,
            include_metadata=True,
            include_values=True,
            namespace=self.namespace,
        )

        return [
            QueryResult(id=row.id, score=row.score, metadata=row.metadata)
            for row in getattr(results, "matches", [])
            if row.score > score_threshold
        ]

    @staticmethod
    def should_use() -> bool:
        return bool(
            settings.pinecone_index_name
            and settings.pinecone_api_key
            and settings.pinecone_environment
        )
