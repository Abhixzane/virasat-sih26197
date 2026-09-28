from fastapi import APIRouter, Query, HTTPException
from typing import Optional, Dict, Any
from app.models.schemas import AIChatRequest, AIChatResponse, RouteCardData
from app.services.ai.chat_service import ai_chat_service
from app.services.travel.route_planner import route_planner_service
from app.services.itinerary_service import itinerary_service
from app.services.ai.retrieval import ai_retrieval_engine

router = APIRouter()

@router.post("/ai/chat", response_model=AIChatResponse)
def chat_with_cultural_guide(req: AIChatRequest):
    """
    VIRASAT Universal AI Cultural Travel Companion Chat endpoint.
    Performs language detection, intent classification, entity extraction,
    central database retrieval, route planning, nearby discovery, itinerary synthesis,
    conversational editing, and source attribution.
    """
    return ai_chat_service.process_chat(req)

@router.get("/ai/route-plan", response_model=RouteCardData)
def get_route_plan(
    origin: str = Query(..., description="Origin city name"),
    destination: str = Query(..., description="Destination city name")
):
    """
    City-to-City Route Planner and Transport Estimator for Indian destinations.
    """
    orig_key = route_planner_service.resolve_city_name(origin)
    dest_key = route_planner_service.resolve_city_name(destination)

    if not orig_key or not dest_key:
        raise HTTPException(
            status_code=404,
            detail=f"Unable to locate transit coordinates for route between '{origin}' and '{destination}'."
        )

    card = route_planner_service.plan_route(orig_key, dest_key)
    if not card:
        raise HTTPException(status_code=500, detail="Failed to calculate transit route.")
    return card

@router.get("/ai/nearby")
def get_nearby_discoveries(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius_km: float = Query(70.0, description="Search radius in kilometers")
):
    """
    Discovers heritage monuments, experiences, and craft traditions in geographic proximity.
    """
    return ai_retrieval_engine.find_nearby_entities(lat, lng, radius_km)

@router.post("/ai/itinerary/modify")
def modify_itinerary(payload: Dict[str, Any]):
    """
    Applies conversational live modifications to an active itinerary.
    """
    current_itin = payload.get("current_itinerary")
    instruction = payload.get("instruction", "")
    language = payload.get("language", "en")

    if not current_itin:
        raise HTTPException(status_code=400, detail="current_itinerary object is required.")

    updated_itin, message = itinerary_service.modify_itinerary_conversationally(
        current_itin, instruction, lang=language
    )
    return {
        "updated_itinerary": updated_itin,
        "message": message
    }
