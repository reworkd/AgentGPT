import openai
from loguru import logger

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.settings import settings


class GenericLLMAgentInput(BlockIOBase):
    query: str


class GenericLLMAgentOutput(GenericLLMAgentInput):
    result: str


class GenericLLMAgent(Block):
    type = "OpenAIAgent"
    description = "Extract key details from text using OpenAI"
    input: GenericLLMAgentInput

    async def run(self, workflow_id: str) -> BlockIOBase:
        try:
            response = await execute_prompt(query=self.input.query)

        except Exception as err:
            logger.error(f"Failed to extract text with OpenAI: {err}")
            raise

        return GenericLLMAgentOutput(**self.input.dict(), result=response)


async def execute_prompt(query: str) -> str:
    openai.api_key = settings.openai_api_key

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": query}],
        temperature=1,
        max_tokens=500,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )

    response_message_content = response["choices"][0]["message"]["content"]

    return response_message_content
