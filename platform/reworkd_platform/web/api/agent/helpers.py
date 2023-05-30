from typing import TypeVar

from langchain import LLMChain
from langchain.schema import OutputParserException, BaseOutputParser

from reworkd_platform.web.api.agent.model_settings import create_model, ModelSettings
from reworkd_platform.web.api.errors import OpenAIError

T = TypeVar("T")


def parse_with_handling(parser: BaseOutputParser[T], completion: str) -> T:
    try:
        return parser.parse(completion)
    except OutputParserException as e:
        raise OpenAIError(
            e, "There was an issue parsing the response from the AI model."
        )


async def call_model_with_handling(
    model_settings: ModelSettings, prompt: str, args: dict
) -> str:
    try:
        model = create_model(model_settings)
        chain = LLMChain(llm=model, prompt=prompt)
        return await chain.arun(args)
    except Exception as e:
        raise OpenAIError(
            e, "There was an issue getting a response from the AI model."
        )
