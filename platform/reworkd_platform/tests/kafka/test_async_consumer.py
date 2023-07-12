import pytest

from reworkd_platform.services.kafka.consumers.base import AsyncConsumer
from reworkd_platform.settings import Settings


class MockedSettings(Settings):
    enabled: bool

    @property
    def kafka_enabled(self) -> bool:
        return self.enabled


class StubConsumer(AsyncConsumer):
    async def on_message(self, record):
        pass


@pytest.mark.asyncio
async def test_kafka_disabled():
    consumer = StubConsumer(settings=MockedSettings(enabled=False))
    assert consumer._consumer is False

    await consumer.start()
    assert consumer._consumer is False

    await consumer.stop()
    assert consumer._consumer is False
