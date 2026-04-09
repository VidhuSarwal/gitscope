from fastapi import APIRouter, Depends, BackgroundTasks, Body
from app.controllers.repo_controller import RepoController
from app.utils.dependencies import get_current_user
from app.models.user_model import User
from pydantic import BaseModel

router = APIRouter(prefix="/api/repo", tags=["Repository"])

@router.post("/analyze")
async def analyze_repo(
    background_tasks: BackgroundTasks,
    repo_url: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user)
):
    return await RepoController.analyze_repo(repo_url, current_user, background_tasks)

@router.delete("/{repo_id}")
async def delete_repo(repo_id: str, current_user: User = Depends(get_current_user)):
    return await RepoController.delete_repo(repo_id, current_user)

@router.get("/{repo_id}/summary")
async def get_repo_summary(repo_id: str, current_user: User = Depends(get_current_user)):
    repo = await RepoController.get_repo(repo_id, current_user)
    if not repo.summary:
        return {"message": "Repo analysis not yet complete"}
    return {
        "summary": repo.summary,
        "technologies": repo.technologies,
        "functions": repo.functions
    }

@router.get("/{repo_id}/files")
async def get_repo_files(repo_id: str, current_user: User = Depends(get_current_user)):
    return await RepoController.get_file_structure(repo_id, current_user)

@router.get("/user/all")
async def get_user_repos(current_user: User = Depends(get_current_user)):
    # Note: This endpoint was requested as /api/user/repos in requirements, 
    # but logically fits here or in user_routes. 
    # The requirements said GET /api/user/repos. 
    # I'll add it to user_routes or just alias it here.
    # Let's put it in user_routes to match requirements exactly, 
    # but I'll implement the controller logic here.
    return await RepoController.get_user_repos(current_user)

@router.get("/{repo_id}/contributors")
async def get_contributors(repo_id: str, current_user: User = Depends(get_current_user)):
    return await RepoController.get_contributors(repo_id, current_user)

class FileAnalysisRequest(BaseModel):
    file_path: str

@router.post("/{repo_id}/file/analyze")
async def analyze_file(
    repo_id: str, 
    request: FileAnalysisRequest, 
    current_user: User = Depends(get_current_user)
):
    return await RepoController.analyze_file(repo_id, request.file_path, current_user)

@router.post("/{repo_id}/file/content")
async def get_file_content(
    repo_id: str,
    request: FileAnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    return await RepoController.get_file_content(repo_id, request.file_path, current_user)
