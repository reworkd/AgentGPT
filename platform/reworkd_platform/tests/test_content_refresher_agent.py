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


@pytest.mark.parametrize(
    "url, expected",
    [
        ("http://example.com", "example.com"),
        ("https://example.com", "example.com"),
        ("example.com", "example.com"),
        ("https://sub.example.com", "example.com"),
        ("http://example.com/path?query=param", "example.com"),
        ("http://example.com:8080", "example.com"),
        ("invalid_url", None),
        ("", None),
        ("http://exa_mple-123.com", "exa_mple-123.com"),
        ("https://", None),
    ],
)
def test_extract_domain(url, expected):
    service = ContentRefresherService(settings=Settings(), log=lambda msg: print(msg))
    assert service.extract_domain(url) == expected


@pytest.mark.parametrize(
    "sources, competitors, expected",
    [
        (
            [
                {"url": "https://www.ourcompany.com/news", "title": "Our company news"},
                {"url": "https://www.competitor.com/news", "title": "Competitor news"},
                {
                    "url": "https://www.othercompany.com/news",
                    "title": "Other company news",
                },
                {
                    "url": "https://www.dougandbeane.com/news",
                    "title": "Doug and Beane news",
                },
            ],
            ["competitor", "Doug and Beane", "ourfirm"],
            [
                {"url": "https://www.ourcompany.com/news", "title": "Our company news"},
                {
                    "url": "https://www.othercompany.com/news",
                    "title": "Other company news",
                },
            ],
        ),
        (
            [
                {"url": "https://www.ourcompany.com/news", "title": "Our company news"},
                {"url": "https://www.competitor2.com/news", "title": "Competitor news"},
                {
                    "url": "https://www.othercompany.com/news",
                    "title": "Other company news",
                },
            ],
            ["competitor2"],
            [
                {"url": "https://www.ourcompany.com/news", "title": "Our company news"},
                {
                    "url": "https://www.othercompany.com/news",
                    "title": "Other company news",
                },
            ],
        ),
        (
            [],
            ["competitor", "Doug and Beane", "ourfirm"],
            [],
        ),
        (
            [
                {"url": "https://www.competitor1.com/news", "title": "Competitor news"},
                {"url": "https://www.competitor2.com/news", "title": "Competitor news"},
                {"url": "https://www.competitor3.com/news", "title": "Competitor news"},
            ],
            ["competitor1", "competitor2", "competitor3"],
            [],
        ),
        (
            [
                {"url": "https://www.ourcompany.com/news", "title": "Our company news"},
                {"url": "https://asbestos.com/news", "title": "Asbestos news"},
                {
                    "url": "https://competitor-xyz.org/info",
                    "title": "Competitor XYZ info",
                },
                {
                    "url": "https://news.somecompetitor.net",
                    "title": "Some Competitor news",
                },
                {
                    "url": "ftp://legacycompetitor.com/archive",
                    "title": "Legacy Competitor archive",
                },
                {
                    "url": "https://subdomain.ourcompany.com/news",
                    "title": "Subdomain Our company news",
                },
            ],
            ["asbestos", "competitor-xyz", "somecompetitor", "legacycompetitor"],
            [
                {"url": "https://www.ourcompany.com/news", "title": "Our company news"},
                {
                    "url": "https://subdomain.ourcompany.com/news",
                    "title": "Subdomain Our company news",
                },
            ],
        ),
    ],
)
def test_remove_competitors(sources, competitors, expected):
    service = ContentRefresherService(settings=Settings(), log=lambda msg: print(msg))

    filtered_sources = service.remove_competitors(sources, competitors, service.log)
    assert filtered_sources == expected


@pytest.mark.parametrize(
    "input_keywords, expected",
    [
        ("apple, orange, banana", ["apple", "orange", "banana"]),
        (" apple,orange , banana ", ["apple", "orange", "banana"]),
        ("", []),
        (None, []),
        ("apple", ["apple"]),
        ("apple, ", ["apple"]),
    ],
)
def test_parse_input_keywords(input_keywords, expected):
    service = ContentRefresherService(settings=Settings(), log=lambda msg: print(msg))
    result = service.parse_input_keywords(input_keywords)
    assert result == expected
