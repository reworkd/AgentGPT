import random
from typing import Optional

PRIMARY_KEY_RATE = 0.7
SECONDARY_KEY_RATE = 1 - PRIMARY_KEY_RATE
WEIGHTS = [PRIMARY_KEY_RATE, SECONDARY_KEY_RATE]


def rotate_keys(
    primary_key: str, secondary_key: Optional[str], model: str = "gpt-3.5-turbo"
) -> str:
    if not secondary_key:
        return primary_key

    keys = [primary_key, secondary_key]
    if "gpt-4" in model:
        keys.reverse()

    return random.choices(keys, WEIGHTS)[0]
