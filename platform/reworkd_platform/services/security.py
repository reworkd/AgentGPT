from cryptography.fernet import Fernet

from reworkd_platform.settings import settings


class EncryptionService:
    def __init__(self, secret: bytes):
        self.fernet = Fernet(secret)

    def encrypt(self, text: str) -> bytes:
        return self.fernet.encrypt(text.encode("utf-8"))

    def decrypt(self, encoded_bytes: bytes) -> str:
        return self.fernet.decrypt(encoded_bytes).decode("utf-8")


encryption_service = EncryptionService(settings.secret_signing_key.encode())
