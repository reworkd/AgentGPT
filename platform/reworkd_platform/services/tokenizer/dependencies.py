from fastapi import Request

from reworkd_platform.services.tokenizer.service import TokenService


def get_token_service(request: Request) -> TokenService:
    return TokenService(request.app.state.token_encoding)
