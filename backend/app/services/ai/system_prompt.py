"""
VIRASAT AI Cultural Travel Companion - Master System Prompt & Prompt Intelligence Engine
Supports 10 Categories x 10 Response Styles x 10 Complexity Levels = 1,000 Prompt Combinations.
"""

import os
import json
from pathlib import Path
from typing import Dict, Any, List, Optional

PROMPTS_DIR = Path(__file__).parent / "prompts"

VIRASAT_MASTER_SYSTEM_PROMPT = """
You are VIRASAT, an intelligent, culturally grounded Indian travel companion and cultural heritage assistant.
Your mission is to share authentic insights into India's timeless monuments, sacred living traditions,
Geographical Indication (GI) tagged handicrafts, performing arts, and diverse culinary cultures across all
28 States and 8 Union Territories.

CORE PRINCIPLES & GUIDELINES:
1. TRILINGUAL FLUENCY:
   - Understand and respond fluently in English, Hindi (Devanagari), and natural conversational Hinglish.
   - When the user asks in Hinglish (e.g. "Kaise ho?", "Jaipur ghoomna hai", "Budget 5000 hai"), reply in warm,
     authentic Hinglish (e.g., "Main badhiya hoon! Jaipur ke forts aur markets explore karne ke liye ek badiya plan banate hain.").
   - Never sound robotic, over-formal, or artificial.

2. STRICT ARCHIVAL & HISTORICAL GROUNDING:
   - Ground all factual assertions in verified records from the Archaeological Survey of India (ASI),
     Ministry of Culture, UNESCO World Heritage Centre, and official State Tourism departments.
   - Never fabricate opening hours, monument entry fees, hotel availability, or train schedules.
   - If an attribute or price estimate is not officially verified, clearly state it as an indicative estimate:
     "Official schedules and fares should be confirmed directly via IRCTC or official carriers."

3. PERSONALIZED MEMORY & TRAVEL PLANNING:
   - Remember the traveler's home city, budget tier (Budget, Moderate, Luxury), travel style (Solo, Family, Couple),
     and dietary preferences (Vegetarian, Jain, Vegan, Flexible).
   - Tailor all route logistics and itinerary pacing to these remembered preferences.

4. GEOGRAPHIC ACCURACY & ROUTE TRANSIT:
   - Use real geographic coordinates and national highway corridors (e.g., NE-4, Yamuna Expressway, NH-19).
   - Cluster visits geographically to minimize transit fatigue between consecutive stops.
   - Accompany responses with interactive UI action triggers (View on Map, Open Itinerary, Explore Site).
"""

class PromptIntelligenceEngine:
    """
    Manages the 1,000 prompt combination matrix:
    10 Categories x 10 Response Styles x 10 Complexity Levels.
    """
    def __init__(self, prompts_dir: Path = PROMPTS_DIR):
        self.prompts_dir = prompts_dir
        self.categories: Dict[str, Dict[str, Any]] = {}
        self._load_prompt_definitions()

    def _load_prompt_definitions(self):
        if not self.prompts_dir.exists():
            return
        for json_file in self.prompts_dir.glob("*.json"):
            cat_key = json_file.stem
            try:
                with open(json_file, "r", encoding="utf-8") as f:
                    self.categories[cat_key] = json.load(f)
            except Exception as e:
                pass

    def get_category_metadata(self, category: str) -> Optional[Dict[str, Any]]:
        return self.categories.get(category.lower())

    def list_categories(self) -> List[str]:
        return list(self.categories.keys())

    def build_prompt(
        self,
        category: str,
        style: str = "conversational",
        complexity: str = "6_personalized",
        user_query: str = "",
        context_data: Optional[Dict[str, Any]] = None,
        language: str = "en"
    ) -> str:
        """
        Dynamically synthesizes a specialized instruction prompt tailored to the requested
        (Category, Response Style, Complexity Level) permutation.
        """
        cat = self.categories.get(category.lower())
        cat_name = cat.get("name", category.title()) if cat else category.title()
        cat_desc = cat.get("domain_description", "") if cat else ""
        grounding = cat.get("grounding_requirements", []) if cat else []

        style_instruction = cat.get("response_styles", {}).get(style, f"Adopt a {style} format.") if cat else f"Adopt a {style} format."
        complexity_instruction = cat.get("complexity_levels", {}).get(complexity, f"Complexity level: {complexity}.") if cat else f"Complexity level: {complexity}."

        lines = [
            f"### ROLE: VIRASAT AI Cultural Guide — Specialized Domain: {cat_name}",
            f"DOMAIN SCOPE: {cat_desc}",
            f"TARGET LANGUAGE: {language.upper()} (Respond naturally matching user language tone)",
            f"RESPONSE STYLE: {style.upper()} — {style_instruction}",
            f"COMPLEXITY & DEPTH: {complexity.upper()} — {complexity_instruction}",
            "\nGROUNDING RULES:"
        ]
        for g in grounding:
            lines.append(f"- {g}")

        if context_data:
            lines.append("\nVERIFIED DATABASE CONTEXT:")
            for k, v in context_data.items():
                lines.append(f"- {k}: {v}")

        if user_query:
            lines.append(f"\nUSER INQUIRY: {user_query}")

        return "\n".join(lines)

prompt_intelligence_engine = PromptIntelligenceEngine()
