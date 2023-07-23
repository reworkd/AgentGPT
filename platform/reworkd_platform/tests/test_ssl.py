import pytest

from reworkd_platform.services.ssl import (
    get_ssl_context,
)
from reworkd_platform.settings import Settings


def test_get_ssl_context():
    get_ssl_context(Settings())


def test_get_ssl_context_raise():
    settings = Settings()

    with pytest.raises(ValueError):
        get_ssl_context(settings, paths=["/test/cert.pem"])


def test_get_ssl_context_specified_raise():
    settings = Settings(db_ca_path="/test/cert.pem")

    with pytest.raises(FileNotFoundError):
        get_ssl_context(settings)
