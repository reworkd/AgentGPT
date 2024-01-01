import asyncio
from typing import AsyncGenerator

import tiktoken
from fastapi import FastAPI
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse

app = FastAPI()


def stream_string(data: str, delayed: bool = False) -> FastAPIStreamingResponse:
    return FastAPIStreamingResponse(
        stream_generator(data, delayed),
    )


async def stream_generator(data: str, delayed: bool) -> AsyncGenerator[bytes, None]:
    if delayed:
        encoding = tiktoken.get_encoding("cl100k_base")
        token_data = encoding.encode(data)

        for token in token_data:
            yield encoding.decode([token]).encode("utf-8")
            await asyncio.sleep(0.025)  # simulate slow processing
    else:
        yield data.encode()
