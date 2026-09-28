from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import ArtCraft

router = APIRouter()

def _get_filtered_crafts(
    state: Optional[str] = None,
    category: Optional[str] = None,
    gi_status: Optional[str] = None,
    search: Optional[str] = None
) -> List[ArtCraft]:
    crafts = cultural_repository.arts_crafts

    if state:
        crafts = [c for c in crafts if c.state.lower() == state.strip().lower()]
    if category:
        cat_lower = category.strip().lower()
        crafts = [c for c in crafts if cat_lower in c.craft_category.lower()]
    if gi_status:
        gi_bool = gi_status.lower() in ["true", "registered", "1"]
        crafts = [c for c in crafts if c.gi_status == gi_bool]
    if search:
        s_lower = search.strip().lower()
        crafts = [c for c in crafts if s_lower in c.name.lower() or s_lower in c.description.lower() or s_lower in c.materials_used.lower()]

    return crafts

def _lookup_craft(slug_or_id: str) -> ArtCraft:
    clean_target = slug_or_id.strip().lower()
    art = cultural_repository.get_art_craft_by_id(slug_or_id)
    if art:
        return art

    for c in cultural_repository.arts_crafts:
        c_slug = c.name.lower().replace(" ", "-").replace("&", "and")
        if c.id.lower() == clean_target or c_slug == clean_target or clean_target in c.id.lower():
            return c

    raise HTTPException(status_code=404, detail=f"Craft '{slug_or_id}' not found.")

@router.get("/crafts", response_model=List[ArtCraft])
@router.get("/arts-crafts", response_model=List[ArtCraft])
def get_crafts(
    state: Optional[str] = Query(None, description="Filter arts and crafts by state"),
    category: Optional[str] = Query(None, description="Filter by craft category"),
    gi_status: Optional[str] = Query(None, description="Filter by GI status (true/false/registered)"),
    search: Optional[str] = Query(None, description="Search by craft name or materials")
):
    """Retrieve traditional Indian crafts, textiles, and GI-tagged handlooms."""
    return _get_filtered_crafts(state, category, gi_status, search)

@router.get("/crafts/{slug_or_id}", response_model=ArtCraft)
@router.get("/arts-crafts/{slug_or_id}", response_model=ArtCraft)
def get_craft_detail(slug_or_id: str):
    """Retrieve details of a specific art or craft by slug or ID."""
    return _lookup_craft(slug_or_id)
