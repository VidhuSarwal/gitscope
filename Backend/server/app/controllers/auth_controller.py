from fastapi import HTTPException, status
from app.database import get_database
from app.models.user_model import User
from app.utils.hashing import Hasher
from app.services.token_service import TokenService
from pydantic import BaseModel, EmailStr
from bson import ObjectId

class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AuthController:
    @staticmethod
    async def signup(user_data: UserSignup):
        db = await get_database()
        
        # Check if email already exists
        existing_user = await db["users"].find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
            
        hashed_password = Hasher.get_password_hash(user_data.password)
        
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            password=hashed_password
        )
        
        result = await db["users"].insert_one(new_user.model_dump(by_alias=True, exclude={"id"}))
        
        return {"message": "User created successfully", "user_id": str(result.inserted_id)}

    @staticmethod
    async def login(login_data: UserLogin):
        db = await get_database()
        
        user = await db["users"].find_one({"email": login_data.email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
            
        if not Hasher.verify_password(login_data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
            
        access_token = TokenService.create_access_token(subject=str(user["_id"]))
        
        # Return user info without password
        user_response = User(**user).model_dump(exclude={"password"})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        }

    @staticmethod
    async def change_password(user_id: str, old_password: str, new_password: str):
        db = await get_database()
        user = await db["users"].find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if not Hasher.verify_password(old_password, user["password"]):
            raise HTTPException(status_code=400, detail="Invalid old password")
            
        new_hashed_password = Hasher.get_password_hash(new_password)
        
        await db["users"].update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password": new_hashed_password}}
        )
        
        return {"message": "Password updated successfully"}
