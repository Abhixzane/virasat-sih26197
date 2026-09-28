"""
VIRASAT AI Intent Classifier
Accurately categorizes queries into the 10 Core Categories, selects the best Response Style,
and determines Complexity Level (1 to 10).
"""

import re
from typing import Dict, Any, Tuple, Optional

class IntentClassifier:
    """Classifies user inquiries into structured intent, category, response style, and complexity."""

    def detect_language(self, text: str, preferred: Optional[str] = "en") -> str:
        if preferred in ["hi", "hinglish"]:
            return preferred
        if re.search(r'[\u0900-\u097F]', text):
            return "hi"
        hinglish_words = {
            "kya", "hai", "hain", "batao", "kaise", "kahan", "ke", "ki", "ka", 
            "me", "mein", "aur", "toh", "namaste", "ghoomna", "jaana", "chahiye",
            "karein", "karo", "pehle", "woh", "wahan", "paas", "bhi", "yeh", "humko", "mujhe"
        }
        words = set(re.findall(r'\b[a-z]+\b', text.lower()))
        if len(words.intersection(hinglish_words)) >= 1:
            return "hinglish"
        return "en"

    def classify(self, text: str, history_len: int = 0, has_active_itinerary: bool = False) -> Dict[str, Any]:
        q = text.lower().strip()

        # 1. Check for Itinerary Modification
        if has_active_itinerary and any(w in q for w in [
            "add", "jodo", "change", "modify", "budget", "relax", "market", "temple",
            "hata", "remove", "slow", "pace", "senior", "bache", "family", "kids", "day 1", "day 2", "day 3"
        ]):
            return {
                "category": "itinerary",
                "functional_intent": "ITINERARY_MODIFY",
                "response_style": "interactive_workflow",
                "complexity": "10_advanced_agent"
            }

        # 2. Check for Greetings & Social Chit-chat
        is_greeting = any(w in q for w in [
            "hi", "hello", "hey", "namaste", "namaskar", "pranam", "khammaghani",
            "sasrikal", "adaab", "kaise ho", "kya haal", "who are you", "aap kaun ho",
            "thanks", "thank you", "dhanyawad", "shukriya", "bye", "alvida", "phir milenge"
        ]) and len(q.split()) <= 6
        if is_greeting:
            return {
                "category": "conversation",
                "functional_intent": "GREETING_OR_CHITCHAT",
                "response_style": "conversational",
                "complexity": "1_beginner"
            }

        # 3. Check for Personalization & Memory
        if any(w in q for w in ["home city", "budget", "preferences", "clear memory", "forget", "profile", "rehta hoon", "vegetarian", "pure veg", "solo explorer", "family trip"]):
            return {
                "category": "personalization",
                "functional_intent": "USER_MEMORY_COMMAND",
                "response_style": "conversational",
                "complexity": "6_personalized"
            }

        # 4. Check for City-to-City Routing / Travel Directions
        is_route = bool(re.search(r'\b(?:to|se|between|kaise jayein|route|travel options|highway|distance)\b', q)) and not any(w in q for w in ["itinerary", "day plan", "days"])
        if is_route:
            return {
                "category": "directions",
                "functional_intent": "ROUTE_PLANNING",
                "response_style": "comparison" if "options" in q or "compare" in q else "step_by_step",
                "complexity": "7_multi_step"
            }

        # 5. Check for Multi-Day Itinerary Generation
        is_itin = bool(re.search(r'\b(?:\d+\s*(?:day|days|din|दिन)|itinerary|tour\s*plan|trip\s*plan|circuit)\b', q))
        if is_itin:
            return {
                "category": "itinerary",
                "functional_intent": "ITINERARY_CREATE",
                "response_style": "table" if "table" in q or "budget" in q else "step_by_step",
                "complexity": "8_database_grounded"
            }

        # 6. Check for Interactive Map Navigation & Proximity
        if any(w in q for w in ["map", "cultural map", "show on map", "nearby", "paas mein", "around me", "gps"]):
            return {
                "category": "maps",
                "functional_intent": "MAP_DISCOVERY",
                "response_style": "interactive_workflow",
                "complexity": "9_tool_assisted"
            }

        # 7. Check for Festivals & Living Traditions
        if any(w in q for w in ["festival", "utsav", "mela", "puja", "aarti", "celebrate", "rath yatra", "diwali", "holi", "kumbh", "onam", "chhath"]):
            return {
                "category": "festivals",
                "functional_intent": "FESTIVAL_QUERY",
                "response_style": "detailed",
                "complexity": "4_detailed"
            }

        # 8. Check for Traditional Arts & Crafts
        if any(w in q for w in ["craft", "shilp", "handicraft", "pottery", "painting", "pashmina", "silk", "saree", "artisan", "gi tag", "weaving"]):
            return {
                "category": "crafts",
                "functional_intent": "CRAFT_QUERY",
                "response_style": "detailed",
                "complexity": "4_detailed"
            }

        # 9. Check for Hotels & Stays
        if any(w in q for w in ["hotel", "resort", "haveli", "stay", "room", "homestay", "dharamshala"]):
            return {
                "category": "hotels",
                "functional_intent": "HOTEL_QUERY",
                "response_style": "recommendation",
                "complexity": "6_personalized"
            }

        # 10. Check for Food & Restaurants
        if any(w in q for w in ["food", "restaurant", "cuisine", "thali", "kachori", "chaat", "mithai", "street food", "khana", "veg", "jain food"]):
            return {
                "category": "restaurants",
                "functional_intent": "FOOD_QUERY",
                "response_style": "recommendation",
                "complexity": "5_contextual"
            }

        # 11. Check for Single Destination Inquiry
        if any(w in q for w in ["jaana hai", "jana hai", "ghoomna hai", "want to visit", "trip to", "going to"]):
            return {
                "category": "cities",
                "functional_intent": "DESTINATION_INQUIRY",
                "response_style": "conversational",
                "complexity": "5_contextual"
            }

        # 12. Default Heritage & Monument Query
        return {
            "category": "heritage",
            "functional_intent": "HERITAGE_QUERY",
            "response_style": "detailed",
            "complexity": "8_database_grounded"
        }

intent_classifier = IntentClassifier()
