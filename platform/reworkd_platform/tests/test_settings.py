from reworkd_platform.settings import Settings


def test_settings_create():
    assert Settings() is not None
