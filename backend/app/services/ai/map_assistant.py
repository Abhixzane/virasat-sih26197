"""
VIRASAT AI Map Assistant & Routing Coordinator
Bridges conversational queries to the interactive Cultural Map, real coordinates, and transit estimators.
"""

from typing import Optional, Dict, Any, Tuple
from app.models.schemas import RouteCardData, UIAction
from app.services.travel.route_planner import route_planner_service

class MapAssistant:
    """Manages spatial transit calculations, interactive map navigation triggers, and route formatting."""

    def __init__(self, routes=route_planner_service):
        self.routes = routes

    def extract_route_pair(self, text: str) -> Optional[Tuple[str, str]]:
        return self.routes.extract_route_pair(text)

    def plan_route(self, origin: str, destination: str) -> Optional[RouteCardData]:
        orig_key = self.routes.resolve_city_name(origin)
        dest_key = self.routes.resolve_city_name(destination)
        if not orig_key or not dest_key:
            return None
        return self.routes.plan_route(orig_key, dest_key)

    def format_route_text(self, card: RouteCardData, lang: str = "en") -> str:
        return self.routes.format_companion_route_text(card, lang=lang)

    def build_map_action(self, destination: str, state: Optional[str] = None) -> UIAction:
        params: Dict[str, Any] = {"destination": destination}
        if state:
            params["state"] = state
        return UIAction(
            action="NAVIGATE",
            path="/cultural-map",
            params=params,
            label=f"Explore {destination} on Cultural Map"
        )

map_assistant = MapAssistant()
