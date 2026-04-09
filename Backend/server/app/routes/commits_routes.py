from fastapi import APIRouter, Depends, BackgroundTasks
from app.controllers.commits_controller import CommitsController
from app.utils.dependencies import get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/api/repo", tags=["Commits"])

@router.get("/{repo_id}/commits")
async def get_commits(repo_id: str, current_user: User = Depends(get_current_user)):
    return await CommitsController.get_commits(repo_id, current_user)

@router.get("/{repo_id}/commits/story")
async def get_commit_stories(
    repo_id: str, 
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    return await CommitsController.get_commit_stories(repo_id, current_user, background_tasks)

@router.get("/{repo_id}/story")
async def get_project_story(repo_id: str, current_user: User = Depends(get_current_user)):
    return await CommitsController.get_project_story(repo_id, current_user)
