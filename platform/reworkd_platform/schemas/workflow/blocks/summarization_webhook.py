import requests
from loguru import logger
from reworkd_platform.web.api.agent.model_settings import create_model
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.schemas.agent import ModelSettings
from langchain import LLMChain, PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from lanarky.responses import StreamingResponse
from io import BytesIO
from langchain.document_loaders import PyPDFLoader
import boto3
import os
from reworkd_platform.web.api.agent.prompts import summarize_pdf_prompt
from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
import PyPDF2 as pypdf
from reworkd_platform.settings import settings
from langchain.vectorstores import Pinecone
from langchain.chains.question_answering import load_qa_chain
import pinecone
from langchain.embeddings import OpenAIEmbeddings

class SummaryWebhookInput(BlockIOBase):
    prompt: str
    filename: str


class SummaryWebhookOutput(SummaryWebhookInput):
    result: str


class SummaryWebhook(Block):
    type = "SummaryWebhook"
    description = "Extract key details from text using OpenAI"
    input: SummaryWebhookInput

    async def run(self) -> BlockIOBase:
        logger.info(f"Starting {self.type}")

        # bytesIOfile = fetch_file(self.input.filename)
        # extracted_text = convert_pdf_to_string(bytesIOfile)
        download_file(self.input.filename)
        # pdf_text = chunk_pdf_to_pinecone(filepath="reworkd_platform/schemas/workflow/blocks/placeholder_workflow_id/downloaded_file.pdf")

        try:
            response = await chunk_pdf_to_pinecone(filepath="reworkd_platform/schemas/workflow/blocks/placeholder_workflow_id/downloaded_file.pdf",prompt=self.input.prompt)
            # response = await summarize_and_extract(self.input.prompt, pdf_text)
            logger.info(f"RESPONSE {response}")
        except Exception as err:
            logger.error(f"Failed to extract text with OpenAI: {err}")
            raise

        return SummaryWebhookOutput(**self.input.dict(), result=response)


def fetch_file(filename: str) -> BytesIO:
    session = boto3.Session(profile_name="dev")
    REGION = "us-east-1"
    bucket_name = "test-pdf-123"
    s3_client = session.client("s3", region_name=REGION)
    response = s3_client.get_object(Bucket=bucket_name, Key=filename)
    response_body = response["Body"].read()
    bytesIO_file = BytesIO(response_body)

    return bytesIO_file

def download_file(filename: str):
    session = boto3.Session(profile_name="dev")
    REGION = "us-east-1"
    bucket_name = "test-pdf-123"
    s3_client = session.client("s3", region_name=REGION)
    directory = "reworkd_platform/schemas/workflow/blocks/placeholder_workflow_id"
    os.makedirs(directory, exist_ok=True)
    local_filename = os.path.join(directory, "downloaded_file.pdf")
    s3_client.download_file(bucket_name, filename, local_filename)

def convert_pdf_to_string(bytesIO_file: BytesIO) -> list[str]:
    pdf_reader = pypdf.PdfReader(bytesIO_file)
    extracted_text = []

    for page in pdf_reader.pages:
        page_text = page.extract_text()
        extracted_text.append(page_text)

    return extracted_text

async def chunk_pdf_to_pinecone(filepath: str, prompt: str) -> str:
    pdf_data = PyPDFLoader(filepath).load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
    texts = text_splitter.split_documents(pdf_data)

    pinecone.init(
            api_key=settings.pinecone_api_key,
            environment=settings.pinecone_environment,
        )

    index_name = "prod"

    embeddings = OpenAIEmbeddings(
            client=None,  # Meta private value but mypy will complain its missing
            openai_api_key=settings.openai_api_key,
        )

    docsearch = Pinecone.from_texts([t.page_content for t in texts], embeddings, index_name=index_name)
    # with PineconeMemory(index_name='prod') as memory:
    #     memory.add_tasks(tasks)
    #     memory.__enter__()
    #     logger.info(f"tasks added to pinecone memory {tasks}")
    #     similar_tasks = memory.get_similar_tasks(query,score_threshold=0.95)
    #     logger.info(f"similar tasks {similar_tasks}")

    docs = docsearch.similarity_search(prompt)
    logger.info(f"similar docs {docs}")

    llm = create_model(
        ModelSettings(model="gpt-3.5-turbo-16k", max_tokens=5000),
        UserBase(id="", name=None, email="test@example.com"),
        streaming=False,
    )

    chain = load_qa_chain(llm)
    result = await chain.arun(input_documents=docs, question=prompt)
    return result

async def summarize_and_extract(prompt: str, text: str) -> str:
    llm = create_model(
        ModelSettings(model="gpt-3.5-turbo-16k", max_tokens=5000),
        UserBase(id="", name=None, email="test@example.com"),
        streaming=False,
    )

    chain = LLMChain(llm=llm, prompt=summarize_pdf_prompt)
    result = await chain.arun(query=prompt, language="English", text=text)
    return result