"""
VIRASAT AI Response Formatter
Renders natural multi-lingual text and structured card payloads across all 10 Response Styles.
"""

from typing import List, Dict, Any, Optional
from app.models.schemas import PlaceCardData, UIAction, AIChatResponse, RouteCardData

class ResponseFormatter:
    """Formats natural language narratives and structured visual payloads."""

    def format_place_cards(self, records: List[Dict[str, Any]], limit: int = 3) -> List[PlaceCardData]:
        cards: List[PlaceCardData] = []
        for r in records[:limit]:
            cards.append(PlaceCardData(
                id=r.get("id", ""),
                name=r.get("name") or r.get("title", ""),
                type=r.get("_entity_type", "heritage"),
                state=r.get("state", "India"),
                district=r.get("city") or r.get("district") or r.get("origin"),
                category=r.get("category") or r.get("craft_category"),
                image_url=r.get("image_url"),
                description=(r.get("description") or r.get("narrative", ""))[:180] + "...",
                latitude=r.get("latitude"),
                longitude=r.get("longitude"),
                action_label="Explore Record"
            ))
        return cards

    def build_chat_response(
        self,
        text: str,
        records: List[Dict[str, Any]],
        sources: List[str],
        lang: str,
        intent: str,
        places_cards: Optional[List[PlaceCardData]] = None,
        route_card: Optional[RouteCardData] = None,
        itinerary_card: Optional[Dict[str, Any]] = None,
        actions: Optional[List[UIAction]] = None,
        follow_ups: Optional[List[str]] = None,
        memory_updates: Optional[Dict[str, Any]] = None,
        grounded: bool = True
    ) -> AIChatResponse:
        return AIChatResponse(
            response=text,
            grounded_in_database=grounded,
            retrieved_records=records,
            source_references=sources or ["https://asi.nic.in"],
            suggested_follow_ups=follow_ups or [
                "Delhi se Jaipur route batao",
                "Kashi Vishwanath ka historical significance",
                "3-day cultural itinerary banayein"
            ],
            language_detected=lang,
            intent_detected=intent,
            actions=actions or [],
            route_card=route_card,
            places_cards=places_cards or [],
            itinerary_card=itinerary_card,
            memory_updates=memory_updates
        )

response_formatter = ResponseFormatter()
