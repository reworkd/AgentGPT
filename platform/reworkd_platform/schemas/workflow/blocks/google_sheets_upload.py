from collections import defaultdict
import os
import tempfile
from typing import Any
from tabula.io import read_pdf
from langchain.chains.question_answering import load_qa_chain
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.docstore.document import Document
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
from reworkd_platform.web.api.agent.model_settings import create_model


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

        logger.info(f"url list: {urls}")
        logger.info(f"type of url list: {type(urls)}")
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

    def get_google_sheets_ids(self,urls):
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
    
    def chunk_documents_to_pinecone(
        self, files: list[str], embeddings: Embeddings, path: str
    ) -> Pinecone:
        index_name = "prod"
        index = pinecone.Index(index_name)
        index.delete(delete_all=True)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)

        texts = []
        for file in files:
            filepath = os.path.join(path, file)
            # table_data = self.read_and_preprocess_tables(filepath)
            pdf_data = self.load_pdf(filepath)
            texts.extend(text_splitter.split_documents(pdf_data))
            # texts.extend(text_splitter.create_documents(table_data))

        docsearch = Pinecone.from_documents(
            [t for t in texts],
            embeddings,
            index_name=index_name,
        )

        return docsearch

    async def execute_query_on_pinecone(
        self, company_context: str, docsearch: Pinecone
    ) -> str:
        docs = docsearch.similarity_search(company_context, k=7)
        relevant_table_metadata = defaultdict(list)
        for doc in docs:
            doc_source = doc.metadata["source"]
            page_number = int(doc.metadata["page"])
            relevant_table_metadata[doc_source].append(page_number)

        processed_tables = self.read_and_preprocess_tables(relevant_table_metadata)

        prompt = f"""Help extract information relevant to a company with the following details: {company_context} from the following documents. Start with the company background info. Then, include information relevant to the market, strategies, and products. Here are the documents: {docs}. After each point, reference the source you got the information from.

        Also list any interesting quantitative metrics or trends based on the following tables: {processed_tables}. Include which table you got information from.

        Cite sources for sentences using the page number from original source document. Do not list sources at the end of the writing.

        Example: "This is a cited sentence. (Source: Luxury Watch Market Size Report, Page 17).

        Format your response as slack markdown.
        """

        llm = create_model(
            ModelSettings(model="gpt-3.5-turbo-16k", max_tokens=2000),
            UserBase(id="", name=None, email="test@example.com"),
            streaming=False,
        )

        return await load_qa_chain(llm).arun(input_documents=docs, question=prompt)
