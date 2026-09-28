# backend/app/services/festivals/festival_date_service.py
"""
Festival Date Service for VIRASAT Cultural Platform
Handles astronomical date calculation lookups, monthly indexes, and upcoming festival forecasting.
"""

from datetime import datetime
from typing import List, Dict, Optional, Any
from .festival_knowledge_service import festival_knowledge_service, FestivalKnowledgeService

class FestivalDateService:
    def __init__(self, knowledge_service: Optional[FestivalKnowledgeService] = None):
        self.ks = knowledge_service or festival_knowledge_service

    def get_festivals_by_month(self, month: str) -> List[Dict[str, Any]]:
        m_lower = month.strip().lower()
        all_festivals = self.ks.get_all_festivals()
        matched = []
        for f in all_festivals:
            if m_lower in f.get("usual_month", "").lower():
                matched.append(f)
        return matched

    def get_upcoming_festivals(
        self,
        reference_date: Optional[str] = None,
        limit: int = 15
    ) -> List[Dict[str, Any]]:
        """
        Returns upcoming festivals relative to reference_date (defaults to current date in 2026).
        """
        ref_str = reference_date or "2026-09-28"
        try:
            ref_dt = datetime.strptime(ref_str, "%Y-%m-%d")
        except Exception:
            ref_dt = datetime(2026, 9, 28)

        all_festivals = self.ks.get_all_festivals()
        future_list = []

        for f in all_festivals:
            d26 = f.get("date_2026", "")
            if not d26:
                continue
            
            # Extract starting date part
            start_str = d26.split(" to ")[0].strip()
            try:
                fest_dt = datetime.strptime(start_str, "%Y-%m-%d")
                if fest_dt >= ref_dt:
                    diff_days = (fest_dt - ref_dt).days
                    future_list.append((diff_days, f))
            except Exception:
                continue

        # Sort by proximity in days
        future_list.sort(key=lambda x: x[0])
        return [item[1] for item in future_list[:limit]]

    def get_date_rules_and_calendar_mapping(self) -> Dict[str, Any]:
        all_festivals = self.ks.get_all_festivals()
        date_type_counts = {}
        calendar_system_counts = {}

        for f in all_festivals:
            dtype = f.get("date_type", "OTHER")
            date_type_counts[dtype] = date_type_counts.get(dtype, 0) + 1

            cal = f.get("calendar_system", "Other")
            calendar_system_counts[cal] = calendar_system_counts.get(cal, 0) + 1

        return {
            "date_types": date_type_counts,
            "calendar_systems": calendar_system_counts,
            "calculation_framework": "Rashtriya Panchang & Regional Lunisolar Algorithms"
        }

festival_date_service = FestivalDateService()
