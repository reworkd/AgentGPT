from io import BytesIO
from reworkd_platform.services.tokenizer.token_service import TokenService
import boto3
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
import boto3
import os
from reworkd_platform.web.api.agent.prompts import summarize_pdf_prompt
from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.settings import settings
from langchain.vectorstores import Pinecone
from langchain.chains.question_answering import load_qa_chain
import pinecone
from langchain.embeddings import OpenAIEmbeddings

# Llama Imports
import camelot
from llama_index import Document, ListIndex
from llama_index import SimpleDirectoryReader
from llama_index import VectorStoreIndex, ServiceContext, LLMPredictor
from llama_index.query_engine import PandasQueryEngine, RetrieverQueryEngine
from llama_index.retrievers import RecursiveRetriever
from llama_index.schema import IndexNode

from langchain.chat_models import ChatOpenAI
from llama_hub.file.pymu_pdf.base import PyMuPDFReader
from pathlib import Path
from typing import List


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
        test_llama()

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

def test_llama():
    download_file_from_s3("watches_and_jewelry.pdf")
    dir_path = "reworkd_platform/schemas/workflow/blocks/placeholder_workflow_id/"
    filepath = os.path.join(dir_path, "watches_and_jewelry.pdf")

    reader = SimpleDirectoryReader(
        input_files=[filepath]
    )

    docs = reader.load_data()
    logger.info(f"here's the docs - {docs}")
    logger.info(f"Loaded {len(docs)} docs")

    # reader = PyMuPDFReader()
    # docs = reader.load(Path(filepath))
    # table_dfs = get_tables(filepath, pages=[1,2,3,4,5,6,7,8,9,10])
    # logger.info(f"table_dfs - index 1 {table_dfs[0]}")
    # logger.info(f"table_dfs - index 2 {table_dfs[1]}")

def get_tables(path: str, pages: List[int]):
    table_dfs = []
    for page in pages:
        table_list = camelot.read_pdf(path, pages=str(page))
        table_df = table_list[0].df
        table_df = (
            table_df.rename(columns=table_df.iloc[0])
            .drop(table_df.index[0])
            .reset_index(drop=True)
        )
        table_dfs.append(table_df)
    return table_dfs

async def build_pinecone_docsearch(input_files: list[str]) -> Pinecone:
    download_all_files_from_s3(input_files)
    start_pinecone()
    embeddings = enter()
    docsearch = chunk_documents_to_pinecone(files=input_files, embeddings=embeddings)

    return docsearch


def start_pinecone() -> None:
    pinecone.init(
        api_key=settings.pinecone_api_key, environment=settings.pinecone_environment
    )


@timed_function(level="DEBUG")
def enter() -> Embeddings:
    embeddings: Embeddings = OpenAIEmbeddings(
        client=None,  # Meta private value but mypy will complain its missing
        openai_api_key=settings.openai_api_key,
    )

    return embeddings


def download_all_files_from_s3(files: list[str]) -> None:
    for file in files:
        download_file_from_s3(file)


def download_file_from_s3(filename: str) -> None:
    session = boto3.Session(profile_name="dev")
    REGION = "us-east-1"
    bucket_name = "test-pdf-123"
    s3_client = session.client("s3", region_name=REGION)
    directory = f"reworkd_platform/schemas/workflow/blocks/placeholder_workflow_id/"
    os.makedirs(directory, exist_ok=True)
    local_filename = os.path.join(directory, filename)
    s3_client.download_file(bucket_name, filename, local_filename)


def chunk_documents_to_pinecone(files: list[str], embeddings: Embeddings) -> Pinecone:
    index_name = "prod"
    dir_path = "reworkd_platform/schemas/workflow/blocks/placeholder_workflow_id/"
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
    texts = []

    for file in files:
        filepath = os.path.join(dir_path, file)
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
    logger.info(f"chain result {result}")
    return result


async def summarize_and_extract(prompt: str, text: str) -> str:
    max_tokens = TokenService.create().get_completion_space(
        "gpt-3.5-turbo-16k",
        summarize_pdf_prompt.format_prompt(
            query=prompt, text=text, language="English"
        ).to_string(),
    )

    llm = create_model(
        ModelSettings(model="gpt-3.5-turbo-16k", max_tokens=max_tokens),
        UserBase(id="", name=None, email="test@example.com"),
        streaming=False,
    )

    chain = LLMChain(llm=llm, prompt=summarize_pdf_prompt)
    result = await chain.arun(query=prompt, language="English", text=text)
    return result


def fetch_file_from_s3(filename: str) -> BytesIO:
    session = boto3.Session(profile_name="dev")
    REGION = "us-east-1"
    bucket_name = "test-pdf-123"
    s3_client = session.client("s3", region_name=REGION)
    response = s3_client.get_object(Bucket=bucket_name, Key=filename)
    response_body = response["Body"].read()
    bytesIO_file = BytesIO(response_body)

    return bytesIO_file