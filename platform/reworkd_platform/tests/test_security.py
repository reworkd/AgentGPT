import pytest
from cryptography.fernet import Fernet
from fastapi import HTTPException

from reworkd_platform.services.security import EncryptionService


def test_encrypt_decrypt():
    key = Fernet.generate_key()
    service = EncryptionService(key)

    original_text = "Hello, world!"
    encrypted = service.encrypt(original_text)
    decrypted = service.decrypt(encrypted)

    assert original_text == decrypted


def test_invalid_key():
    key = Fernet.generate_key()

    different_key = Fernet.generate_key()
    different_service = EncryptionService(different_key)

    original_text = "Hello, world!"
    encrypted = Fernet(key).encrypt(original_text.encode())

    with pytest.raises(HTTPException):
        different_service.decrypt(encrypted)
