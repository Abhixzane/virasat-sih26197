"""
VIRASAT AI Recommendation Engine
Synthesizes contextual, grounded recommendations based on traveler style, budget tier, and geographic circuit.
"""

from typing import List, Dict, Any, Optional

class RecommendationEngine:
    """Generates personalized cultural recommendations with transparent rationales."""

    def score_and_recommend(
        self,
        places: List[Any],
        user_memory: Optional[Dict[str, Any]] = None,
        limit: int = 4
    ) -> List[Dict[str, Any]]:
        mem = user_memory or {}
        style = mem.get("travel_style", "Cultural Explorer")
        interests = set(mem.get("interests", []))

        results = []
        for p in places:
            # Handle both dicts and Pydantic models
            p_dict = p.model_dump() if hasattr(p, 'model_dump') else dict(p)
            score = 1.0

            # Match interest tags
            desc = (p_dict.get("description", "") + " " + p_dict.get("cultural_significance", "")).lower()
            if any(i.lower() in desc for i in interests):
                score += 1.5

            # Tailor for Family
            if "family" in style.lower() and any(w in desc for w in ["garden", "complex", "courtyard", "spacious"]):
                score += 0.8

            p_dict["_match_score"] = score
            results.append(p_dict)

        results.sort(key=lambda x: x.get("_match_score", 0), reverse=True)
        return results[:limit]

    def build_recommendation_rationale(self, item_name: str, item_type: str, user_style: str, lang: str = "en") -> str:
        if lang == "hi":
            return f"**{item_name}** आपकी {user_style} यात्रा शैली और ऐतिहासिक अभिरुचि के अनुसार विशेष रूप से अनुशंसित है।"
        elif lang == "hinglish":
            return f"**{item_name}** aapki {user_style} travel preference aur authentic heritage interest ke hisab se perfect match hai."
        return f"**{item_name}** is highly recommended based on your {user_style} travel profile and heritage preferences."

recommendation_engine = RecommendationEngine()
