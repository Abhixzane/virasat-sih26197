from fastapi import APIRouter
from app.models.schemas import AIChatRequest, AIChatResponse
from app.services.ai.chat_service import ai_chat_service

router = APIRouter()

@router.post("/ai/chat", response_model=AIChatResponse)
def chat_with_cultural_guide(req: AIChatRequest):
    """
    VIRASAT AI Cultural Guide Chat endpoint.
    Performs language detection, entity extraction, central database retrieval,
    factual grounding, response generation, and source attribution.
    """
    return ai_chat_service.process_chat(req)
