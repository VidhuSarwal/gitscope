from cryptography.fernet import Fernet
import base64
import hashlib
from app.config import get_settings

settings = get_settings()

class EncryptionService:
    @staticmethod
    def _get_key():
        # Derive a 32-byte key from the secret
        key = hashlib.sha256(settings.JWT_SECRET.encode()).digest()
        return base64.urlsafe_b64encode(key)

    @staticmethod
    def encrypt(data: str) -> str:
        f = Fernet(EncryptionService._get_key())
        return f.encrypt(data.encode()).decode()

    @staticmethod
    def decrypt(token: str) -> str:
        f = Fernet(EncryptionService._get_key())
        return f.decrypt(token.encode()).decode()
