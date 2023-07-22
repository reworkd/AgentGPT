from unittest.mock import Mock

import tiktoken

from reworkd_platform.schemas.agent import LLM_MODEL_MAX_TOKENS
from reworkd_platform.services.tokenizer.token_service import TokenService

encoding = tiktoken.get_encoding("cl100k_base")


def test_happy_path() -> None:
    service = TokenService(encoding)
    text = "Hello world!"
    validate_tokenize_and_detokenize(service, text, 3)


def test_nothing() -> None:
    service = TokenService(encoding)
    text = ""
    validate_tokenize_and_detokenize(service, text, 0)


def validate_tokenize_and_detokenize(
    service: TokenService, text: str, expected_token_count: int
) -> None:
    tokens = service.tokenize(text)
    assert text == service.detokenize(tokens)
    assert len(tokens) == service.count(text)
    assert len(tokens) == expected_token_count


def test_calculate_max_tokens_with_small_max_tokens() -> None:
    initial_max_tokens = 3000
    service = TokenService(encoding)
    model = Mock(spec=["model_name", "max_tokens"])
    model.model_name = "gpt-3.5-turbo"
    model.max_tokens = initial_max_tokens

    service.calculate_max_tokens(model, "Hello")

    assert model.max_tokens == initial_max_tokens


def test_calculate_max_tokens_with_high_completion_tokens() -> None:
    service = TokenService(encoding)
    prompt_tokens = service.count(LONG_TEXT)
    model = Mock(spec=["model_name", "max_tokens"])
    model.model_name = "gpt-3.5-turbo"
    model.max_tokens = 8000

    service.calculate_max_tokens(model, LONG_TEXT)

    assert model.max_tokens == (
        LLM_MODEL_MAX_TOKENS.get("gpt-3.5-turbo") - prompt_tokens
    )


def test_calculate_max_tokens_with_negative_result() -> None:
    service = TokenService(encoding)
    model = Mock(spec=["model_name", "max_tokens"])
    model.model_name = "gpt-3.5-turbo"
    model.max_tokens = 8000

    service.calculate_max_tokens(model, *([LONG_TEXT] * 100))

    # We use the minimum length of 1
    assert model.max_tokens == 1


LONG_TEXT = """
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
This is some long text. This is some long text. This is some long text.
"""
