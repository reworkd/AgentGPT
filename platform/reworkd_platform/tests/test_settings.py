from typing import Dict, Any

import pytest

from reworkd_platform.settings import Settings


@pytest.mark.parametrize(
    "settings, expected",
    [
        (
            {
                "pusher_app_id": "123",
                "pusher_key": "123",
                "pusher_secret": "123",
                "pusher_cluster": "123",
            },
            True,
        ),
        (
            {
                "pusher_app_id": "123",
                "pusher_cluster": "123",
            },
            False,
        ),
        ({}, False),
    ],
)
def test_pusher_enabled(settings: Dict[str, Any], expected: bool):
    settings = Settings(**settings)
    assert settings.pusher_enabled == expected


@pytest.mark.parametrize(
    "settings, expected",
    [
        (
            {
                "kafka_bootstrap_servers": ["123"],
                "kafka_username": "123",
                "kafka_password": "123",
            },
            True,
        ),
        (
            {
                "kafka_bootstrap_servers": ["123"],
                "kafka_username": "123",
            },
            False,
        ),
        ({}, False),
    ],
)
def test_kafka_enabled(settings: Dict[str, Any], expected: bool):
    settings = Settings(**settings)
    assert settings.kafka_enabled == expected


def test_settings_create():
    assert Settings() is not None
