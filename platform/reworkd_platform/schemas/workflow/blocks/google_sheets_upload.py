from collections import defaultdict
import os
import tempfile
from typing import Any
from tabula.io import read_pdf
from langchain.chains.question_answering import load_qa_chain
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings
from llama_index.readers.schema.base import Document
from langchain.embeddings.base import Embeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
import pinecone
from loguru import logger
import re
import pandas as pd
from reworkd_platform.services.llama.llama import LlamaLoader

from reworkd_platform.schemas.agent import ModelSettings
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.services.aws.s3 import SimpleStorageService
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.model_factory import create_model


class GoogleSheetsUploadInput(BlockIOBase):
    sheet1_url: str
    sheet2_url: str


class GoogleSheetsUploadOutput(GoogleSheetsUploadInput):
    None


class GoogleSheetsUpload(Block):
    type = "GoogleSheetsUpload"
    description = "Upload Google Sheets"
    input: GoogleSheetsUploadInput

    async def run(self, workflow_id: str) -> BlockIOBase:
        urls = []
        sheet_ids = []
        self.input.sheet1_url
        if self.input.sheet1_url != "":
            urls.append(self.input.sheet1_url)
        if self.input.sheet1_url != "":
            urls.append(self.input.sheet1_url)

        try:
            sheet_ids = self.get_google_sheets_ids(urls)
            logger.info(f"sheet_ids: {sheet_ids}")
        except Exception as e:
            print("Error:", e)

        document_pool = self.load_sheets(sheet_ids)
        logger.info(f"document_pool: {document_pool}")

        return GoogleSheetsUploadOutput(**self.input.dict())

    def load_sheets(self, spreadsheet_ids: list[str]) -> list[Document]:
        loader = LlamaLoader()
        loader.load_google_sheets(spreadsheet_ids)
        return loader.document_pool

    def get_google_sheets_ids(self, urls: list[str]) -> list[str]:
        sheet_ids = []
        pattern = r"/d/([a-zA-Z0-9-_]+)"

        for url in urls:
            try:
                match = re.search(pattern, url)
                if match:
                    sheet_id = match.group(1)
                    sheet_ids.append(sheet_id)
                else:
                    raise Exception(f"Invalid Google Sheets URL: {url}")
            except Exception as e:
                print("Error:", e)

        return sheet_ids
