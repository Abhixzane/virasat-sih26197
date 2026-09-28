# backend/app/services/heritage/unesco_heritage_service.py
"""
UNESCO World Heritage Service for VIRASAT Cultural Platform
Provides comprehensive access to all 42 officially inscribed World Heritage properties in India.
"""

import os
import json
import logging
from typing import List, Dict, Optional, Any

logger = logging.getLogger(__name__)

class UnescoHeritageService:
    def __init__(self, data_path: Optional[str] = None):
        self.data_path = data_path or self._resolve_default_path()
        self._properties: List[Dict[str, Any]] = []
        self._by_id: Dict[str, Dict[str, Any]] = {}
        self._by_category: Dict[str, List[Dict[str, Any]]] = {}
        self._by_state: Dict[str, List[Dict[str, Any]]] = {}
        self._criteria_ref: Dict[str, Any] = {}
        self._load_data()

    def _resolve_default_path(self) -> str:
        candidates = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "heritage", "unesco_world_heritage.json")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "heritage", "unesco_world_heritage.json")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "data", "heritage", "unesco_world_heritage.json")),
            "data/heritage/unesco_world_heritage.json",
            "backend/data/heritage/unesco_world_heritage.json"
        ]
        for c in candidates:
            if os.path.exists(c):
                return c
        return candidates[0]

    def _load_data(self):
        try:
            if not os.path.exists(self.data_path):
                logger.warning(f"UNESCO master data not found at {self.data_path}")
                return
            with open(self.data_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            if isinstance(data, dict):
                self._properties = data.get("properties", [])
                self._criteria_ref = data.get("criteria_reference", {})
            elif isinstance(data, list):
                self._properties = data

            for item in self._properties:
                sid = item.get("id")
                if sid:
                    self._by_id[sid] = item

                cat = item.get("category", "Other")
                if cat not in self._by_category:
                    self._by_category[cat] = []
                self._by_category[cat].append(item)

                st = item.get("state", "India")
                if st not in self._by_state:
                    self._by_state[st] = []
                self._by_state[st].append(item)

            logger.info(f"Loaded {len(self._properties)} UNESCO World Heritage properties.")
        except Exception as e:
            logger.error(f"Error loading UNESCO master data: {e}")

    def get_all_properties(self) -> List[Dict[str, Any]]:
        return list(self._properties)

    def get_property_by_id(self, prop_id: str) -> Optional[Dict[str, Any]]:
        return self._by_id.get(prop_id)

    def get_properties_by_category(self, category: str) -> List[Dict[str, Any]]:
        cat_clean = category.strip().capitalize()
        return list(self._by_category.get(cat_clean, []))

    def get_properties_by_state(self, state: str) -> List[Dict[str, Any]]:
        st_lower = state.strip().lower()
        matched = []
        for st_name, p_list in self._by_state.items():
            if st_lower in st_name.lower():
                matched.extend(p_list)
        return matched

    def search_properties(self, query: str, limit: int = 15) -> List[Dict[str, Any]]:
        q_lower = query.strip().lower()
        results = []
        for p in self._properties:
            name = p.get("official_unesco_name", "").lower()
            alts = [a.lower() for a in p.get("alternate_names", [])]
            state = p.get("state", "").lower()
            hist = p.get("historical_background", "").lower()
            attr = [a.lower() for a in p.get("major_attractions", [])]

            score = 0
            if q_lower == name:
                score += 100
            elif q_lower in name:
                score += 40
            elif any(q_lower in a for a in alts):
                score += 30
            elif q_lower in state:
                score += 20
            elif any(q_lower in at for at in attr):
                score += 15
            elif q_lower in hist:
                score += 10

            if score > 0:
                results.append((score, p))

        results.sort(key=lambda x: -x[0])
        return [item[1] for item in results[:limit]]

    def get_criteria_reference(self) -> Dict[str, Any]:
        return dict(self._criteria_ref)

    def get_stats(self) -> Dict[str, Any]:
        return {
            "total_properties": len(self._properties),
            "cultural_count": len(self._by_category.get("Cultural", [])),
            "natural_count": len(self._by_category.get("Natural", [])),
            "mixed_count": len(self._by_category.get("Mixed", [])),
            "states_covered": len(self._by_state)
        }

unesco_heritage_service = UnescoHeritageService()
