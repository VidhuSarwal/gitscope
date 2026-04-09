from datetime import datetime
from pydantic import Field
from app.models.base import MongoBaseModel, PyObjectId

class Commit(MongoBaseModel):
    repo_id: PyObjectId
    commit_hash: str
    author: str
    message: str
    date: datetime
    story: str | None = None

    class Config:
        json_schema_extra = {
            "example": {
                "repo_id": "6567...",
                "commit_hash": "a1b2c3d4...",
                "author": "johndoe",
                "message": "Initial commit",
                "date": "2023-11-29T12:00:00",
                "story": "John started the project by..."
            }
        }
