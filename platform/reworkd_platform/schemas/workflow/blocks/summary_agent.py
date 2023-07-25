import os
import tempfile
from typing import List

import pinecone
from langchain.chains.question_answering import load_qa_chain
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.embeddings.base import Embeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
from loguru import logger

from reworkd_platform.schemas.agent import ModelSettings
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.services.aws.s3 import SimpleStorageService
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.model_settings import create_model


class SummaryAgentInput(BlockIOBase):
    company_context: str
    filename1: str
    filename2: str


class SummaryAgentOutput(SummaryAgentInput):
    result: str


class SummaryAgent(Block):
    type = "SummaryAgent"
    description = "Extract key details from text using OpenAI"
    input: SummaryAgentInput

    async def run(self, workflow_id: str) -> BlockIOBase:
        try:
            input_files = ["market_report.pdf"]

            with tempfile.TemporaryDirectory() as temp_dir:
                self.download_all_files_from_s3(input_files, temp_dir)

                docsearch = self.chunk_documents_to_pinecone(
                    files=input_files,
                    embeddings=(
                        OpenAIEmbeddings(
                            client=None,
                            # Meta private value but mypy will complain its missing
                            openai_api_key=settings.openai_api_key,
                        )
                    ),
                    path=temp_dir,
                )

            response = await self.execute_query_on_pinecone(
                company_context=self.input.company_context, docsearch=docsearch
            )

        except Exception as err:
            logger.error(f"Failed to extract text with OpenAI: {err}")
            raise

        return SummaryAgentOutput(**self.input.dict(), result=response)

    def download_all_files_from_s3(self, files: List[str], path: str) -> None:
        s3_service = SimpleStorageService()
        for file in files:
            bucket_name = "test-pdf-123"
            local_filename = os.path.join(path, file)
            s3_service.download_file(bucket_name, file, local_filename)

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
            pdf_data = PyPDFLoader(filepath).load()
            texts.extend(text_splitter.split_documents(pdf_data))

        docsearch = Pinecone.from_texts(
            [t.page_content for t in texts], embeddings, index_name=index_name
        )

        return docsearch

    async def execute_query_on_pinecone(
        self, company_context: str, docsearch: Pinecone
    ) -> str:
        docs = docsearch.similarity_search(company_context, k=7)

        prompt = f"""
        Help extract information relevant to a company with the following details: {company_context} from the following documents. Include information relevant to the market, strategies, and products. Here are the documents: {docs}. After each point, reference the source you got each piece of information from (cite the source). If there's multiple sources, include information from all sources.
        """

        llm = create_model(
            ModelSettings(model="gpt-3.5-turbo-16k", max_tokens=10000),
            UserBase(id="", name=None, email="test@example.com"),
            streaming=False,
        )

        return await load_qa_chain(llm).arun(input_documents=docs, question=prompt)
