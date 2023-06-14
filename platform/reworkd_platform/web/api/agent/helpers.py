from typing import Any, Callable, TypeVar

from langchain import BasePromptTemplate, LLMChain
from langchain.schema import BaseOutputParser, OutputParserException
from openai import InvalidRequestError
from openai.error import AuthenticationError, ServiceUnavailableError

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


async def openai_error_handler(
    model_settings: ModelSettings, func: Callable[..., Any], *args: Any, **kwargs: Any
) -> Any:
    try:
        return await func(*args, **kwargs)
    except ServiceUnavailableError as e:
        raise OpenAIError(
            e,
            "OpenAI is experiencing issues. Visit "
            "https://status.openai.com/ for more info.",
        )
    except InvalidRequestError as e:
        if e.user_message.startswith("The model:"):
            raise OpenAIError(
                e,
                f"Your API key does not have access to '{model_settings.model}'. Please use a different model.",
            )
        raise OpenAIError(e, e.user_message)
    except AuthenticationError as e:
        raise OpenAIError(
            e,
            "Authentication error: Ensure the correct API key and "
            "requesting organization are being used.",
        )
    except Exception as e:
        raise OpenAIError(e, "There was an issue getting a response from the AI model.")


async def call_model_with_handling(
    model_settings: ModelSettings,
    prompt: BasePromptTemplate,
    args: dict[str, str],
) -> str:
    model = create_model(model_settings)
    chain = LLMChain(llm=model, prompt=prompt)
    return await openai_error_handler(model_settings, chain.arun, args)
