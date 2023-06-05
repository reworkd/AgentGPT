from typing import TypeVar

from langchain import LLMChain, BasePromptTemplate
from langchain.schema import OutputParserException, BaseOutputParser
from openai import InvalidRequestError
from openai.error import ServiceUnavailableError, AuthenticationError

from reworkd_platform.schemas import ModelSettings
from reworkd_platform.web.api.agent.model_settings import create_model
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
    model_settings: ModelSettings, prompt: BasePromptTemplate, args: dict[str, str]
) -> str:
    try:
        model = create_model(model_settings)
        chain = LLMChain(llm=model, prompt=prompt)
        return await chain.arun(args)
    except ServiceUnavailableError as e:
        raise OpenAIError(
            e,
            "OpenAI is experiencing issues. Visit "
            "https://status.openai.com/ for more info.",
        )
    except InvalidRequestError as e:
        raise OpenAIError(e, e.user_message)
    except AuthenticationError as e:
        raise OpenAIError(
            e,
            "Authentication error: Ensure the correct API key and "
            "requesting organization are being used.",
        )
    except Exception as e:
        raise OpenAIError(e, "There was an issue getting a response from the AI model.")
