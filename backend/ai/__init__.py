"""
VIRASAT AI Modular Intelligence Package
10 Core Categories x 10 Response Styles x 10 Complexity Levels = 1,000 Prompt Combinations.
"""

from app.services.ai.orchestrator import AIOrchestrator, ai_orchestrator
from app.services.ai.system_prompt import VIRASAT_MASTER_SYSTEM_PROMPT, PromptIntelligenceEngine, prompt_intelligence_engine
from app.services.ai.intent_classifier import IntentClassifier, intent_classifier
from app.services.ai.entity_resolver import EntityResolver, entity_resolver
from app.services.ai.context_manager import ContextManager, context_manager
from app.services.ai.database_retriever import DatabaseRetriever, database_retriever
from app.services.ai.recommendation_engine import RecommendationEngine, recommendation_engine
from app.services.ai.itinerary_generator import ItineraryGenerator, itinerary_generator
from app.services.ai.map_assistant import MapAssistant, map_assistant
from app.services.ai.response_formatter import ResponseFormatter, response_formatter
from app.services.ai.verification import VerificationService, verification_service

__all__ = [
    "AIOrchestrator", "ai_orchestrator",
    "VIRASAT_MASTER_SYSTEM_PROMPT", "PromptIntelligenceEngine", "prompt_intelligence_engine",
    "IntentClassifier", "intent_classifier",
    "EntityResolver", "entity_resolver",
    "ContextManager", "context_manager",
    "DatabaseRetriever", "database_retriever",
    "RecommendationEngine", "recommendation_engine",
    "ItineraryGenerator", "itinerary_generator",
    "MapAssistant", "map_assistant",
    "ResponseFormatter", "response_formatter",
    "VerificationService", "verification_service"
]
