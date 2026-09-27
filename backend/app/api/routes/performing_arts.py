from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import PerformingArt

router = APIRouter()

@router.get("/performing-arts", response_model=List[PerformingArt])
def get_performing_arts(state: Optional[str] = Query(None, description="Filter performing arts by state")):
    """Retrieve classical and folk performing arts, dances, theatre, and music forms."""
    return cultural_repository.get_performing_arts(state=state)

@router.get("/performing-arts/{art_id}", response_model=PerformingArt)
def get_performing_art_by_id(art_id: str):
    """Retrieve details of a specific performing art form by ID."""
    art = cultural_repository.get_performing_art_by_id(art_id)
    if not art:
        raise HTTPException(status_code=404, detail=f"Performing art '{art_id}' not found.")
    return art
