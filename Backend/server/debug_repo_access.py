import asyncio
from app.database import db
from app.models.repo_model import Repo
from app.services.token_service import TokenService
from bson import ObjectId

async def main():
    db.connect()
    database = db.get_db()
    
    repo_id = "692b42210c01468e21d3f83c"
    try:
        oid = ObjectId(repo_id)
    except:
        print("Invalid ObjectId")
        return

    repo = await database["repos"].find_one({"_id": oid})
    if not repo:
        print("Repo not found in DB")
        return

    user_id = repo["user_id"]
    print(f"Repo belongs to user: {user_id}")
    
    # Generate token for this user
    token = TokenService.create_access_token(subject=str(user_id))
    print(f"Generated Token: {token}")

    db.close()

if __name__ == "__main__":
    asyncio.run(main())
