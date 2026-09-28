"""
VIRASAT AI Context Manager
Maintains multi-turn conversational memory, user profile preferences, and pronoun/anaphora resolution.
"""

import re
from typing import Dict, Any, List, Optional
from app.models.schemas import ChatMessage, AIChatResponse, AIChatRequest

class ContextManager:
    """Manages conversational memory, traveler preferences, and historical turn resolution."""

    def resolve_destination_from_history(
        self,
        conversation_history: List[ChatMessage],
        known_cities: Dict[str, Any],
        exclude_city: Optional[str] = None
    ) -> Optional[str]:
        """Scans conversation history in reverse to identify the active destination discussed."""
        if not conversation_history:
            return None

        # Prioritize user turns
        for msg in reversed(conversation_history):
            if getattr(msg, 'role', '') == 'user':
                text = msg.content.lower()
                for ckey, cinfo in known_cities.items():
                    if exclude_city and ckey == exclude_city.lower():
                        continue
                    # Skip cities explicitly mentioned as origins
                    if re.search(rf'\b{ckey}\s+se\b', text) or re.search(rf'\bfrom\s+{ckey}\b', text):
                        continue
                    if ckey in text or cinfo['name'].lower() in text:
                        return ckey

        # Fallback to assistant messages
        for msg in reversed(conversation_history):
            text = msg.content.lower()
            for ckey, cinfo in known_cities.items():
                if exclude_city and ckey == exclude_city.lower():
                    continue
                if re.search(rf'\b{ckey}\s+se\b', text) or re.search(rf'\bfrom\s+{ckey}\b', text):
                    continue
                if ckey in text or cinfo['name'].lower() in text:
                    return ckey

        return None

    def process_memory_commands(self, req: AIChatRequest, lang: str) -> Optional[AIChatResponse]:
        """Handles explicit user memory commands: inspect, update, or clear."""
        q = req.message.lower().strip()

        # 1. Clear Memory
        if any(w in q for w in ["clear memory", "forget me", "forget my preferences", "mera data bhool jao", "delete memory"]):
            msg = (
                "आपकी सभी व्यक्तिगत प्राथमिकताओं को सफलतापूर्वक हटा दिया गया है।" if lang == "hi"
                else "Aapki saari saved memory (home city, budget, travel style) successfully clear kar di gayi hai!" if lang == "hinglish"
                else "All remembered preferences (home city, budget tier, travel style) have been permanently cleared."
            )
            return AIChatResponse(
                response=msg,
                grounded_in_database=True,
                language_detected=lang,
                intent_detected="USER_MEMORY_CLEAR",
                memory_updates={"_action": "CLEAR"}
            )

        # 2. Inspect Memory
        if any(w in q for w in ["what do you know about me", "show my preferences", "show memory", "meri preferences kya hain", "saved profile"]):
            mem = req.user_memory or {}
            hc = mem.get("home_city", "Not set")
            bg = mem.get("budget_tier", "Moderate")
            st = mem.get("travel_style", "Cultural Explorer")
            dp = mem.get("dietary_pref", "Flexible")

            msg = (
                f"### 📋 आपकी सहेजी गई प्राथमिकताएं:\n- गृह नगर: {hc}\n- बजट: {bg}\n- शैली: {st}\n- भोजन: {dp}" if lang == "hi"
                else f"### 📋 Aapki Saved Preferences:\n- Home City: {hc}\n- Budget: {bg}\n- Style: {st}\n- Food: {dp}" if lang == "hinglish"
                else f"### 📋 Your Remembered Profile:\n- Home City: {hc}\n- Budget: {bg}\n- Style: {st}\n- Food: {dp}"
            )
            return AIChatResponse(
                response=msg,
                grounded_in_database=True,
                language_detected=lang,
                intent_detected="USER_MEMORY_INSPECT"
            )

        # 3. Set Home City
        hc_match = re.search(r'(?:mera|my)\s+home\s*city\s+(?:is|hai|set\s+kardo|kardo)?\s*([a-zA-Z\u0900-\u097F]+)', q)
        if not hc_match:
            hc_match = re.search(r'i\s+(?:live|stay)\s+in\s+([a-zA-Z\u0900-\u097F]+)', q)
        if not hc_match:
            hc_match = re.search(r'main\s+([a-zA-Z\u0900-\u097F]+)\s+(?:se|mein\s+rehta)\s+hoon', q)

        if hc_match:
            city_name = hc_match.group(1).strip().title()
            msg = (
                f"बहुत बढ़िया! मैंने आपका गृह नगर **{city_name}** के रूप में सुरक्षित कर लिया है।" if lang == "hi"
                else f"Bahut badiya! Maine aapka home city **{city_name}** save kar liya hai." if lang == "hinglish"
                else f"Excellent! I have recorded **{city_name}** as your home departure city."
            )
            return AIChatResponse(
                response=msg,
                grounded_in_database=True,
                language_detected=lang,
                intent_detected="USER_MEMORY_UPDATE",
                memory_updates={"home_city": city_name}
            )

        return None

context_manager = ContextManager()
