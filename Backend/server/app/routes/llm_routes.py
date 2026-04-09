from fastapi import APIRouter
from app.controllers.llm_controller import LLMController

router = APIRouter(prefix="/api/llm", tags=["LLM"])

@router.get("/models")
def get_available_models():
    return LLMController.get_available_models()
