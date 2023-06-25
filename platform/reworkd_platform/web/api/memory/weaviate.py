from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple, cast

import numpy as np
import weaviate
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Weaviate
from loguru import logger
from weaviate import UnexpectedStatusCodeException

from reworkd_platform.settings import settings
from reworkd_platform.web.api.memory.memory import AgentMemory


def _default_schema(index_name: str, text_key: str) -> Dict[str, Any]:
    return {
        "class": index_name,
        "properties": [
            {
                "name": text_key,
                "dataType": ["text"],
            }
        ],
    }


CLASS_PREFIX = "Reworkd_AgentGPT_"


class WeaviateMemory(AgentMemory):
    """
    Wrapper around the Weaviate vector database
    """

    db: Optional[Weaviate] = None

    def __init__(self, index_name: str):
        self.index_name = CLASS_PREFIX + index_name
        self.text_key = "agent_memory"

    def __enter__(self) -> AgentMemory:
        # If the database requires authentication, retrieve the API key
        auth = (
            weaviate.auth.AuthApiKey(api_key=settings.vector_db_api_key)
            if settings.vector_db_api_key is not None
            and settings.vector_db_api_key != ""
            else None
        )
        self.client = weaviate.Client(settings.vector_db_url, auth_client_secret=auth)

        self._create_class()

        # Instantiate client with embedding provider
        self.embeddings = OpenAIEmbeddings(
            client=None,  # Meta private value but mypy will complain its missing
            openai_api_key=settings.openai_api_key,
        )

        self.db = Weaviate(
            self.client,
            self.index_name,
            self.text_key,
            embedding=self.embeddings,
            by_text=False,
        )

        return self

    def _create_class(self) -> None:
        # Create the schema if it doesn't already exist
        schema = _default_schema(self.index_name, self.text_key)
        if not self.client.schema.contains(schema):
            self.client.schema.create_class(schema)

    def __exit__(self, exc_type: Any, exc_value: Any, traceback: Any) -> None:
        self.client.__del__()

    def add_tasks(self, tasks: List[str]) -> List[str]:
        if self.db is None:
            raise Exception("WeaviateMemory not initialized")
        return self.db.add_texts(tasks)

    def get_similar_tasks(self, query: str, score_threshold: float = 0.98) -> List[str]:
        # Get similar tasks
        results = self._similarity_search_with_score(query)

        def get_score(result: Tuple[str, float]) -> float:
            return result[1]

        results.sort(key=get_score, reverse=True)

        # Return formatted response
        return [text for [text, score] in results if score >= score_threshold]

    def reset_class(self) -> None:
        try:
            self.client.schema.delete_class(self.index_name)
            self._create_class()
        except UnexpectedStatusCodeException as error:
            logger.error(error)

    def _similarity_search_with_score(
        self, query: str, k: int = 4
    ) -> List[Tuple[str, float]]:
        """
        A remake of _similarity_search_with_score from langchain to use a near vector
        """
        # Build query
        query_obj = self.client.query.get(self.index_name, [self.text_key])
        embedding = self.embeddings.embed_query(query)
        vector = {"vector": embedding}

        result = (
            query_obj.with_near_vector(vector)
            .with_limit(k)
            .with_additional("vector")
            .do()
        )

        if "errors" in result:
            raise ValueError(f"Error during query: {result['errors']}")

        docs_and_scores: list[tuple[str, float]] = []
        for res in result["data"]["Get"][self.index_name]:
            text = cast(str, res.pop(self.text_key))
            score = float(np.dot(res["_additional"]["vector"], embedding))
            docs_and_scores.append((text, score))
        return docs_and_scores
