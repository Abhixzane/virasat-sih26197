from fastapi import APIRouter
from app.models.schemas import ItineraryRequest, ItineraryResponse
from app.services.itinerary_service import itinerary_service

router = APIRouter()

@router.post("/itinerary/generate", response_model=ItineraryResponse)
def generate_cultural_itinerary(req: ItineraryRequest):
    """
    Cultural Heritage Itinerary Generator.
    Generates a day-wise itinerary grounded strictly in verified database records.
    """
    return itinerary_service.generate_itinerary(req)
