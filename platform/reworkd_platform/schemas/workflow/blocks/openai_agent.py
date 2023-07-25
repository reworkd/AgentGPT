from io import BytesIO
from reworkd_platform.services.tokenizer.token_service import TokenService
import requests
from reworkd_platform.timer import timed_function
from loguru import logger
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.schemas.agent import ModelSettings
from io import BytesIO
import os
from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.settings import settings
import openai


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

        except Exception as err:
            logger.error(f"Failed to extract text with OpenAI: {err}")
            raise

        return OpenAIContextAgentOutput(**self.input.dict(), result=response)


async def execute_prompt(company: str) -> str:
    openai.api_key = settings.openai_api_key

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
