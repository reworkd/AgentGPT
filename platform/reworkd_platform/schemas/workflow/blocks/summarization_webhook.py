from io import BytesIO
from reworkd_platform.services.tokenizer.token_service import TokenService
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings.base import Embeddings
import requests
from reworkd_platform.timer import timed_function
from loguru import logger
from reworkd_platform.web.api.agent.model_settings import create_model
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.schemas.agent import ModelSettings
from langchain import LLMChain, PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from lanarky.responses import StreamingResponse
from io import BytesIO
import os
from reworkd_platform.web.api.agent.prompts import summarize_pdf_prompt
from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.settings import settings
from langchain.vectorstores import Pinecone
from langchain.chains.question_answering import load_qa_chain
import pinecone
from langchain.embeddings import OpenAIEmbeddings
import tempfile
from reworkd_platform.services.aws.s3 import SimpleStorageService


class SummaryWebhookInput(BlockIOBase):
    prompt: str
    filename1: str
    filename2: str


class SummaryWebhookOutput(SummaryWebhookInput):
    result: str


class SummaryWebhook(Block):
    type = "SummaryWebhook"
    description = "Extract key details from text using OpenAI"
    input: SummaryWebhookInput

    async def run(self) -> BlockIOBase:
        try:
            input_files = [self.input.filename1, self.input.filename2]
            docsearch = await build_pinecone_docsearch(input_files)

            response = await execute_query_on_pinecone(
                prompt=self.input.prompt, docsearch=docsearch
            )

        except Exception as err:
            logger.error(f"Failed to extract text with OpenAI: {err}")
            raise

        return SummaryWebhookOutput(**self.input.dict(), result=response)


async def build_pinecone_docsearch(input_files: list[str]) -> Pinecone:
    temp_dir = download_all_files_from_s3(input_files)
    start_pinecone()
    embeddings = enter()
    docsearch = chunk_documents_to_pinecone(
        files=input_files, embeddings=embeddings, temp_dir=temp_dir
    )

    return docsearch


def start_pinecone() -> None:
    pinecone.init(
        api_key=settings.pinecone_api_key, environment=settings.pinecone_environment
    )


def enter() -> Embeddings:
    embeddings: Embeddings = OpenAIEmbeddings(
        client=None,  # Meta private value but mypy will complain its missing
        openai_api_key=settings.openai_api_key,
    )

    return embeddings


def download_all_files_from_s3(files: list[str]) -> tempfile.TemporaryDirectory[str]:
    temp_dir = tempfile.TemporaryDirectory()
    s3_service = SimpleStorageService()
    for file in files:
        download_file_from_s3(file, temp_dir, s3_service)

    return temp_dir


def download_file_from_s3(
    filename: str,
    temp_dir: tempfile.TemporaryDirectory[str],
    s3_service: SimpleStorageService,
) -> None:
    bucket_name = "test-pdf-123"
    local_filename = os.path.join(temp_dir.name, filename)
    s3_service.download_file(bucket_name, filename, local_filename)


def chunk_documents_to_pinecone(
    files: list[str], embeddings: Embeddings, temp_dir: tempfile.TemporaryDirectory[str]
) -> Pinecone:
    index_name = "prod"
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
    texts = []
    for file in files:
        filepath = os.path.join(temp_dir.name, file)
        pdf_data = PyPDFLoader(filepath).load()
        texts.extend(text_splitter.split_documents(pdf_data))

    docsearch = Pinecone.from_texts(
        [t.page_content for t in texts], embeddings, index_name=index_name
    )

    return docsearch


async def execute_query_on_pinecone(prompt: str, docsearch: Pinecone) -> str:
    docs = docsearch.similarity_search(prompt)

    max_tokens = TokenService.create().get_completion_space("gpt-3.5-turbo-16k", prompt)

    llm = create_model(
        ModelSettings(model="gpt-3.5-turbo-16k", max_tokens=5000),
        UserBase(id="", name=None, email="test@example.com"),
        streaming=False,
    )

    chain = load_qa_chain(llm)
    result = await chain.arun(input_documents=docs, question=prompt)
    return result
