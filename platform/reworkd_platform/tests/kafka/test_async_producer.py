import pytest
from pydantic import BaseModel

from reworkd_platform.services.kafka.producers.base import AsyncProducer
from reworkd_platform.settings import Settings


class MockedSettings(Settings):
    enabled: bool

    @property
    def kafka_enabled(self) -> bool:
        return self.enabled


@pytest.mark.asyncio
@pytest.mark.filterwarnings("ignore")
async def test_kafka_disabled():
    producer = await AsyncProducer.create(settings=MockedSettings(enabled=False))
    assert producer._producer is False

    await producer.start()
    assert producer._producer is False

    await producer.stop()
    assert producer._producer is False

    await producer.produce("workflow_task", BaseModel())
    assert producer._producer is False


# noinspection PyBroadException
@pytest.mark.asyncio
async def test_kafka_enabled():
    try:
        await AsyncProducer.create(settings=MockedSettings(enabled=True))
    except Exception:
        pass
