from typing import Any

import openai
from loguru import logger

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.settings import settings


class GenericLLMAgentInput(BlockIOBase):
    prompt: str


class GenericLLMAgentOutput(GenericLLMAgentInput):
    result: str


class GenericLLMAgent(Block):
    type = "GenericLLMAgent"
    description = "Extract key details from text using OpenAI"
    input: GenericLLMAgentInput

    async def run(self, workflow_id: str, **kwargs: Any) -> BlockIOBase:
        try:
            response = await execute_prompt(prompt=self.input.prompt)

        except Exception as err:
            logger.error(f"Failed to extract text with OpenAI: {err}")
            raise

        return GenericLLMAgentOutput(**self.input.dict(), result=response)


async def execute_prompt(prompt: str) -> str:
    openai.api_key = settings.openai_api_key

    response = await openai.ChatCompletion.acreate(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=1,
        max_tokens=500,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )

    response_message_content = response["choices"][0]["message"]["content"]
    logger.info(f"response = {response_message_content}")
    return response_message_content
