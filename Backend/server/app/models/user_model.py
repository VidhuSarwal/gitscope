from datetime import datetime
from typing import List
from pydantic import Field, EmailStr
from app.models.base import MongoBaseModel, PyObjectId

class User(MongoBaseModel):
    username: str
    email: EmailStr
    password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    repos: List[PyObjectId] = []

    class Config:
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "johndoe@example.com",
                "password": "hashed_password_here",
                "created_at": "2023-11-29T12:00:00",
                "repos": []
            }
        }
