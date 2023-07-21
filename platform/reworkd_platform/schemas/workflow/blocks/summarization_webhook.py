import requests
from loguru import logger
from reworkd_platform.web.api.agent.model_settings import create_model
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.schemas.agent import ModelSettings
from langchain import LLMChain, PromptTemplate
from langchain.document_loaders import UnstructuredPDFLoader
from lanarky.responses import StreamingResponse
from io import BytesIO
import PyPDF2 as pypdf
import boto3
import os

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase

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

        # write code to take s3_presigned_url, fetch pdf and convert to text
        # then pass that text to the summarize_and_extract function
        response = fetch_file(self.input.filename)
        pdf_text = convert_pdf_to_string(response)

        try:
            response = await summarize_and_extract(self.input.prompt, pdf_text)
            logger.info(f"RESPONSE {response}")
        except Exception as err:
            logger.error(f"Failed to extract text with OpenAI: {err}")
            raise

        return SummaryWebhookOutput(**self.input.dict(), result=response)

def fetch_file(filename):
    session = boto3.Session(profile_name="dev")
    REGION = 'us-east-1'
    bucket_name = 'test-pdf-123'
    s3_client = session.client("s3", region_name=REGION)
    response = s3_client.get_object(Bucket=bucket_name, Key=filename)
    response_body = response['Body'].read()
    bytesIO_file = BytesIO(response_body)

    return bytesIO_file

def convert_pdf_to_string(bytesIO_file):
    pdf_reader = pypdf.PdfReader(bytesIO_file)
    extracted_text = ""

    # Iterate over each page in the PDF
    for page_num in range(len(pdf_reader.pages)):
        # Get the current page
        page = pdf_reader.pages[page_num]

        # Extract the text from the page
        page_text = page.extract_text()

        # Append the extracted text to the overall string
        extracted_text += page_text

    return extracted_text

async def summarize_and_extract(prompt: str, text: str) -> str:
    llm = create_model(
        ModelSettings(model="gpt-3.5-turbo-16k", max_tokens=5000),
        UserBase(id="", name=None, email="test@example.com"),
        streaming=False,
    )
    template = """
    You are a chatbot assistant that assists users in summarizing and extracting information from given text.

    Question: {prompt}. Here is the text: {text}

    Answer:"""

    lang_prompt = PromptTemplate(template=template, input_variables={'prompt', 'text'})
    chain = LLMChain(llm=llm, prompt=lang_prompt)

    result = await chain.arun(prompt=prompt,text=text)
    return result