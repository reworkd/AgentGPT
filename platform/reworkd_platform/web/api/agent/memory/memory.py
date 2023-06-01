from abc import ABC
from typing import List, Tuple

import weaviate
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Weaviate

from reworkd_platform.settings import settings

SimilarText = List[Tuple[str, float]]


# Base class for AgentMemory
# Ensure we use __enter__ and __exit__ so that connections are closed
class AgentMemory(ABC):
    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc_value, traceback) -> None:
        pass

    def add_task(self, task: str, result: str) -> None:
        pass

    def get_similar_tasks(
        self, query: str, similarity_threshold: float = 0.7
    ) -> SimilarText:
        pass


class WeaviateMemory(AgentMemory):
    db: Weaviate = None

    def __init__(self, index_name: str):
        self.index_name = index_name
        self.text_key = "agentGPT_Tasks"
        self.client = weaviate.Client(settings.vector_db_url)

    def __enter__(self):
        self.db = Weaviate(
            self.client,
            self.index_name,
            self.text_key,
            embedding=OpenAIEmbeddings(openai_api_key=settings.openai_api_key),
            by_text=False,
        )
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.client.__del__()

    def add_task(self, task: str, result: str) -> None:
        self.db.add_texts([task], [{"result": result}])

    def get_similar_tasks(
        self, query: str, similarity_threshold: float = 0.7
    ) -> SimilarText:
        # Get similar tasks
        results = self.db.similarity_search_with_score(query)

        # Sort by score
        results.sort(key=lambda x: x[1], reverse=True)

        # Return
        return [
            (text.page_content, score)
            for [text, score] in results
            if score > similarity_threshold
        ]
