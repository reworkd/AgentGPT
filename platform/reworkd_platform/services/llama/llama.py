from llama_index import download_loader

import os
from typing import Dict, List

from pydantic import BaseModel
from llama_index.readers.schema.base import Document

REGION = "us-east-1"


class PresignedPost(BaseModel):
    url: str
    fields: Dict[str, str]


class LlamaLoader:
    def __init__(self) -> None:
        self.document_pool: list[Document] = []

    def load_google_sheets(
        self,
        spreadsheet_ids: List[str],
    ) -> List[Document]:
        GoogleSheetsReader = download_loader("GoogleSheetsReader")
        loader = GoogleSheetsReader()
        loaded_documents = loader.load_data(spreadsheet_ids)
        self.document_pool.extend(loaded_documents)
        return loaded_documents
