from app.services.langchain_wrapper import LangChainWrapper
from app.utils.exceptions import LLMError
import json

class LLMService:
    @staticmethod
    async def summarize_repo(api_key: str, repo_data: dict) -> dict:
        wrapper = LangChainWrapper(api_key)
        
        # Simplify repo data to avoid token limits
        simplified_data = {
            "name": repo_data.get("name"),
            "description": repo_data.get("description"),
            "topics": repo_data.get("topics"),
            "language": repo_data.get("language"),
            "file_structure_summary": "See file tree" # We might want to pass a summarized tree here
        }
        
        prompt = f"""
        Analyze the following GitHub repository data: {json.dumps(simplified_data)}. 
        1. Summarize what it does in 2-3 sentences.
        2. List the key technologies used.
        3. List the key functionalities or modules.
        
        Return the response in strict JSON format:
        {{
            "summary": "...",
            "technologies": ["tech1", "tech2"],
            "functions": ["func1", "func2"]
        }}
        """
        
        try:
            response = await wrapper.generate(prompt)
            # Clean up response if it contains markdown code blocks
            response = response.replace("```json", "").replace("```", "").strip()
            return json.loads(response)
        except json.JSONDecodeError:
            raise LLMError("Failed to parse LLM response")
        except Exception as e:
            raise LLMError(f"Repo summarization failed: {str(e)}")

    @staticmethod
    async def generate_commit_story(api_key: str, commit_message: str, diff: str = "") -> str:
        wrapper = LangChainWrapper(api_key)
        
        prompt = f"""
        Explain this commit in simple, storytelling terms. 
        Commit Message: {commit_message}
        
        Keep it short (max 2 sentences) and engaging.
        """
        
        return await wrapper.generate(prompt)

    @staticmethod
    async def generate_project_narrative(api_key: str, commits: list) -> str:
        wrapper = LangChainWrapper(api_key)
        
        # Format commits for the prompt
        commit_history = ""
        for c in commits:
            commit_history += f"- {c['date'].strftime('%Y-%m-%d')}: {c['author']} - {c['message']}\n"
            
        prompt = f"""
        Based on the following commit history, write a cohesive narrative story about how this project evolved.
        Start from the beginning and describe the journey of the project. Mention key contributors and major features added over time.
        
        Commit History:
        {commit_history}
        
        Write it as an engaging story (approx 2-3 paragraphs).
        """
        
        return await wrapper.generate(prompt)

    @staticmethod
    async def analyze_code_file(api_key: str, file_code: str, filename: str) -> dict:
        wrapper = LangChainWrapper(api_key)
        
        prompt = f"""
        Analyze the following code file: {filename}
        
        Code Content:
        {file_code[:10000]} 
        (Truncated if too long)
        
        List all functions/methods. For each, provide:
        1. Name
        2. Parameters
        3. A strict, technical explanation of what it does (no dramatic language).
        
        Return strict JSON format:
        {{
            "functions": [
                {{
                    "name": "function_name",
                    "parameters": "param1: type, param2: type (or 'None' if empty)",
                    "description": "Technical description here."
                }}
            ]
        }}
        """
        
        try:
            response = await wrapper.generate(prompt)
            response = response.replace("```json", "").replace("```", "").strip()
            return json.loads(response)
        except Exception as e:
            raise LLMError(f"File analysis failed: {str(e)}")
