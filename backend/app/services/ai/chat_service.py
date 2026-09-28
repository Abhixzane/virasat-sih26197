import re
from typing import Dict, Any, List, Optional
from app.models.schemas import AIChatRequest, AIChatResponse, PlaceCardData, UIAction
from app.services.ai.retrieval import ai_retrieval_engine
from app.services.ai.context_builder import ContextBuilder
from app.services.ai.prompt_templates import VIRASAT_SYSTEM_PROMPT, generate_cultural_prompt
from app.services.ai.provider import ai_provider
from app.services.ai.local_companion_engine import local_companion_engine

class AIChatService:
    """
    VIRASAT Universal AI Cultural Travel Companion Orchestrator.
    Manages end-to-end grounded query execution across 12 modules:
    - Language detection (English, Hindi, Hinglish)
    - Intent recognition (Greeting, Memory, Routing, Nearby, Itinerary, Actions, Entity inquiry)
    - Grounded Database Retrieval & Proximity discovery
    - Hybrid AI generation (Gemini LLM when available + Intelligent Local Companion Engine fallback)
    - Universal interactive cards (PlaceCard, RouteCard, ItineraryCard, UIAction)
    """
    def __init__(
        self,
        retrieval=ai_retrieval_engine,
        provider=ai_provider,
        companion_engine=local_companion_engine
    ):
        self.retrieval = retrieval
        self.provider = provider
        self.companion = companion_engine

    def detect_language(self, text: str, preferred: Optional[str] = "en") -> str:
        if preferred in ["hi", "hinglish"]:
            return preferred

        # Check for Devanagari script
        if re.search(r'[\u0900-\u097F]', text):
            return "hi"

        # Check for common Hinglish tokens
        hinglish_words = {
            "kya", "hai", "hain", "batao", "kaise", "kahan", "ke", "ki", "ka", 
            "me", "mein", "aur", "toh", "namaste", "ghoomna", "jaana", "chahiye",
            "karein", "karo", "pehle", "woh", "wahan", "paas", "bhi", "yeh"
        }
        words = set(re.findall(r'\b[a-z]+\b', text.lower()))
        if len(words.intersection(hinglish_words)) >= 1:
            return "hinglish"

        return "en"

    def process_chat(self, req: AIChatRequest) -> AIChatResponse:
        user_query = req.message.strip()
        lang = self.detect_language(user_query, req.preferred_language)

        # 1. Retrieve relevant records from central database
        records, sources = self.retrieval.extract_entities_and_retrieve(
            user_query,
            context_record_id=req.context_record_id,
            conversation_history=req.conversation_history
        )

        q_lower = user_query.lower()

        # 2. Check for specialized intents that the Companion Engine resolves natively
        # (Greetings, Memory settings, Route planning, Itinerary creation & live edits, Nearby discovery, Direct Actions)
        is_greeting = self.companion._is_greeting_or_chitchat(user_query)
        is_memory_cmd = any(w in q_lower for w in ["home city", "budget", "preferences", "clear memory", "forget", "profile", "rehta hoon", "vegetarian", "pure veg", "solo", "luxury", "shakahari"])
        is_itinerary_mod = bool(req.active_itinerary) or any(w in q_lower for w in ["day 1", "day 2", "day 3", "din 1", "din 2", "budget 8000", "temple add", "market add", "relax", "hata do", "senior", "bache", "bachon"])
        is_itinerary_gen = bool(re.search(r'\b(?:\d+\s*(?:day|days|din|दिन)|itinerary|tour\s*plan|trip\s*plan|travel\s*plan|circuit)\b', q_lower)) or any(w in q_lower for w in ["itinerary", "din ka plan", "day plan", "days"])
        is_route_query = bool(self.companion.routes.extract_route_pair(user_query))
        is_nearby_query = any(w in q_lower for w in ["nearby", "near", "paas mein", "paas", "ke paas", "aaspas", "around"]) or bool(req.user_coordinates)
        is_direct_action = bool(self.companion._check_direct_action(user_query, lang))

        # If any of these conversational capabilities are triggered, or if LLM client is unavailable,
        # use the companion engine
        if (is_greeting or is_memory_cmd or is_route_query or is_nearby_query or 
            is_itinerary_mod or is_itinerary_gen or is_direct_action or 
            not (self.provider.client and self.provider.api_key)):
            return self.companion.handle_conversation(req, records, sources, lang)

        # 3. For cultural inquiries with active LLM provider (Google Gemini)
        context_block = ContextBuilder.build_context_block(records)
        prompt = generate_cultural_prompt(user_query, context_block, language=lang)

        # If user memory preferences exist, inject personalization context
        if req.user_memory:
            mem_summary = f"\nUser Preferences: Home City={req.user_memory.get('home_city')}, Budget={req.user_memory.get('budget_tier')}, Style={req.user_memory.get('travel_style')}."
            prompt += mem_summary

        try:
            raw_response = self.provider.generate_response(
                prompt=prompt,
                system_instruction=VIRASAT_SYSTEM_PROMPT,
                retrieved_records=records,
                language=lang,
                user_query=user_query
            )
        except Exception:
            # Safe graceful degradation to local companion engine
            return self.companion.handle_conversation(req, records, sources, lang)

        # Build cards and follow-up suggestions
        places_cards: List[PlaceCardData] = []
        for r in records[:3]:
            places_cards.append(PlaceCardData(
                id=r.get("id", ""),
                name=r.get("name") or r.get("title", ""),
                type=r.get("_entity_type", "heritage"),
                state=r.get("state", "India"),
                district=r.get("city") or r.get("district") or r.get("origin"),
                category=r.get("category") or r.get("craft_category"),
                image_url=r.get("image_url"),
                description=(r.get("description") or r.get("narrative", ""))[:180] + "...",
                latitude=r.get("latitude"),
                longitude=r.get("longitude"),
                action_label="Explore Record"
            ))

        suggestions: List[str] = []
        if records:
            primary_name = (records[0].get("name") or records[0].get("title", "")).split(',')[0]
            state_name = records[0].get("state", "India")
            if lang == "hi":
                suggestions.append(f"{primary_name} का वास्तुशिल्प व सांस्कृतिक महत्व बताएं।")
                suggestions.append(f"{state_name} के प्रमुख पारंपरिक GI हस्तशिल्प कौन से हैं?")
                suggestions.append(f"{primary_name} के आसपास दर्शनीय स्थलों की सूची दें।")
            elif lang == "hinglish":
                suggestions.append(f"{primary_name} ka architecture aur significance explain karein.")
                suggestions.append(f"{state_name} ke famous GI-tagged crafts kaunse hain?")
                suggestions.append(f"{primary_name} ke paas 1-day itinerary banayein.")
            else:
                suggestions.append(f"What is the architectural significance of {primary_name}?")
                suggestions.append(f"What traditional crafts are indigenous to {state_name}?")
                suggestions.append(f"Plan a 1-day heritage circuit around {primary_name}.")

        actions: List[UIAction] = []
        if records and records[0].get("latitude") and records[0].get("longitude"):
            actions.append(UIAction(
                action="SHOW_ON_MAP",
                path="/cultural-map",
                params={"lat": records[0]["latitude"], "lng": records[0]["longitude"], "id": records[0].get("id")},
                label=f"View on Cultural Map"
            ))

        return AIChatResponse(
            response=raw_response,
            grounded_in_database=len(records) > 0,
            retrieved_records=[
                {
                    "id": r.get("id"),
                    "name": r.get("name") or r.get("title"),
                    "type": r.get("_entity_type"),
                    "state": r.get("state")
                }
                for r in records
            ],
            source_references=sources,
            suggested_follow_ups=suggestions[:3],
            language_detected=lang,
            intent_detected="CULTURAL_ENTITY_QUERY",
            places_cards=places_cards,
            actions=actions
        )

ai_chat_service = AIChatService()
