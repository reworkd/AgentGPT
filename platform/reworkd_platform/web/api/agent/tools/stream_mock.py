import asyncio
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse

app = FastAPI()


def stream_string(data: str, delayed: bool = False) -> FastAPIStreamingResponse:
    return FastAPIStreamingResponse(
        stream_generator(data, delayed),
    )


async def stream_generator(data: str, delayed: bool) -> AsyncGenerator[bytes, None]:
    if delayed:
        for c in data:
            yield c.encode()
            await asyncio.sleep(0.03)  # simulate slow processing
    else:
        yield data.encode()
