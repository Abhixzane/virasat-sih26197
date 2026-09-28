# backend/app/services/festivals/festival_search_service.py
"""
Festival Search Service for VIRASAT Cultural Platform
Provides multi-criteria search, fuzzy filtering, and relevance ranking across 363 festivals.
"""

from typing import List, Dict, Optional, Any
from .festival_knowledge_service import festival_knowledge_service, FestivalKnowledgeService

class FestivalSearchService:
    def __init__(self, knowledge_service: Optional[FestivalKnowledgeService] = None):
        self.ks = knowledge_service or festival_knowledge_service

    def search(
        self,
        query: Optional[str] = None,
        state: Optional[str] = None,
        category: Optional[str] = None,
        month: Optional[str] = None,
        date_type: Optional[str] = None,
        limit: int = 30
    ) -> List[Dict[str, Any]]:
        all_festivals = self.ks.get_all_festivals()
        results_with_score = []

        q_clean = query.strip().lower() if query else ""
        state_clean = state.strip().lower() if state else None
        cat_clean = category.strip().upper().replace(" ", "_") if category else None
        month_clean = month.strip().lower() if month else None
        dtype_clean = date_type.strip().upper() if date_type else None

        for f in all_festivals:
            # 1. State filter
            if state_clean:
                matches_state = any(state_clean in st.lower() for st in f.get("major_states", []))
                if not matches_state:
                    continue

            # 2. Category filter
            if cat_clean:
                if f.get("category", "").upper() != cat_clean:
                    continue

            # 3. Month filter
            if month_clean:
                fest_month = f.get("usual_month", "").lower()
                if month_clean not in fest_month:
                    continue

            # 4. Date type filter
            if dtype_clean:
                if f.get("date_type", "").upper() != dtype_clean:
                    continue

            # 5. Query matching and scoring
            if not q_clean:
                # No search query, default score
                results_with_score.append((1.0, f))
                continue

            score = 0.0
            name_lower = f.get("name", "").lower()
            alts_lower = [a.lower() for a in f.get("alternate_names", [])]
            desc_lower = f.get("short_description", "").lower()
            cities_lower = [c.lower() for c in f.get("major_cities", [])]
            venues_lower = [v.lower() for v in f.get("famous_venues", [])]
            foods_lower = [fd.lower() for fd in f.get("traditional_food_and_sweets", [])]
            rituals_lower = [r.lower() for r in f.get("important_rituals", [])]
            rel_lower = f.get("religious_or_cultural_association", "").lower()

            # Exact name match
            if q_clean == name_lower:
                score += 100.0
            elif name_lower.startswith(q_clean):
                score += 50.0
            elif q_clean in name_lower:
                score += 35.0

            # Alternate names match
            for a in alts_lower:
                if q_clean == a:
                    score += 80.0
                elif q_clean in a:
                    score += 25.0

            # City and Venue match
            for c in cities_lower:
                if q_clean in c:
                    score += 30.0
            for v in venues_lower:
                if q_clean in v:
                    score += 25.0

            # Food / Ritual match
            for fd in foods_lower:
                if q_clean in fd:
                    score += 20.0
            for r in rituals_lower:
                if q_clean in r:
                    score += 15.0

            # Association / Description match
            if q_clean in rel_lower:
                score += 15.0
            if q_clean in desc_lower:
                score += 10.0

            # Split query words for multi-word search
            q_tokens = [w for w in q_clean.split() if len(w) > 2]
            for token in q_tokens:
                if token in name_lower:
                    score += 10.0
                if any(token in a for a in alts_lower):
                    score += 8.0
                if any(token in c for c in cities_lower):
                    score += 5.0
                if token in desc_lower:
                    score += 3.0

            if score > 0:
                results_with_score.append((score, f))

        # Sort by relevance score descending
        results_with_score.sort(key=lambda x: -x[0])
        return [item[1] for item in results_with_score[:limit]]

festival_search_service = FestivalSearchService()
