"""
VIRASAT AI Itinerary Generator
Generates and modifies multi-day, geographically optimized, culturally paced itineraries.
"""

from typing import Dict, Any, Tuple, Optional
from app.models.schemas import ItineraryRequest, ItineraryResponse
from app.services.itinerary_service import itinerary_service

class ItineraryGenerator:
    """Manages cultural itinerary synthesis, day clustering, and conversational live edits."""

    def __init__(self, service=itinerary_service):
        self.service = service

    def generate(self, destination: str, days: int = 3, user_memory: Optional[Dict[str, Any]] = None) -> ItineraryResponse:
        """Synthesizes a realistic, geographically clustered heritage itinerary."""
        req = ItineraryRequest(state_or_destination=destination, days=days)
        return self.service.generate_itinerary(req)

    def modify(self, current_itinerary: Dict[str, Any], instruction: str, lang: str = "en") -> Tuple[Dict[str, Any], str]:
        """Applies live conversational modifications without resetting the entire plan."""
        return self.service.modify_itinerary_conversationally(current_itinerary, instruction, lang=lang)

itinerary_generator = ItineraryGenerator()
