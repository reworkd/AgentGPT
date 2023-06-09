from typing import List

from fastapi import APIRouter
from pydantic import BaseModel

from reworkd_platform.web.api.memory.weaviate import WeaviateMemory

router = APIRouter()


class MemoryAdd(BaseModel):
    class_name: str
    tasks: List[str]


@router.post("/memory/add")
def add_task_memory(req_body: MemoryAdd) -> List[str]:
    with WeaviateMemory(req_body.class_name) as memory:
        ids = memory.add_tasks(req_body.tasks)
    return ids


@router.get("/memory/get")
def get_task_memory(
    class_name: str, query: str, score_threshold: float = 0.7
) -> List[str]:
    with WeaviateMemory(class_name) as memory:
        similar_tasks = memory.get_similar_tasks(query, score_threshold)
    return similar_tasks


@router.delete("/memory/delete")
def delete_class(class_name: str) -> None:
    with WeaviateMemory(class_name) as memory:
        memory.reset_class()
