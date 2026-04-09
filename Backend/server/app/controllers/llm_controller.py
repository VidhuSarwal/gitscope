from fastapi import HTTPException, status
from app.database import get_database
from app.models.llmkey_model import LLMKey
from app.utils.encryption import EncryptionService
from pydantic import BaseModel
from bson import ObjectId

class LLMKeyRequest(BaseModel):
    name: str = "My Key"
    provider: str = "gemini-2.5-flash"
    api_key: str

class LLMController:
    @staticmethod
    async def get_keys(user_id: str):
        db = await get_database()
        try:
            # Query for both string and ObjectId to handle mixed data types
            from bson import ObjectId
            try:
                oid = ObjectId(user_id)
                query = {"$or": [{"user_id": user_id}, {"user_id": oid}]}
            except:
                query = {"user_id": user_id}
                
            cursor = db["llm_keys"].find(query)
            keys = await cursor.to_list(length=100)
            
            return [
                {
                    "id": str(k["_id"]),
                    "name": k.get("name", "Default Key"),
                    "provider": k["provider"],
                    "created_at": k.get("created_at")
                }
                for k in keys
            ]
        except Exception as e:
            print(f"Error in get_keys: {e}")
            raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

    @staticmethod
    async def add_key(user_id: str, key_data: LLMKeyRequest):
        if not key_data.api_key:
            raise HTTPException(status_code=400, detail="API key cannot be empty")
            
        if key_data.provider != "gemini-2.5-flash":
            raise HTTPException(status_code=400, detail="Invalid provider")
            
        db = await get_database()
        encrypted_key = EncryptionService.encrypt(key_data.api_key)
        
        new_key = LLMKey(
            user_id=user_id,
            name=key_data.name,
            provider=key_data.provider,
            api_key=encrypted_key
        )
        
        result = await db["llm_keys"].insert_one(new_key.model_dump(by_alias=True, exclude={"id"}))
        
        return {"message": "LLM key added successfully", "key_id": str(result.inserted_id)}

    @staticmethod
    async def delete_key(user_id: str, key_id: str):
        db = await get_database()
        
        # Check count
        count = await db["llm_keys"].count_documents({"user_id": user_id})
        if count <= 1:
            raise HTTPException(status_code=400, detail="Cannot delete the last remaining key")
            
        try:
            oid = ObjectId(key_id)
        except:
            raise HTTPException(status_code=400, detail="Invalid key ID")
            
        result = await db["llm_keys"].delete_one({"_id": oid, "user_id": user_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Key not found")
            
        return {"message": "Key deleted successfully"}

    @staticmethod
    async def get_active_key(user_id: str):
        db = await get_database()
        # Get the most recently created key or just the first one
        key_doc = await db["llm_keys"].find_one({"user_id": user_id}, sort=[("created_at", -1)])
        
        if not key_doc:
            raise HTTPException(status_code=400, detail="LLM key not configured")
            
        return EncryptionService.decrypt(key_doc["api_key"])

    @staticmethod
    def get_available_models():
        return [
            {
                "id": "gemini-2.5-flash",
                "name": "Gemini 2.5 Flash",
                "provider": "Google"
            }
        ]
