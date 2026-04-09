from fastapi import HTTPException, BackgroundTasks
from app.database import get_database
from app.models.repo_model import Repo
from app.models.user_model import User
from app.services.github_service import GitHubService
from app.services.llm_service import LLMService
from app.services.cache_service import CacheService
from app.utils.encryption import EncryptionService
from app.utils.exceptions import GitHubAPIError, LLMError
from datetime import datetime
from bson import ObjectId

class RepoController:
    @staticmethod
    async def _perform_analysis(repo_id: str, repo_url: str, user_id: str, api_key: str):
        db = await get_database()
        try:
            # Fetch GitHub data
            metadata = await GitHubService.get_repo_metadata(repo_url)
            file_tree = await GitHubService.get_file_tree(repo_url)
            
            # Check Cache
            # Use pushed_at as version identifier
            version_key = f"{repo_url}_{metadata.get('pushed_at')}"
            repo_hash = CacheService.compute_hash(version_key)
            
            cached_analysis = CacheService.get_analysis(repo_hash)
            
            if cached_analysis:
                analysis = cached_analysis
                print(f"Cache hit for repo analysis {repo_url}")
            else:
                # LLM Analysis
                analysis = await LLMService.summarize_repo(api_key, metadata)
                CacheService.save_analysis(repo_hash, analysis, version_key, "repo_summary")
            
            # Update Repo
            await db["repos"].update_one(
                {"_id": repo_id},
                {
                    "$set": {
                        "summary": analysis.get("summary"),
                        "technologies": analysis.get("technologies", []),
                        "functions": analysis.get("functions", []),
                        "file_structure": file_tree,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
        except Exception as e:
            print(f"Analysis failed for {repo_id}: {str(e)}")
            # Optionally update repo status to failed
            pass

    @staticmethod
    async def analyze_repo(repo_url: str, user: User, background_tasks: BackgroundTasks):
        db = await get_database()
        
        # Check for LLM Key
        key_doc = await db["llm_keys"].find_one({"user_id": str(user.id)})
        if not key_doc:
            raise HTTPException(status_code=400, detail="Missing LLM key")
            
        decrypted_key = EncryptionService.decrypt(key_doc["api_key"])
        
        # Check if repo already exists for user
        existing_repo = await db["repos"].find_one({"user_id": str(user.id), "repo_url": repo_url})
        if existing_repo:
            repo_id = existing_repo["_id"]
        else:
            # Create initial repo entry
            owner, name = GitHubService._parse_repo_url(repo_url)
            new_repo = Repo(
                user_id=str(user.id),
                repo_name=name,
                repo_url=repo_url
            )
            result = await db["repos"].insert_one(new_repo.model_dump(by_alias=True, exclude={"id"}))
            repo_id = result.inserted_id
            
            # Add to user's repo list
            await db["users"].update_one(
                {"_id": user.id},
                {"$push": {"repos": str(repo_id)}}
            )
            
        # Trigger background analysis
        background_tasks.add_task(
            RepoController._perform_analysis, 
            repo_id, 
            repo_url, 
            str(user.id), 
            decrypted_key
        )
        
        return {"message": "Analysis started", "repo_id": str(repo_id)}

    @staticmethod
    async def get_repo(repo_id: str, user: User):
        db = await get_database()
        try:
            oid = ObjectId(repo_id)
        except:
            raise HTTPException(status_code=400, detail="Invalid repository ID")
            
        repo = await db["repos"].find_one({"_id": oid, "user_id": str(user.id)})
        if not repo:
            raise HTTPException(status_code=404, detail="Repository not found")
        return Repo(**repo)

    @staticmethod
    async def delete_repo(repo_id: str, user: User):
        db = await get_database()
        try:
            oid = ObjectId(repo_id)
        except:
            raise HTTPException(status_code=400, detail="Invalid repository ID")
            
        # Verify repo belongs to user
        repo = await db["repos"].find_one({"_id": oid, "user_id": str(user.id)})
        if not repo:
            raise HTTPException(status_code=404, detail="Repository not found")
            
        # Delete from repos collection
        await db["repos"].delete_one({"_id": oid})
        
        # Remove from user's repo list
        await db["users"].update_one(
            {"_id": user.id},
            {"$pull": {"repos": str(repo_id)}}
        )
        
        return {"message": "Repository deleted successfully"}

    @staticmethod
    async def get_user_repos(user: User):
        db = await get_database()
        # Exclude file_structure for compact list
        cursor = db["repos"].find({"user_id": str(user.id)}, {"file_structure": 0})
        repos = await cursor.to_list(length=100)
        return [Repo(**repo) for repo in repos]

    @staticmethod
    async def get_contributors(repo_id: str, user: User):
        repo = await RepoController.get_repo(repo_id, user)
        try:
            contributors = await GitHubService.get_contributors(repo.repo_url)
            return [
                {
                    "name": c["login"],
                    "avatar_url": c["avatar_url"],
                    "html_url": c["html_url"],
                    "contributions": c["contributions"]
                }
                for c in contributors
            ]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch contributors: {str(e)}")

    @staticmethod
    async def get_file_content(repo_id: str, file_path: str, user: User):
        repo = await RepoController.get_repo(repo_id, user)
        try:
            content_data = await GitHubService.get_file_content(repo.repo_url, file_path)
            
            if content_data.get("encoding") == "base64":
                import base64
                content = base64.b64decode(content_data["content"]).decode("utf-8")
                return {"content": content, "path": file_path}
            else:
                return {"content": str(content_data), "path": file_path}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch file content: {str(e)}")

    @staticmethod
    async def analyze_file(repo_id: str, file_path: str, user: User):
        db = await get_database()
        repo = await RepoController.get_repo(repo_id, user)
        
        # Get LLM Key
        key_doc = await db["llm_keys"].find_one({"user_id": str(user.id)})
        if not key_doc:
            raise HTTPException(status_code=400, detail="Missing LLM key")
        decrypted_key = EncryptionService.decrypt(key_doc["api_key"])
        
        try:
            # Fetch content
            # Reuse the logic or call the service directly. 
            # Since we need the content string for LLM, let's just call the service to avoid double decoding overhead if we were to call get_file_content
            content_data = await GitHubService.get_file_content(repo.repo_url, file_path)
            
            if content_data.get("encoding") == "base64":
                import base64
                file_content = base64.b64decode(content_data["content"]).decode("utf-8")
            else:
                file_content = str(content_data)
                
            # Check Cache
            content_hash = CacheService.compute_hash(file_content)
            cached_analysis = CacheService.get_analysis(content_hash)
            
            if cached_analysis:
                print(f"Cache hit for {file_path}")
                return cached_analysis
                
            # Analyze
            analysis = await LLMService.analyze_code_file(decrypted_key, file_content, file_path)
            
            # Save to Cache
            CacheService.save_analysis(content_hash, analysis, file_content, "file_analysis")
            
            return analysis
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to analyze file: {str(e)}")
    @staticmethod
    def _build_nested_tree(flat_items):
        tree = []
        lookup = {} # path -> item
        
        # Sort by path length to ensure parents are processed before children? 
        # Actually, GitHub returns full paths.
        # We can build a trie-like structure or just iterate.
        
        # Let's use a dictionary to build the hierarchy
        root = {"name": "root", "type": "folder", "children": []}
        
        # Sort items so folders come before files if needed, or just process
        # GitHub tree usually has all items.
        
        # Create a map for easy access
        # But we need to build the structure.
        
        # Let's iterate and build nodes
        nodes = {}
        
        # First pass: create all nodes
        for item in flat_items:
            path = item["path"]
            name = path.split("/")[-1]
            node = {
                "name": name,
                "path": path,
                "type": "folder" if item["type"] == "tree" else "file",
                "size": item.get("size"),
                "sha": item.get("sha"),
                "children": [] if item["type"] == "tree" else None
            }
            nodes[path] = node
            
        # Second pass: link children to parents
        top_level = []
        for path, node in nodes.items():
            parts = path.split("/")
            if len(parts) == 1:
                top_level.append(node)
            else:
                parent_path = "/".join(parts[:-1])
                if parent_path in nodes:
                    if nodes[parent_path]["children"] is None:
                         nodes[parent_path]["children"] = []
                    nodes[parent_path]["children"].append(node)
                else:
                    # Parent might not be explicitly in the tree (sometimes happens with sparse trees?)
                    # But for GitHub recursive tree, it should be there. 
                    # If not, treat as top level? Or create implicit parent?
                    # Let's assume standard GitHub behavior where tree objects exist.
                    # If missing, we add to top level for safety to avoid losing files.
                    top_level.append(node)
                    
        return top_level

    @staticmethod
    async def get_file_structure(repo_id: str, user: User):
        repo = await RepoController.get_repo(repo_id, user)
        if not repo.file_structure or "tree" not in repo.file_structure:
            return []
            
        return RepoController._build_nested_tree(repo.file_structure["tree"])
