from functools import wraps
from time import time
from typing import Literal

from loguru import logger

Log_Level = Literal[
    "TRACE",
    "DEBUG",
    "INFO",
    "SUCCESS",
    "WARNING",
    "ERROR",
    "CRITICAL",
]


def timed_function(level: Log_Level = "INFO"):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time()
            result = func(*args, **kwargs)
            execution_time = time() - start_time
            logger.log(
                level,
                f"Function '{func.__qualname__}' executed in {execution_time:.4f} seconds",
            )

            return result

        return wrapper

    return decorator
