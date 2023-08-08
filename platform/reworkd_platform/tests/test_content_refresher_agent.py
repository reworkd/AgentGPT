import os

import pytest

from reworkd_platform.schemas.workflow.blocks.agents.content_refresher_agent import (
    ContentRefresherInput,
    ContentRefresherService,
)
from reworkd_platform.settings import Settings

WORKFLOW_ID = "test_workflow_id"

ANTHROPIC_API_KEY = os.environ.get("REWORKD_PLATFORM_ANTHROPIC_API_KEY")
SCRAPINGBEE_API_KEY = os.environ.get("REWORKD_PLATFORM_SCRAPINGBEE_API_KEY")
SERP_API_KEY = os.environ.get("REWORKD_PLATFORM_SERP_API_KEY")

should_skip = not all(
    [
        ANTHROPIC_API_KEY,
        SCRAPINGBEE_API_KEY,
        SERP_API_KEY,
    ]
)


@pytest.mark.asyncio
@pytest.mark.skipif(
    should_skip, reason="Credentials not provided in environment variables"
)
async def test_run():
    settings = Settings()
    settings.anthropic_api_key = ANTHROPIC_API_KEY
    settings.scrapingbee_api_key = SCRAPINGBEE_API_KEY
    settings.serp_api_key = SERP_API_KEY

    input_ = ContentRefresherInput(
        url="https://reworkd.ai",
        settings=settings,
    )

    service = ContentRefresherService(settings, log=lambda msg: print(msg))
    await service.refresh(input_)
