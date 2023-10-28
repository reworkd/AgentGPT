import pytest
from openai.error import InvalidRequestError, ServiceUnavailableError

from reworkd_platform.schemas.agent import ModelSettings
from reworkd_platform.web.api.agent.helpers import openai_error_handler
from reworkd_platform.web.api.errors import OpenAIError


async def act(*args, settings: ModelSettings = ModelSettings(), **kwargs):
    return await openai_error_handler(*args, settings=settings, **kwargs)


@pytest.mark.asyncio
async def test_service_unavailable_error():
    async def mock_service_unavailable_error():
        raise ServiceUnavailableError("Service Unavailable")

    with pytest.raises(OpenAIError):
        await act(mock_service_unavailable_error)


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "settings,should_log",
    [
        (ModelSettings(custom_api_key="xyz"), False),
        (ModelSettings(custom_api_key=None), True),
    ],
)
async def test_should_log(settings, should_log):
    async def mock_invalid_request_error_model_access():
        raise InvalidRequestError(
            "The model: xyz does not exist or you do not have access to it.",
            param="model",
        )

    with pytest.raises(Exception) as exc_info:
        await openai_error_handler(
            mock_invalid_request_error_model_access, settings=settings
        )

    assert isinstance(exc_info.value, OpenAIError)
    error: OpenAIError = exc_info.value

    assert error.should_log == should_log
