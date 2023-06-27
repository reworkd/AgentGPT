import pytest

from reworkd_platform.web.api.memory.memory_with_fallback import MemoryWithFallback


@pytest.mark.parametrize(
    "method_name, args",
    [
        ("add_tasks", (["task1", "task2"],)),
        ("get_similar_tasks", ("task1",)),
        ("reset_class", ()),
    ],
)
def test_memory_primary(mocker, method_name: str, args) -> None:
    primary = mocker.Mock()
    secondary = mocker.Mock()
    memory_with_fallback = MemoryWithFallback(primary, secondary)

    # Use getattr() to call the method on the object with args
    getattr(memory_with_fallback, method_name)(*args)
    getattr(primary, method_name).assert_called_once_with(*args)
    getattr(secondary, method_name).assert_not_called()


@pytest.mark.parametrize(
    "method_name, args",
    [
        ("add_tasks", (["task1", "task2"],)),
        ("get_similar_tasks", ("task1",)),
        ("reset_class", ()),
    ],
)
def test_memory_fallback(mocker, method_name: str, args) -> None:
    primary = mocker.Mock()
    secondary = mocker.Mock()
    memory_with_fallback = MemoryWithFallback(primary, secondary)

    getattr(primary, method_name).side_effect = Exception("Primary Failed")

    # Call the method again, this time it should fall back to secondary
    getattr(memory_with_fallback, method_name)(*args)
    getattr(primary, method_name).assert_called_once_with(*args)
    getattr(secondary, method_name).assert_called_once_with(*args)
