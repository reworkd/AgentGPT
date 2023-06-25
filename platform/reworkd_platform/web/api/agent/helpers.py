from typing import Any, Callable, TypeVar

from langchain import BasePromptTemplate, LLMChain
from langchain.chat_models.base import BaseChatModel
from langchain.schema import BaseOutputParser, OutputParserException
from openai import InvalidRequestError
from openai.error import AuthenticationError, RateLimitError, ServiceUnavailableError

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
    func: Callable[..., Any], *args: Any, **kwargs: Any
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
                f"Your API key does not have access to your current model. Please use a different model.",
            )
        raise OpenAIError(e, e.user_message)
    except AuthenticationError as e:
        raise OpenAIError(
            e,
            "Authentication error: Ensure a valid API key is being used.",
        )
    except RateLimitError as e:
        if e.user_message.startswith("You exceeded your current quota"):
            raise OpenAIError(
                e,
                f"Your API key exceeded your current quota, please check your plan and billing details.",
            )
        raise OpenAIError(e, e.user_message)
    except Exception as e:
        raise OpenAIError(
            e, "There was an unexpected issue getting a response from the AI model."
        )


async def call_model_with_handling(
    model: BaseChatModel,
    prompt: BasePromptTemplate,
    args: dict[str, str],
) -> str:
    chain = LLMChain(llm=model, prompt=prompt)
    return await openai_error_handler(chain.arun, args)
