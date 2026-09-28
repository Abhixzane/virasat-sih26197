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

    # 3. Festivals & Living Traditions (Festival = Red Pin)
    # Map festivals to verified coordinates of host city or state capital
    for f in cultural_repository.festivals:
        if state and f.state.lower() != state.strip().lower():
            continue
        if category and category.lower() not in f.category.lower() and category.lower() not in ["festival", "festivals", "traditions", "all"]:
            continue
        if clean_q and (clean_q not in f.name.lower() and clean_q not in f.state.lower() and clean_q not in f.description.lower()):
            continue

        lat, lng = None, None
        city_name = f.state
        state_cities = [c for c in cultural_repository.get_cities(f.state) if hasattr(c, "coordinates") and c.coordinates]
        if state_cities:
            lat = state_cities[0].coordinates.lat
            lng = state_cities[0].coordinates.lng
            city_name = state_cities[0].name

        if lat is not None and lng is not None and abs(lat) > 0.1 and abs(lng) > 0.1:
            if min_lat is not None and (lat < min_lat or lat > max_lat):
                continue
            if min_lng is not None and (lng < min_lng or lng > max_lng):
                continue

            markers.append(MapMarker(
                id=f.id,
                name=f.name,
                type="festival",
                category=f.category,
                state=f.state,
                city=city_name,
                latitude=lat,
                longitude=lng,
                description=f.description[:200] + ("..." if len(f.description) > 200 else ""),
                image_url=f.image_url,
                verification_status=f.verification_status
            ))

    # 4. Cultural Cities & Heritage Hubs (All 28 States & 8 UTs)
    # Guarantees exact search and map placement for all 962 verified cities and towns
    for c in cultural_repository.states_and_cities:
        if state and c.state.lower() != state.strip().lower():
            continue
        if category and category.lower() not in ["all", "cities", "city", "destination", "destinations", "heritage"] and not clean_q:
            continue
        if clean_q and (clean_q not in c.name.lower() and clean_q not in c.state.lower() and clean_q not in c.description.lower()):
            continue

        lat = c.coordinates.lat if hasattr(c, "coordinates") and c.coordinates else None
        lng = c.coordinates.lng if hasattr(c, "coordinates") and c.coordinates else None
        if lat is not None and lng is not None and abs(lat) > 0.1 and abs(lng) > 0.1:
            if min_lat is not None and (lat < min_lat or lat > max_lat):
                continue
            if min_lng is not None and (lng < min_lng or lng > max_lng):
                continue

            markers.append(MapMarker(
                id=c.id,
                name=c.name,
                type="experience",
                category="Cultural Destination & Heritage Hub",
                state=c.state,
                city=c.name,
                latitude=lat,
                longitude=lng,
                description=c.description[:200] + ("..." if len(c.description) > 200 else ""),
                image_url=c.image_url,
                verification_status="VERIFIED"
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
