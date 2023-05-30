from collections import Counter

import pytest

from reworkd_platform.web.api.agent.api_utils import rotate_keys

ITERATIONS = 10000


def test_rotate_keys():
    pk = "primary_key"
    sk = "secondary_key"

    results = []
    for _ in range(ITERATIONS):
        key = rotate_keys(pk, sk)
        assert key in [pk, sk]
        results.append(key)

    counter = Counter(results)
    assert 0.65 < counter[pk] / ITERATIONS < 0.75


@pytest.mark.parametrize(
    "model",
    [
        "gpt-4",
        "gpt-4-0314",
        "gpt-4-turbo",
    ],
)
def test_rotate_keys_gpt_4(model):
    pk = "gpt-3-primary_key"
    sk = "gpt-4-primary_key"

    results = []
    for _ in range(ITERATIONS):
        key = rotate_keys(pk, sk, model=model)
        assert key in [pk, sk]
        results.append(key)

    counter = Counter(results)
    assert 0.65 < counter[sk] / ITERATIONS < 0.75


def test_rotate_keys_no_secondary():
    pk = "primary_key"
    assert rotate_keys(pk, None) == pk
