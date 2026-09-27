from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import HeritagePlace

router = APIRouter()

@router.get("/heritage", response_model=List[HeritagePlace])
def get_heritage_places(
    state: Optional[str] = Query(None, description="Filter by state name"),
    city: Optional[str] = Query(None, description="Filter by city name")
):
    """Retrieve verified heritage monuments, archaeological sites, and UNESCO destinations."""
    return cultural_repository.get_heritage_places(state=state, city=city)

@router.get("/heritage/{place_id}", response_model=HeritagePlace)
def get_heritage_place_by_id(place_id: str):
    """Retrieve details of a specific heritage monument by ID."""
    place = cultural_repository.get_heritage_place_by_id(place_id)
    if not place:
        raise HTTPException(status_code=404, detail=f"Heritage place '{place_id}' not found.")
    return place
