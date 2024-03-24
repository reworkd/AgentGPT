from fastapi import Request
from fastapi.responses import JSONResponse
from loguru import logger

from reworkd_platform.web.api.errors import PlatformaticError


async def platformatic_exception_handler(
    _: Request,
    platform_exception: PlatformaticError,
) -> JSONResponse:
    if platform_exception.should_log:
        logger.exception(platform_exception)

    return JSONResponse(
        status_code=409,
        content={
            "error": platform_exception.__class__.__name__,
            "detail": platform_exception.detail,
            "code": platform_exception.code,
        },
    )
