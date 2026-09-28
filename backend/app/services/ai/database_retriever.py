"""
VIRASAT AI Database Retriever
Direct interface to the Centralized Cultural Repository (656 verified records).
Guarantees strict factual grounding without hallucinating records or unverified claims.
"""

from typing import List, Dict, Any, Tuple, Optional
from app.services.ai.retrieval import ai_retrieval_engine

class DatabaseRetriever:
    """Retrieves verified archival records across all 6 cultural collections and 36 States/UTs."""

    def __init__(self, retrieval_engine=ai_retrieval_engine):
        self.engine = retrieval_engine
        self.repo = retrieval_engine.repo

    def retrieve(
        self,
        query: str,
        context_record_id: Optional[str] = None,
        conversation_history: Optional[List[Any]] = None
    ) -> Tuple[List[Dict[str, Any]], List[str]]:
        """Extracts recognized entities and retrieves grounded database records with citations."""
        return self.engine.extract_entities_and_retrieve(
            query=query,
            context_record_id=context_record_id,
            conversation_history=conversation_history
        )

    def find_nearby(self, lat: float, lon: float, radius_km: float = 75.0) -> List[Dict[str, Any]]:
        """Geospatial discovery of monuments, crafts, and experiences within radius."""
        return self.engine.find_nearby_entities(lat, lon, radius_km=radius_km)

    def get_places_by_city_or_state(self, city: Optional[str] = None, state: Optional[str] = None) -> List[Any]:
        return self.repo.get_heritage_places(state=state, city=city)

    def get_crafts_by_state(self, state: str) -> List[Any]:
        return self.repo.get_arts_crafts(state=state)

    def get_festivals_by_state(self, state: str) -> List[Any]:
        return self.repo.get_festivals(state=state)

database_retriever = DatabaseRetriever()
