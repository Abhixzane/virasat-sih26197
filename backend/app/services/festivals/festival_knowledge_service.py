# backend/app/services/festivals/festival_knowledge_service.py
"""
Festival Knowledge Service for VIRASAT Cultural Platform
Provides centralized read, filter, lookup, and analytics over the 363 authentic Indian festivals.
"""

import os
import json
import logging
from typing import List, Dict, Optional, Any

logger = logging.getLogger(__name__)

class FestivalKnowledgeService:
    def __init__(self, data_path: Optional[str] = None):
        self.data_path = data_path or self._resolve_default_path()
        self._festivals: List[Dict[str, Any]] = []
        self._by_id: Dict[str, Dict[str, Any]] = {}
        self._by_state: Dict[str, List[Dict[str, Any]]] = {}
        self._by_category: Dict[str, List[Dict[str, Any]]] = {}
        self._load_data()

    def _resolve_default_path(self) -> str:
        candidates = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "festivals", "india_festivals_master.json")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "festivals", "india_festivals_master.json")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "data", "festivals", "india_festivals_master.json")),
            "data/festivals/india_festivals_master.json",
            "backend/data/festivals/india_festivals_master.json"
        ]
        for c in candidates:
            if os.path.exists(c):
                return c
        return candidates[0]

    def _load_data(self):
        try:
            if not os.path.exists(self.data_path):
                logger.warning(f"Festival master data not found at {self.data_path}")
                return
            with open(self.data_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            if isinstance(data, dict) and "festivals" in data:
                self._festivals = data["festivals"]
            elif isinstance(data, list):
                self._festivals = data
            else:
                self._festivals = []

            # Build in-memory indexes
            for item in self._festivals:
                fid = item.get("id")
                if fid:
                    self._by_id[fid] = item

                cat = item.get("category", "OTHER")
                if cat not in self._by_category:
                    self._by_category[cat] = []
                self._by_category[cat].append(item)

                for st in item.get("major_states", []):
                    st_clean = st.strip()
                    if st_clean not in self._by_state:
                        self._by_state[st_clean] = []
                    self._by_state[st_clean].append(item)

            logger.info(f"Loaded {len(self._festivals)} festivals into FestivalKnowledgeService.")
        except Exception as e:
            logger.error(f"Error loading festival master data: {e}")

    def get_all_festivals(self) -> List[Dict[str, Any]]:
        return list(self._festivals)

    def get_total_count(self) -> int:
        return len(self._festivals)

    def get_festival_by_id(self, festival_id: str) -> Optional[Dict[str, Any]]:
        return self._by_id.get(festival_id)

    def get_festivals_by_category(self, category: str) -> List[Dict[str, Any]]:
        return list(self._by_category.get(category.upper().replace(" ", "_"), []))

    def get_festivals_by_state(self, state: str) -> List[Dict[str, Any]]:
        state_lower = state.strip().lower()
        results = []
        for st_name, f_list in self._by_state.items():
            if state_lower in st_name.lower():
                results.extend(f_list)
        # Deduplicate
        seen = set()
        deduped = []
        for r in results:
            if r["id"] not in seen:
                seen.add(r["id"])
                deduped.append(r)
        return deduped

    def get_featured_festivals(self, limit: int = 12) -> List[Dict[str, Any]]:
        # Pick diverse selection across categories and regions
        featured = []
        seen = set()
        priority_categories = ["HARVEST_SEASONAL", "RELIGIOUS_TEMPLE", "MUSIC_DANCE_ARTS", "FOLK_COMMUNITY", "CULTURAL_NATIONAL"]
        for cat in priority_categories:
            cat_festivals = self._by_category.get(cat, [])
            for f in cat_festivals[:3]:
                if f["id"] not in seen:
                    seen.add(f["id"])
                    featured.append(f)
                if len(featured) >= limit:
                    break
            if len(featured) >= limit:
                break
        return featured

    def get_stats(self) -> Dict[str, Any]:
        return {
            "total_festivals": len(self._festivals),
            "states_and_uts_covered": len(self._by_state),
            "categories_count": len(self._by_category),
            "categories": {cat: len(items) for cat, items in self._by_category.items()}
        }

# Global singleton
festival_knowledge_service = FestivalKnowledgeService()
