from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    MONGO_URI: str
    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 1440
    GITHUB_TOKEN: str | None = None
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
