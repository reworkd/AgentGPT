import tiktoken

from reworkd_platform.services.tokenizer.service import TokenService

encoding = tiktoken.get_encoding("cl100k_base")


def test_happy_path():
    service = TokenService(encoding)
    text = "Hello world!"

    validate_tokenize_and_detokenize(service, text, 3)


def test_nothing():
    service = TokenService(encoding)
    text = ""

    validate_tokenize_and_detokenize(service, text, 0)


def validate_tokenize_and_detokenize(service, text, expected_token_count):
    tokens = service.tokenize(text)
    assert text == service.detokenize(tokens)
    assert len(tokens) == service.count(text)
    assert len(tokens) == expected_token_count
