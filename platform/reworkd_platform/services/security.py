from typing import Union

from cryptography.fernet import Fernet, InvalidToken

from reworkd_platform.settings import settings
from reworkd_platform.web.api.http_responses import forbidden


class EncryptionService:
    def __init__(self, secret: bytes):
        self.fernet = Fernet(secret)

    def encrypt(self, text: str) -> bytes:
        return self.fernet.encrypt(text.encode("utf-8"))

    def decrypt(self, encoded_bytes: Union[bytes, str]) -> str:
        try:
            return self.fernet.decrypt(encoded_bytes).decode("utf-8")
        except InvalidToken:
            raise forbidden()


encryption_service = EncryptionService(settings.secret_signing_key.encode())
