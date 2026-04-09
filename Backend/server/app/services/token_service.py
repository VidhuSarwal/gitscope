from datetime import datetime, timedelta
from typing import Union, Any
from jose import jwt
from app.config import get_settings

settings = get_settings()

class TokenService:
    @staticmethod
    def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
        
        to_encode = {"exp": expire, "sub": str(subject)}
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm="HS256")
        return encoded_jwt
