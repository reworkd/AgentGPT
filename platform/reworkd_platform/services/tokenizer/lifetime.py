import tiktoken
from fastapi import FastAPI

ENCODING_NAME = "cl100k_base"  # gpt-4, gpt-3.5-turbo, text-embedding-ada-002


async def init_tokenizer(app: FastAPI) -> None:  # pragma: no cover
    """
    Initialize tokenizer.

    TikToken downloads the encoding on start. It is then
    stored in the state of the application.

    :param app: current application.
    """
    app.state.token_encoding = tiktoken.get_encoding(ENCODING_NAME)
