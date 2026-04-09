from langchain_google_genai import ChatGoogleGenerativeAI
from app.utils.exceptions import LLMError
from langchain_core.messages import HumanMessage

class LangChainWrapper:
    def __init__(self, api_key: str, model: str = "gemini-2.5-flash"):
        if not api_key:
            raise LLMError("API key is required")
        try:
            self.llm = ChatGoogleGenerativeAI(model=model, google_api_key=api_key)
        except Exception as e:
            raise LLMError(f"Failed to initialize LLM: {str(e)}")

    async def generate(self, prompt: str) -> str:
        try:
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            return response.content
        except Exception as e:
            raise LLMError(f"LLM generation failed: {str(e)}")
