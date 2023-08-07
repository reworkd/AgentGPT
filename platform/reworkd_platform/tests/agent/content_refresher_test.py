import pytest
from typing import List, Dict, Callable
import re

# Assume the original function is in a module named 'source_filter'
from reworkd_platform.schemas.workflow.blocks.agents.content_refresher_agent import remove_competitors

def test_remove_competitor():
    # Create a simple logging function for the test
    def log(message: str):
        print(message)

    sources = [
        {"url": "https://www.ourcompany.com/news", "title": "Our company news"},
        {"url": "https://www.competitor.com/news", "title": "Competitor news"},
        {"url": "https://www.othercompany.com/news", "title": "Other company news"},
        {"url": "https://www.dougandbeane.com/news", "title": "Other company news"},
    ]
    competitors = ["competitor","Doug and Beane", "ourfirm"]

    filtered_sources = remove_competitors(sources, competitors, log)

    expected_sources = [
        {"url": "https://www.ourcompany.com/news", "title": "Our company news"},
        {"url": "https://www.othercompany.com/news", "title": "Other company news"},
    ]

    assert filtered_sources == expected_sources