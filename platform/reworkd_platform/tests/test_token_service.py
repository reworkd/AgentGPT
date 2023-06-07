import tiktoken

from reworkd_platform.services.tiktoken.service import TokenService
from reworkd_platform.web.api.agent.prompts import start_goal_prompt

encoding = tiktoken.get_encoding("cl100k_base")


def test_happy_path():
    service = TokenService(encoding)
    text = "Hello world!"

    validate_tokenize_and_detokenize(service, text, 3)


def test_nothing():
    service = TokenService(encoding)
    text = ""

    validate_tokenize_and_detokenize(service, text, 0)


def test_prompt_token_count():
    service = TokenService(encoding)

    assert (
        service.prompt_token_count(
            start_goal_prompt, goal="Write a story about AgentGPT", language="English"
        )
        > 100
    )


def test_context_space():
    prompt = "Write a book based on the context below:"
    max_tokens = 800

    service = TokenService(encoding)
    context_tokens = service.get_context_space(prompt, max_tokens, 500)
    assert 100 < context_tokens < (800 - 500)


def test_prompt_context_space():
    max_tokens = 800

    service = TokenService(encoding)
    context_tokens = service.get_prompt_context_space(
        start_goal_prompt,
        max_tokens,
        500,
        language="English",
        goal="Write a story about AgentGPT",
    )
    assert 100 < context_tokens < (800 - 500)


def validate_tokenize_and_detokenize(service, text, expected_token_count):
    tokens = service.tokenize(text)
    assert text == service.detokenize(tokens)
    assert len(tokens) == service.token_count(text)
    assert len(tokens) == expected_token_count
