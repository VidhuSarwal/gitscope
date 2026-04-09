from datetime import datetime
from typing import List, Dict, Any
from pydantic import Field
from app.models.base import MongoBaseModel, PyObjectId

class Repo(MongoBaseModel):
    user_id: PyObjectId
    repo_name: str
    repo_url: str
    summary: str | None = None
    file_structure: Dict[str, Any] | None = None
    technologies: List[str] = []
    functions: List[str] = []
    evolution_story: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "6567...",
                "repo_name": "my-repo",
                "repo_url": "https://github.com/user/repo",
                "summary": "This is a repo...",
                "file_structure": {"src": {"main.py": "file"}},
                "technologies": ["python", "fastapi"],
                "functions": ["process_data"],
                "created_at": "2023-11-29T12:00:00",
                "updated_at": "2023-11-29T12:00:00"
            }
        }
