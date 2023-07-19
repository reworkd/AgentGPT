import requests
from loguru import logger
from reworkd_platform.web.api.agent.model_settings import create_model
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.schemas.agent import ModelSettings
from langchain import LLMChain, PromptTemplate
from lanarky.responses import StreamingResponse

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class OpenAIWebhookInput(BlockIOBase):
    prompt: str


class OpenAIWebhookOutput(OpenAIWebhookInput):
    result: str


class OpenAIWebhook(Block):
    type = "OpenAIWebhook"
    description = "Extract key details from text using OpenAI"
    input: OpenAIWebhookInput

    async def run(self) -> BlockIOBase:
        logger.info(f"Starting {self.type}")

        try:
            response = await create_llm(self.input.prompt)
            logger.info(f"RESPONSE {response}")
        except Exception as err:
            logger.error(f"Failed to extract text with OpenAI: {err}")
            raise

        return OpenAIWebhookOutput(**self.input.dict(), result=response)

async def summarize_and_extract(prompt: str) -> str:
    llm = create_model(
        ModelSettings(), UserBase(id="", name=None, email="test@example.com"), streaming=False
    )
    template = """
    You are a chatbot assistant that assists users in summarizing information from given text.

    Question: {prompt}

    Answer:"""

    chain = LLMChain(
        llm=llm, prompt=PromptTemplate(template=template, input_variables=["prompt"])
    )

    result = await chain.arun(prompt)
    return result
