import re
from typing import Dict, Any, List
from app.models.schemas import AIChatRequest, AIChatResponse
from app.services.ai.retrieval import ai_retrieval_engine
from app.services.ai.context_builder import ContextBuilder
from app.services.ai.prompt_templates import VIRASAT_SYSTEM_PROMPT, generate_cultural_prompt
from app.services.ai.provider import ai_provider

class AIChatService:
    """
    VIRASAT AI Cultural Guide Orchestrator.
    Manages end-to-end grounded query execution:
    User Query -> Intent & Language -> Entity Extraction -> DB Retrieval
    -> Context Building -> Generation -> Source Attachment -> Follow-ups.
    """
    def __init__(
        self,
        retrieval=ai_retrieval_engine,
        provider=ai_provider
    ):
        self.retrieval = retrieval
        self.provider = provider

    def detect_language(self, text: str, preferred: str = "en") -> str:
        if preferred in ["hi", "hinglish"]:
            return preferred

        # Check for Devanagari script
        if re.search(r'[\u0900-\u097F]', text):
            return "hi"

        # Check for common Hinglish tokens
        hinglish_words = {"kya", "hai", "batao", "kaise", "ke", "ki", "ka", "me", "mein", "aur", "toh", "namaste"}
        words = set(re.findall(r'\b[a-z]+\b', text.lower()))
        if len(words.intersection(hinglish_words)) >= 2:
            return "hinglish"

        return "en"

    def process_chat(self, req: AIChatRequest) -> AIChatResponse:
        user_query = req.message.strip()
        lang = self.detect_language(user_query, req.preferred_language)

        # 1. Retrieve relevant records from central database
        records, sources = self.retrieval.extract_entities_and_retrieve(
            user_query,
            context_record_id=req.context_record_id
        )

        is_grounded = len(records) > 0

        # 2. Build context
        context_block = ContextBuilder.build_context_block(records)

        # 3. Generate prompt
        prompt = generate_cultural_prompt(user_query, context_block, language=lang)

        # 4. Generate response via configured provider
        raw_response = self.provider.generate_response(
            prompt=prompt,
            system_instruction=VIRASAT_SYSTEM_PROMPT,
            retrieved_records=records,
            language=lang
        )

        # 5. Formulate contextual follow-up suggestions
        suggestions: List[str] = []
        if records:
            primary_name = records[0].get("name") or records[0].get("title", "")
            state_name = records[0].get("state", "")
            if lang == "hi":
                suggestions.append(f"{primary_name} का सांस्कृतिक व ऐतिहासिक महत्व क्या है?")
                suggestions.append(f"{state_name} के प्रमुख पारंपरिक हस्तशिल्प और कलाएं कौन सी हैं?")
                suggestions.append(f"{primary_name} से जुड़ी लोक कथाएं बताएं।")
            elif lang == "hinglish":
                suggestions.append(f"{primary_name} ka historical significance kya hai?")
                suggestions.append(f"{state_name} ke traditional arts and crafts explore karein.")
                suggestions.append(f"{primary_name} se connected cultural experiences batao.")
            else:
                suggestions.append(f"What is the historical significance of {primary_name}?")
                suggestions.append(f"What traditional crafts are indigenous to {state_name}?")
                suggestions.append(f"Show cultural experiences connected to {primary_name}.")
        else:
            if lang == "hi":
                suggestions.append("छठ पूजा की वैदिक परंपराओं के बारे में बताएं।")
                suggestions.append("हम्पी के विट्ठल मंदिर के संगीतमय स्तंभों का रहस्य क्या है?")
                suggestions.append("मधुबनी चित्रकला की तकनीक समझाएं।")
            elif lang == "hinglish":
                suggestions.append("Chhath Puja ki Vedic traditions ke baare me batao.")
                suggestions.append("Hampi ke musical pillars ki history explain karein.")
                suggestions.append("Madhubani art ki GI status aur technique kya hai?")
            else:
                suggestions.append("Explain the Vedic significance of Chhath Puja.")
                suggestions.append("Tell me about the musical pillars of Vittala Temple, Hampi.")
                suggestions.append("How is Jaipur Blue Pottery traditionally crafted without clay?")

        return AIChatResponse(
            response=raw_response,
            grounded_in_database=is_grounded,
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
            language_detected=lang
        )

ai_chat_service = AIChatService()
