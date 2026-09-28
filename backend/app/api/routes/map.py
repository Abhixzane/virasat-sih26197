from typing import List, Optional
from fastapi import APIRouter, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import MapMarker

router = APIRouter()

def _filter_markers(
    state: Optional[str] = None,
    category: Optional[str] = None,
    q: Optional[str] = None,
    min_lat: Optional[float] = None,
    max_lat: Optional[float] = None,
    min_lng: Optional[float] = None,
    max_lng: Optional[float] = None,
) -> List[MapMarker]:
    markers: List[MapMarker] = []
    clean_q = q.strip().lower() if q else None

    # 1. Heritage Places (Monument = Saffron Pin)
    for p in cultural_repository.heritage_places:
        if state and p.state.lower() != state.strip().lower():
            continue
        if category and category.lower() not in p.category.lower() and category.lower() not in ["heritage", "monument", "all"]:
            continue
        if clean_q and (clean_q not in p.name.lower() and clean_q not in p.city.lower() and clean_q not in p.state.lower()):
            continue
        if abs(p.latitude) > 0.1 and abs(p.longitude) > 0.1:
            if min_lat is not None and (p.latitude < min_lat or p.latitude > max_lat):
                continue
            if min_lng is not None and (p.longitude < min_lng or p.longitude > max_lng):
                continue

            markers.append(MapMarker(
                id=p.id,
                name=p.name,
                type="heritage",
                category=p.category,
                state=p.state,
                city=p.city,
                latitude=p.latitude,
                longitude=p.longitude,
                description=p.description[:200] + ("..." if len(p.description) > 200 else ""),
                image_url=p.image_url,
                verification_status=p.verification_status
            ))

    # 2. Cultural Experiences (Experience = Outline Pin)
    for e in cultural_repository.experiences:
        if state and e.state.lower() != state.strip().lower():
            continue
        if category and category.lower() not in e.category.lower() and category.lower() not in ["experience", "all"]:
            continue
        if clean_q and (clean_q not in e.name.lower() and clean_q not in e.city.lower() and clean_q not in e.state.lower()):
            continue
        if abs(e.latitude) > 0.1 and abs(e.longitude) > 0.1:
            if min_lat is not None and (e.latitude < min_lat or e.latitude > max_lat):
                continue
            if min_lng is not None and (e.longitude < min_lng or e.longitude > max_lng):
                continue

            markers.append(MapMarker(
                id=e.id,
                name=e.name,
                type="experience",
                category=e.category,
                state=e.state,
                city=e.city,
                latitude=e.latitude,
                longitude=e.longitude,
                description=e.description[:200] + ("..." if len(e.description) > 200 else ""),
                image_url=e.image_url,
                verification_status=e.verification_status
            ))

    return markers

@router.get("/cultural-map/markers", response_model=List[MapMarker])
def get_cultural_map_markers(
    state: Optional[str] = Query(None, description="Filter markers by state"),
    category: Optional[str] = Query(None, description="Filter markers by category"),
    q: Optional[str] = Query(None, description="Free-text search for place, monument, or city"),
    min_lat: Optional[float] = Query(None),
    max_lat: Optional[float] = Query(None),
    min_lng: Optional[float] = Query(None),
    max_lng: Optional[float] = Query(None)
):
    """
    Standard Cultural Map endpoint matching Section 6 & 9 specification.
    Returns verified geospatial markers with category classification.
    """
    return _filter_markers(state, category, q, min_lat, max_lat, min_lng, max_lng)

@router.get("/map/locations", response_model=List[MapMarker])
@router.get("/map/markers", response_model=List[MapMarker])
def get_map_locations(
    state: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    q: Optional[str] = Query(None)
):
    """Backward compatibility alias for frontend map requests."""
    return _filter_markers(state=state, category=category, q=q)
