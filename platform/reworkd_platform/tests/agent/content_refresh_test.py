import pytest
from reworkd_platform.schemas.workflow.blocks.agents.content_refresher_agent import (
    remove_competitors,
)


def log(message: str):
    print(message)


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
    ],
)
def test_remove_competitors(sources, competitors, expected):
    filtered_sources = remove_competitors(sources, competitors, log)
    assert filtered_sources == expected
