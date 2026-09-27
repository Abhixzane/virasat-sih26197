from typing import List, Optional
from fastapi import APIRouter, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import MapMarker

router = APIRouter()

@router.get("/map/locations", response_model=List[MapMarker])
def get_map_locations(
    state: Optional[str] = Query(None, description="Filter markers by state"),
    category: Optional[str] = Query(None, description="Filter markers by category")
):
    """
    Interactive Cultural Map endpoint.
    Returns verified coordinates and metadata for heritage monuments and cultural experiences.
    Excludes invalid or placeholder (0, 0) coordinates.
    """
    markers: List[MapMarker] = []

    # 1. Heritage Places
    for p in cultural_repository.heritage_places:
        if state and p.state.lower() != state.strip().lower():
            continue
        if category and category.lower() not in p.category.lower():
            continue
        # Verify non-zero coordinates
        if abs(p.latitude) > 0.1 and abs(p.longitude) > 0.1:
            markers.append(MapMarker(
                id=p.id,
                name=p.name,
                type="heritage",
                category=p.category,
                state=p.state,
                city=p.city,
                latitude=p.latitude,
                longitude=p.longitude,
                description=p.description[:180] + ("..." if len(p.description) > 180 else ""),
                image_url=p.image_url,
                verification_status=p.verification_status
            ))

    # 2. Cultural Experiences
    for e in cultural_repository.experiences:
        if state and e.state.lower() != state.strip().lower():
            continue
        if category and category.lower() not in e.category.lower():
            continue
        if abs(e.latitude) > 0.1 and abs(e.longitude) > 0.1:
            markers.append(MapMarker(
                id=e.id,
                name=e.name,
                type="experience",
                category=e.category,
                state=e.state,
                city=e.city,
                latitude=e.latitude,
                longitude=e.longitude,
                description=e.description[:180] + ("..." if len(e.description) > 180 else ""),
                image_url=e.image_url,
                verification_status=e.verification_status
            ))

    return markers
