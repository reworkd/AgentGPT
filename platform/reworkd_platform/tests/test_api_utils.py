from collections import Counter

import pytest

from reworkd_platform.schemas import LLM_Model
from reworkd_platform.web.api.agent.api_utils import rotate_keys

ITERATIONS = 10000

PK = "gpt-3-primary_key"
SK = "gpt-4-primary_key"


@pytest.mark.parametrize("model", ["gpt-3"])
def test_rotate_keys(model: LLM_Model) -> None:
    results = []
    for _ in range(ITERATIONS):
        key = rotate_keys(PK, SK, model=model)
        assert key in [PK, SK]
        results.append(key)

    counter = Counter(results)
    assert 0.65 < counter[PK] / ITERATIONS < 0.75


@pytest.mark.parametrize(
    "model",
    [
        "gpt-3.5-turbo",
    ],
)
def test_rotate_keys_gpt_3_5(model: LLM_Model) -> None:
    results = []
    for _ in range(ITERATIONS):
        key = rotate_keys(PK, SK, model=model)
        assert key in [PK, SK]
        results.append(key)

    counter = Counter(results)
    assert counter[PK] / ITERATIONS == 1


@pytest.mark.parametrize(
    "model",
    [
        "gpt-4",
        "gpt-4-0314",
        "gpt-4-turbo",
    ],
)
def test_rotate_keys_gpt_4(model: LLM_Model) -> None:
    results = []
    for _ in range(ITERATIONS):
        key = rotate_keys(PK, SK, model=model)
        assert key in [PK, SK]
        results.append(key)

    counter = Counter(results)
    assert 0.65 < counter[SK] / ITERATIONS < 0.75


@pytest.mark.parametrize("model", ["gpt-3.5-turbo", "gpt-4"])
def test_rotate_keys_no_secondary(model: LLM_Model) -> None:
    assert rotate_keys(PK, None, model=model) == PK
