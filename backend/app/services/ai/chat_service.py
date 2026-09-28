"""
VIRASAT AI Chat Service
Main entry point for AI chat interactions.
Delegates to the modular AIOrchestrator connecting all 11 intelligence modules and 1,000 prompt matrix.
"""

from typing import Optional
from app.models.schemas import AIChatRequest, AIChatResponse
from app.services.ai.orchestrator import ai_orchestrator, AIOrchestrator

class AIChatService:
    """Delegates chat processing to the modular AI Orchestrator."""

    def __init__(self, orchestrator: AIOrchestrator = ai_orchestrator):
        self.orchestrator = orchestrator

    def detect_language(self, text: str, preferred: Optional[str] = "en") -> str:
        return self.orchestrator.classifier.detect_language(text, preferred)

    def process_chat(self, req: AIChatRequest) -> AIChatResponse:
        return self.orchestrator.process_chat(req)

ai_chat_service = AIChatService()
