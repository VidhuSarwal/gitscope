from datetime import datetime
from pydantic import Field
from app.models.base import MongoBaseModel, PyObjectId

class LLMKey(MongoBaseModel):
    user_id: str
    name: str = "Default Key"
    provider: str = "gemini-2.5-flash"
    api_key: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "6567...",
                "provider": "gemini-2.5-flash",
                "api_key": "encrypted_key_here",
                "created_at": "2023-11-29T12:00:00"
            }
        }
