from unittest.mock import MagicMock

import pytest

from reworkd_platform.web.api.memory.memory_with_fallback import MemoryWithFallback


@pytest.mark.parametrize(
    "method_name, args",
    [
        ("__enter__", ()),
        ("__exit__", (None, None, None)),
        ("add_tasks", (["task1", "task2"],)),
        ("get_similar_tasks", ("task1", 0.8)),
        ("reset_class", ()),
    ],
)
def test_memory_with_fallback(method_name: str, args) -> None:
    primary = MagicMock()
    secondary = MagicMock()
    memory_with_fallback = MemoryWithFallback(primary, secondary)

    # Use getattr() to call the method on the object with args
    getattr(memory_with_fallback, method_name)(*args)
    getattr(primary, method_name).assert_called_once_with(*args)
    getattr(secondary, method_name).assert_not_called()

    # Reset mock and make primary raise an exception
    getattr(primary, method_name).reset_mock()
    getattr(primary, method_name).side_effect = Exception("Primary Failed")

    # Call the method again, this time it should fall back to secondary
    getattr(memory_with_fallback, method_name)(*args)
    getattr(primary, method_name).assert_called_once_with(*args)
    getattr(secondary, method_name).assert_called_once_with(*args)
