import os
import tempfile
from typing import List, Tuple

import pinecone
from langchain.chains.question_answering import load_qa_chain
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.embeddings.base import Embeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
from loguru import logger

from reworkd_platform.os import get_all_files
from reworkd_platform.schemas.agent import ModelSettings
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.services.aws.s3 import SimpleStorageService
from reworkd_platform.services.tokenizer.token_service import TokenService
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.model_settings import create_model


class SummaryWebhookInput(BlockIOBase):
    prompt: str
    # filename1: str
    # filename2: str


class SummaryWebhookOutput(SummaryWebhookInput):
    result: str


class SummaryWebhook(Block):
    type = "SummaryWebhook"
    description = "Extract key details from text using OpenAI"
    input: SummaryWebhookInput

    async def run(self) -> BlockIOBase:
        try:
            s3_folder = "f5957ef2-fca6-449a-9545-8e62b67116d6"
            docsearch = await build_pinecone_docsearch(s3_folder)

            response = await execute_query_on_pinecone(
                prompt=self.input.prompt, docsearch=docsearch
            )

        except Exception as err:
            logger.error(f"Failed to extract text with OpenAI: {err}")
            raise

        return SummaryWebhookOutput(**self.input.dict(), result=response)


async def build_pinecone_docsearch(s3_folder: str) -> Pinecone:
    temp_dir, file_paths = download_all_files_from_s3(s3_folder)
    start_pinecone()
    embeddings1: Embeddings = OpenAIEmbeddings(
        client=None,  # Meta private value but mypy will complain its missing
        openai_api_key=settings.openai_api_key,
    )
    embeddings = embeddings1
    docsearch = chunk_documents_to_pinecone(
        embeddings=embeddings, temp_dir=str(temp_dir)
    )

    return docsearch


def start_pinecone() -> None:
    pinecone.init(
        api_key=settings.pinecone_api_key, environment=settings.pinecone_environment
    )


def download_all_files_from_s3(
    s3_folder: str,
) -> Tuple[tempfile.TemporaryDirectory[str], List[str]]:
    temp_dir = tempfile.TemporaryDirectory()
    s3_service = SimpleStorageService()

    file_paths = []
    for file in s3_service.list_files(bucket_name="test-pdf-123", prefix=s3_folder):
        file_paths.append(download_file_from_s3(file, temp_dir, s3_service))

    return temp_dir, file_paths


def download_file_from_s3(
    filename: str,
    temp_dir: tempfile.TemporaryDirectory[str],
    s3_service: SimpleStorageService,
) -> None:
    bucket_name = "test-pdf-123"
    local_file_path = os.path.join(temp_dir.name, filename.split("/")[-1])
    s3_service.download_file(bucket_name, filename, local_file_path)


def chunk_documents_to_pinecone(
    embeddings: Embeddings,
    temp_dir: str,
) -> Pinecone:
    index_name = "prod"
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)

    texts = []
    for file in get_all_files(temp_dir):
        # filepath = os.path.join(temp_dir.name, file)
        pdf_data = PyPDFLoader(file).load()
        texts.extend(text_splitter.split_documents(pdf_data))

    docsearch = Pinecone.from_texts(
        [t.page_content for t in texts], embeddings, index_name=index_name
    )

    return docsearch


async def execute_query_on_pinecone(prompt: str, docsearch: Pinecone) -> str:
    docs = docsearch.similarity_search(prompt)
    max_tokens = TokenService.create().get_completion_space("gpt-3.5-turbo-16k", prompt)

    llm = create_model(
        ModelSettings(model="gpt-3.5-turbo-16k", max_tokens=max_tokens),
        UserBase(id="", name=None, email="test@example.com"),
        streaming=False,
    )

    chain = load_qa_chain(llm)
    result = await chain.arun(input_documents=docs, question=prompt)
    return result
