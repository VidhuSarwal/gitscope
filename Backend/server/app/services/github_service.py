import httpx
from app.config import get_settings
from app.utils.exceptions import GitHubAPIError

settings = get_settings()

class GitHubService:
    BASE_URL = "https://api.github.com"

    @staticmethod
    def _get_headers():
        headers = {"Accept": "application/vnd.github.v3+json"}
        if settings.GITHUB_TOKEN:
            headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"
        return headers

    @staticmethod
    def _parse_repo_url(repo_url: str):
        # Expected format: https://github.com/owner/repo
        parts = repo_url.rstrip("/").split("/")
        if len(parts) < 2:
            raise GitHubAPIError("Invalid repository URL", 400)
        return parts[-2], parts[-1]

    @staticmethod
    async def get_repo_metadata(repo_url: str):
        owner, repo = GitHubService._parse_repo_url(repo_url)
        url = f"{GitHubService.BASE_URL}/repos/{owner}/{repo}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=GitHubService._get_headers())
            
            if response.status_code == 404:
                raise GitHubAPIError("Repository not found", 404)
            if response.status_code == 403:
                raise GitHubAPIError("Access denied or rate limit exceeded", 403)
            if response.status_code != 200:
                raise GitHubAPIError(f"GitHub API error: {response.text}", response.status_code)
                
            return response.json()

    @staticmethod
    async def get_file_tree(repo_url: str):
        owner, repo = GitHubService._parse_repo_url(repo_url)
        # Get default branch first
        metadata = await GitHubService.get_repo_metadata(repo_url)
        default_branch = metadata.get("default_branch", "main")
        
        url = f"{GitHubService.BASE_URL}/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=GitHubService._get_headers())
            
            if response.status_code != 200:
                raise GitHubAPIError(f"Failed to fetch file tree: {response.text}", response.status_code)
                
            return response.json()

    @staticmethod
    async def get_commits(repo_url: str, limit: int = 20):
        owner, repo = GitHubService._parse_repo_url(repo_url)
        url = f"{GitHubService.BASE_URL}/repos/{owner}/{repo}/commits?per_page={limit}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=GitHubService._get_headers())
            
            if response.status_code != 200:
                raise GitHubAPIError(f"Failed to fetch commits: {response.text}", response.status_code)
                
            return response.json()

    @staticmethod
    async def get_contributors(repo_url: str):
        owner, repo = GitHubService._parse_repo_url(repo_url)
        url = f"{GitHubService.BASE_URL}/repos/{owner}/{repo}/contributors"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=GitHubService._get_headers())
            
            if response.status_code != 200:
                raise GitHubAPIError(f"Failed to fetch contributors: {response.text}", response.status_code)
                
            return response.json()

    @staticmethod
    async def get_file_content(repo_url: str, file_path: str):
        owner, repo = GitHubService._parse_repo_url(repo_url)
        url = f"{GitHubService.BASE_URL}/repos/{owner}/{repo}/contents/{file_path}"
        
        async with httpx.AsyncClient() as client:
            # Use raw header to get raw content if needed, but standard API returns base64
            # Let's use standard API and decode
            response = await client.get(url, headers=GitHubService._get_headers())
            
            if response.status_code != 200:
                raise GitHubAPIError(f"Failed to fetch file content: {response.text}", response.status_code)
                
            return response.json()
