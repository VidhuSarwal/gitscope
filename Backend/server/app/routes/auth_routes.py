from fastapi import APIRouter, Depends
from app.controllers.auth_controller import AuthController, UserSignup, UserLogin
from app.utils.dependencies import get_current_user
from app.models.user_model import User
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup")
async def signup(user: UserSignup):
    return await AuthController.signup(user)

@router.post("/login")
async def login(login_data: UserLogin):
    return await AuthController.login(login_data)

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user)
):
    return await AuthController.change_password(str(current_user.id), request.old_password, request.new_password)
