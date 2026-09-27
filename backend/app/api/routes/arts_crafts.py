from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import ArtCraft

router = APIRouter()

@router.get("/arts-crafts", response_model=List[ArtCraft])
def get_arts_crafts(state: Optional[str] = Query(None, description="Filter arts and crafts by state")):
    """Retrieve traditional Indian arts, crafts, textiles, and master artisan traditions."""
    return cultural_repository.get_arts_crafts(state=state)

@router.get("/arts-crafts/{art_id}", response_model=ArtCraft)
def get_art_craft_by_id(art_id: str):
    """Retrieve details of a specific art or craft by ID."""
    art = cultural_repository.get_art_craft_by_id(art_id)
    if not art:
        raise HTTPException(status_code=404, detail=f"Art or craft '{art_id}' not found.")
    return art
