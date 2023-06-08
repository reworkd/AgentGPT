import random
from typing import Optional

from reworkd_platform.schemas import LLM_Model

PRIMARY_KEY_RATE = 0.7
SECONDARY_KEY_RATE = 1 - PRIMARY_KEY_RATE
WEIGHTS = [PRIMARY_KEY_RATE, SECONDARY_KEY_RATE]


def rotate_keys(gpt_3_key: str, gpt_4_key: Optional[str], model: LLM_Model) -> str:
    if not gpt_4_key or model == "gpt-3.5-turbo":
        return gpt_3_key

    keys = [gpt_3_key, gpt_4_key]
    if "gpt-4" in model:
        keys.reverse()

    return random.choices(keys, WEIGHTS)[0]
