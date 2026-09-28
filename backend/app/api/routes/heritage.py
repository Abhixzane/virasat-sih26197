from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import HeritagePlace

router = APIRouter()

@router.get("/heritage", response_model=List[HeritagePlace])
def get_heritage_places(
    state: Optional[str] = Query(None, description="Filter by state name"),
    city: Optional[str] = Query(None, description="Filter by city name"),
    category: Optional[str] = Query(None, description="Filter by category (Monument/Fort/Temple/Archaeological Site/UNESCO)"),
    verification_status: Optional[str] = Query(None, description="Filter by verification status"),
    search: Optional[str] = Query(None, description="Text search by name or architectural style"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    sort: Optional[str] = Query("name", description="Sort field (name, state, category)")
):
    """Retrieve verified heritage monuments, archaeological sites, and UNESCO destinations with filters and pagination."""
    places = cultural_repository.heritage_places

    if state:
        places = [p for p in places if p.state.lower() == state.strip().lower()]
    if city:
        places = [p for p in places if p.city.lower() == city.strip().lower()]
    if category:
        cat_lower = category.strip().lower()
        places = [p for p in places if cat_lower in p.category.lower()]
    if verification_status:
        places = [p for p in places if p.verification_status.upper() == verification_status.strip().upper()]
    if search:
        s_lower = search.strip().lower()
        places = [p for p in places if s_lower in p.name.lower() or s_lower in p.architectural_style.lower() or s_lower in p.description.lower()]

    if sort == "state":
        places = sorted(places, key=lambda x: x.state)
    elif sort == "category":
        places = sorted(places, key=lambda x: x.category)
    else:
        places = sorted(places, key=lambda x: x.name)

    return places[offset:offset + limit]

@router.get("/heritage/{slug_or_id}", response_model=HeritagePlace)
def get_heritage_place(slug_or_id: str):
    """Retrieve details of a specific heritage monument by slug or ID."""
    clean_target = slug_or_id.strip().lower()
    # 1. Direct ID lookup
    place = cultural_repository.get_heritage_place_by_id(slug_or_id)
    if place:
        return place

    # 2. Slug / Name normalization lookup
    for p in cultural_repository.heritage_places:
        p_slug = p.name.lower().replace(" ", "-").replace("&", "and")
        if p.id.lower() == clean_target or p_slug == clean_target or clean_target in p.id.lower():
            return p

    raise HTTPException(status_code=404, detail=f"Heritage place '{slug_or_id}' not found.")
