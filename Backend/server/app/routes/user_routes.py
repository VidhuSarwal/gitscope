from fastapi import APIRouter, Depends
from fastapi import APIRouter, Depends, HTTPException
from app.controllers.llm_controller import LLMController, LLMKeyRequest
from app.utils.dependencies import get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/api/user", tags=["User"])

@router.get("/me")
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "username": current_user.username,
        "email": current_user.email,
        "created_at": current_user.created_at
    }

@router.get("/keys")
async def get_keys(current_user: User = Depends(get_current_user)):
    return await LLMController.get_keys(str(current_user.id))

@router.post("/keys")
async def add_key(
    key_data: LLMKeyRequest,
    current_user: User = Depends(get_current_user)
):
    return await LLMController.add_key(str(current_user.id), key_data)

@router.delete("/keys/{key_id}")
async def delete_key(
    key_id: str,
    current_user: User = Depends(get_current_user)
):
    return await LLMController.delete_key(str(current_user.id), key_id)

# Deprecated/Alias for backward compatibility if needed, or just remove
@router.get("/llm-key")
async def get_llm_key(current_user: User = Depends(get_current_user)):
    # Just check if any key exists
    try:
        await LLMController.get_active_key(str(current_user.id))
        return {"provider": "gemini-2.5-flash", "configured": True}
    except:
        raise HTTPException(status_code=404, detail="LLM key not configured")

@router.post("/llm-key")
async def save_llm_key(
    key_data: LLMKeyRequest,
    current_user: User = Depends(get_current_user)
):
    # Treat as adding a default key
    return await LLMController.add_key(str(current_user.id), key_data)

@router.get("/repos")
async def get_user_repos(current_user: User = Depends(get_current_user)):
    from app.controllers.repo_controller import RepoController
    return await RepoController.get_user_repos(current_user)
