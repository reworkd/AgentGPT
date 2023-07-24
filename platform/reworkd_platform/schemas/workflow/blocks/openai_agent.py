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
from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.settings import settings
from langchain.vectorstores import Pinecone
from langchain.chains.question_answering import load_qa_chain
import pinecone
from langchain.embeddings import OpenAIEmbeddings
import tempfile
from reworkd_platform.services.aws.s3 import SimpleStorageService
import openai
from reworkd_platform.settings import settings


class OpenAIContextAgentInput(BlockIOBase):
    company_name: str


class OpenAIContextAgentOutput(OpenAIContextAgentInput):
    result: str


class OpenAIContextAgent(Block):
    type = "OpenAIAgent"
    description = "Extract key details from text using OpenAI"
    input: OpenAIContextAgentInput

    async def run(self) -> BlockIOBase:
        try:
            response = await execute_prompt(company=self.input.company_name)
            logger.info(f"OpenAI response: {response}")

        except Exception as err:
            logger.error(f"Failed to extract text with OpenAI: {err}")
            raise

        return OpenAIContextAgentOutput(**self.input.dict(), result=response)


async def execute_prompt(company: str) -> str:
    openai.api_key = settings.openai_api_key
    logger.info(f"company: {company}")

    prompt = f"""
    Write a one-sentence description of "{company}".
    Define their market, sector, and primary products.
    
    Be as clear, informative, and descriptive as necessary.
    You will not make up information or add any information outside of the above text. 
    Only use the given information and nothing more.
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=1,
        max_tokens=500,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )

    response_message_content = response["choices"][0]["message"]["content"]

    return response_message_content
