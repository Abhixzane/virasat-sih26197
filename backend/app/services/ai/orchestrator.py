"""
VIRASAT Master AI Orchestrator
Coordinates intent classification, entity resolution, database retrieval, contextual memory,
routing, map assistance, prompt matrix synthesis, response formatting, and factual verification.
"""

from typing import Dict, Any, List, Optional
from app.models.schemas import AIChatRequest, AIChatResponse
from app.services.ai.intent_classifier import intent_classifier
from app.services.ai.entity_resolver import entity_resolver
from app.services.ai.database_retriever import database_retriever
from app.services.ai.context_manager import context_manager
from app.services.ai.recommendation_engine import recommendation_engine
from app.services.ai.itinerary_generator import itinerary_generator
from app.services.ai.map_assistant import map_assistant
from app.services.ai.system_prompt import prompt_intelligence_engine, VIRASAT_MASTER_SYSTEM_PROMPT
from app.services.ai.response_formatter import response_formatter
from app.services.ai.verification import verification_service
from app.services.ai.local_companion_engine import local_companion_engine
from app.services.ai.provider import ai_provider

class AIOrchestrator:
    """Master controller managing the end-to-end VIRASAT AI Cultural Companion pipeline."""

    def __init__(
        self,
        classifier=intent_classifier,
        resolver=entity_resolver,
        retriever=database_retriever,
        context=context_manager,
        recommender=recommendation_engine,
        itinerary=itinerary_generator,
        map_assist=map_assistant,
        prompt_engine=prompt_intelligence_engine,
        formatter=response_formatter,
        verification=verification_service,
        companion=local_companion_engine,
        provider=ai_provider
    ):
        self.classifier = classifier
        self.resolver = resolver
        self.retriever = retriever
        self.context = context
        self.recommender = recommender
        self.itinerary = itinerary
        self.map_assist = map_assist
        self.prompt_engine = prompt_engine
        self.formatter = formatter
        self.verification = verification
        self.companion = companion
        self.provider = provider

    def process_chat(self, req: AIChatRequest) -> AIChatResponse:
        user_query = req.message.strip()
        lang = self.classifier.detect_language(user_query, req.preferred_language)

        # 1. Intent, Category, Response Style, and Complexity Classification
        history_len = len(req.conversation_history) if req.conversation_history else 0
        has_active_itin = bool(req.active_itinerary)
        intent_info = self.classifier.classify(
            user_query,
            history_len=history_len,
            has_active_itinerary=has_active_itin
        )

        # 2. Check for explicit memory commands
        mem_resp = self.context.process_memory_commands(req, lang)
        if mem_resp:
            return mem_resp

        # 3. Retrieve verified database records and official sources
        records, sources = self.retriever.retrieve(
            query=user_query,
            context_record_id=req.context_record_id,
            conversation_history=req.conversation_history
        )

        sources = self.verification.sanitize_and_verify_sources(sources)

        # 4. Check if LLM provider is active (Gemini API)
        if self.provider and self.provider.client and self.provider.api_key:
            # Build specialized prompt from the 1,000 prompt matrix
            specialized_prompt = self.prompt_engine.build_prompt(
                category=intent_info.get("category", "heritage"),
                style=intent_info.get("response_style", "conversational"),
                complexity=intent_info.get("complexity", "6_personalized"),
                user_query=user_query,
                context_data={"retrieved_count": len(records), "top_record": records[0] if records else None},
                language=lang
            )

            try:
                raw_resp = self.provider.generate_response(
                    prompt=specialized_prompt,
                    system_instruction=VIRASAT_MASTER_SYSTEM_PROMPT,
                    retrieved_records=records,
                    language=lang,
                    user_query=user_query
                )
                if raw_resp and raw_resp.response:
                    return raw_resp
            except Exception:
                # Safe graceful fallback to local companion engine
                pass

        # 5. Core Grounded Companion Execution (Handles routing, single destinations, itineraries, nearby, monuments)
        return self.companion.handle_conversation(req, records, sources, lang)

ai_orchestrator = AIOrchestrator()
