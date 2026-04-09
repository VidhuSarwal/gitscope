from fastapi import HTTPException, BackgroundTasks
from app.database import get_database
from app.models.commit_model import Commit
from app.models.user_model import User
from app.services.github_service import GitHubService
from app.services.llm_service import LLMService
from app.services.cache_service import CacheService
from app.utils.encryption import EncryptionService
from datetime import datetime
from bson import ObjectId

class CommitsController:
    @staticmethod
    async def _generate_story_background(commit_hash: str, repo_id: str, message: str, user_id: str, api_key: str):
        db = await get_database()
        try:
            # Check Cache
            cached_story = CacheService.get_analysis(commit_hash)
            
            if cached_story:
                story = cached_story["story"]
                print(f"Cache hit for commit story {commit_hash}")
            else:
                story = await LLMService.generate_commit_story(api_key, message)
                # Save to Cache
                CacheService.save_analysis(commit_hash, {"story": story}, message, "commit_story")
            
            await db["commits"].update_one(
                {"commit_hash": commit_hash, "repo_id": repo_id},
                {"$set": {"story": story}}
            )
        except Exception as e:
            print(f"Story generation failed for {commit_hash}: {str(e)}")
            # Optionally update status
            pass

    @staticmethod
    async def get_commits(repo_id: str, user: User):
        db = await get_database()
        
        try:
            oid = ObjectId(repo_id)
        except:
            raise HTTPException(status_code=400, detail="Invalid repository ID")
        
        # Verify access
        repo = await db["repos"].find_one({"_id": oid, "user_id": str(user.id)})
        if not repo:
            raise HTTPException(status_code=404, detail="Repository not found")
            
        # Check if we have commits in DB
        cursor = db["commits"].find({"repo_id": repo_id}).sort("date", -1).limit(20)
        commits = await cursor.to_list(length=20)
        
        if not commits:
            # Fetch from GitHub
            try:
                github_commits = await GitHubService.get_commits(repo["repo_url"], limit=20)
                
                new_commits = []
                for c in github_commits:
                    commit_data = {
                        "repo_id": repo_id,
                        "commit_hash": c["sha"],
                        "author": c["commit"]["author"]["name"],
                        "message": c["commit"]["message"],
                        "date": datetime.strptime(c["commit"]["author"]["date"], "%Y-%m-%dT%H:%M:%SZ"),
                        "story": None
                    }
                    new_commits.append(commit_data)
                    
                    # Upsert to avoid duplicates
                    await db["commits"].update_one(
                        {"commit_hash": c["sha"], "repo_id": repo_id},
                        {"$set": commit_data},
                        upsert=True
                    )
                
                # Re-fetch from DB to get IDs
                cursor = db["commits"].find({"repo_id": repo_id}).sort("date", -1).limit(20)
                commits = await cursor.to_list(length=20)
                
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to fetch commits: {str(e)}")
                
        return [Commit(**c) for c in commits]

    @staticmethod
    async def get_commit_stories(repo_id: str, user: User, background_tasks: BackgroundTasks):
        db = await get_database()
        
        # Get commits
        commits = await CommitsController.get_commits(repo_id, user)
        
        # Get LLM Key
        key_doc = await db["llm_keys"].find_one({"user_id": str(user.id)})
        if not key_doc:
            raise HTTPException(status_code=400, detail="Missing LLM key")
        decrypted_key = EncryptionService.decrypt(key_doc["api_key"])
        
        # Trigger generation for missing stories
        for commit in commits:
            if not commit.story:
                background_tasks.add_task(
                    CommitsController._generate_story_background,
                    commit.commit_hash,
                    repo_id,
                    commit.message,
                    str(user.id),
                    decrypted_key
                )
        
        return commits

    @staticmethod
    async def get_project_story(repo_id: str, user: User):
        db = await get_database()
        
        try:
            oid = ObjectId(repo_id)
        except:
            raise HTTPException(status_code=400, detail="Invalid repository ID")
            
        repo = await db["repos"].find_one({"_id": oid, "user_id": str(user.id)})
        if not repo:
            raise HTTPException(status_code=404, detail="Repository not found")
            
        # Check if story already exists
        if repo.get("evolution_story"):
            return {"story": repo["evolution_story"]}
            
        # Fetch commits
        commits = await CommitsController.get_commits(repo_id, user)
        if not commits:
            return {"story": "Not enough commit history to generate a story."}
            
        # Get LLM Key
        key_doc = await db["llm_keys"].find_one({"user_id": str(user.id)})
        if not key_doc:
            raise HTTPException(status_code=400, detail="Missing LLM key")
        decrypted_key = EncryptionService.decrypt(key_doc["api_key"])
        
        # Generate story
        try:
            # Convert commits to dict for processing
            commits_data = [c.model_dump() for c in commits]
            # Sort by date ascending for the narrative
            commits_data.sort(key=lambda x: x['date'])
            
            # Compute hash for project story based on commits
            import json
            # Use a stable representation of commits for hashing
            commits_str = json.dumps([{k: str(v) for k, v in c.items() if k in ['commit_hash', 'date']} for c in commits_data], sort_keys=True)
            story_hash = CacheService.compute_hash(commits_str)
            
            cached_story = CacheService.get_analysis(story_hash)
            
            if cached_story:
                story = cached_story["story"]
                print(f"Cache hit for project story {repo_id}")
            else:
                story = await LLMService.generate_project_narrative(decrypted_key, commits_data)
                CacheService.save_analysis(story_hash, {"story": story}, commits_str, "project_narrative")
            
            
            # Save story to repo
            await db["repos"].update_one(
                {"_id": oid},
                {"$set": {"evolution_story": story}}
            )
            
            return {"story": story}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate story: {str(e)}")
