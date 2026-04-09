from pydantic_settings import BaseSetting
from typing import Optional


class Settings(BaseSettings):
    # Database
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "repo_analyzer"

    # JWT
    jwt_secret: str = "your-super-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # GitHub
    github_token: Optional[str] = None
    github_api_url: str = "https://api.github.com"

    # LLM Defaults
    default_llm_model: str = "openai:gpt-4"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()