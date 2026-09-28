from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import PerformingArt

router = APIRouter()

@router.get("/performing-arts", response_model=List[PerformingArt])
def get_performing_arts(
    state: Optional[str] = Query(None, description="Filter performing arts by state"),
    category: Optional[str] = Query(None, description="Filter by category (Classical Dance, Folk Music, etc.)"),
    search: Optional[str] = Query(None, description="Search by name, instruments, or significance")
):
    """Retrieve classical and folk performing arts, dances, theatre, and music forms with filters."""
    arts = cultural_repository.performing_arts

    if state:
        arts = [a for a in arts if a.state.lower() == state.strip().lower()]
    if category:
        cat_lower = category.strip().lower()
        arts = [a for a in arts if cat_lower in a.category.lower()]
    if search:
        s_lower = search.strip().lower()
        arts = [a for a in arts if s_lower in a.name.lower() or s_lower in a.description.lower() or any(s_lower in str(i).lower() for i in a.instruments)]

    return arts

@router.get("/performing-arts/{slug_or_id}", response_model=PerformingArt)
def get_performing_art(slug_or_id: str):
    """Retrieve details of a specific performing art form by slug or ID."""
    clean_target = slug_or_id.strip().lower()
    art = cultural_repository.get_performing_art_by_id(slug_or_id)
    if art:
        return art

    for a in cultural_repository.performing_arts:
        a_slug = a.name.lower().replace(" ", "-").replace("&", "and")
        if a.id.lower() == clean_target or a_slug == clean_target or clean_target in a.id.lower():
            return a

    raise HTTPException(status_code=404, detail=f"Performing art '{slug_or_id}' not found.")
