from __future__ import annotations

import uuid
from typing import Any, Dict, List, Tuple, Optional

from langchain.embeddings import OpenAIEmbeddings
from langchain.embeddings.base import Embeddings
from pydantic import BaseModel, Field
from vecs import Client, Collection
from vecs.exc import CollectionNotFound

from reworkd_platform.settings import settings
from reworkd_platform.timer import timed_function
from reworkd_platform.web.api.memory.memory import AgentMemory

OPENAI_EMBEDDING_DIM = 1536


class Row(BaseModel):
    id: str = Field(default_factory=uuid.uuid4)
    vector: List[float]
    metadata: Dict[str, Any] = {}

    def to_tuple(self) -> Tuple[Optional[str], List[float], Dict[str, Any]]:
        return self.id, self.vector, self.metadata


class QueryResult(BaseModel):
    id: str
    score: float
    metadata: Dict[str, Any] = {}


class VecsMemory(AgentMemory):
    """
    Wrapper around the supabase vecs package
    """

    client: Client
    _collection: Optional[Collection]

    def __init__(self, client: Client, index_name: str):
        self.client = client
        self.index_name = index_name
        self._collection = None

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
        try:
            self.client.delete_collection(self.index_name)
        except CollectionNotFound:
            pass

    @timed_function(level="DEBUG")
    def add_tasks(self, tasks: List[str]) -> List[str]:
        embeds = self.embeddings.embed_documents(tasks)

        if len(tasks) != len(embeds):
            raise ValueError("Embeddings and tasks are not the same length")

        rows = [
            Row(vector=vector, metadata={"text": tasks[i]})
            for i, vector in enumerate(embeds)
        ]

        self.collection.upsert([row.to_tuple() for row in rows])

        return [row.id for row in rows]

    @timed_function(level="DEBUG")
    def get_similar_tasks(
        self, query: str, score_threshold: float = 0.95
    ) -> List[QueryResult]:
        # Get similar tasks
        vector = self.embeddings.embed_query(query)
        results = [
            QueryResult(id=row[0], score=1 - row[1], metadata=row[2])
            for row in self.collection.query(
                query_vector=vector, include_value=True, include_metadata=True, limit=5
            )
        ]

        return [result for result in results if result.score > score_threshold]

    @property
    def collection(self) -> Collection:
        if self._collection:
            return self._collection

        try:
            self._collection = self.client.get_collection(self.index_name)
        except CollectionNotFound:
            self._collection = self.client.create_collection(
                self.index_name, OPENAI_EMBEDDING_DIM
            )

        return self._collection
