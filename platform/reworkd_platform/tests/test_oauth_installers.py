import pytest

from reworkd_platform.services.oauth_installers import installer_factory


def test_installer_factory(mocker):
    crud = mocker.Mock()
    installer_factory("sid", crud)


def test_integration_dne(mocker):
    crud = mocker.Mock()

    with pytest.raises(NotImplementedError):
        installer_factory("asim", crud)
