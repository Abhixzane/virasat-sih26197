from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import Festival

router = APIRouter()

@router.get("/festivals", response_model=List[Festival])
def get_festivals(
    state: Optional[str] = Query(None, description="Filter festivals by state"),
    category: Optional[str] = Query(None, description="Filter festivals by category"),
    date_type: Optional[str] = Query(None, description="Filter by date_type (FIXED, LUNAR, ANNUAL_OFFICIAL, APPROX_SEASONAL)"),
    month: Optional[str] = Query(None, description="Filter by month or traditional season"),
    search: Optional[str] = Query(None, description="Text search by name or significance")
):
    """Retrieve verified Indian festivals, living traditions, and cultural celebrations with filters."""
    festivals = cultural_repository.festivals

    if state:
        festivals = [f for f in festivals if f.state.lower() == state.strip().lower()]
    if category:
        cat_lower = category.strip().lower()
        festivals = [f for f in festivals if cat_lower in f.category.lower()]
    if month:
        m_lower = month.strip().lower()
        festivals = [f for f in festivals if m_lower in f.month_or_season.lower()]
    if search:
        s_lower = search.strip().lower()
        festivals = [f for f in festivals if s_lower in f.name.lower() or s_lower in f.description.lower() or s_lower in f.cultural_significance.lower()]

    return festivals

@router.get("/festivals/{slug_or_id}", response_model=Festival)
def get_festival(slug_or_id: str):
    """Retrieve details of a specific festival by slug or ID."""
    clean_target = slug_or_id.strip().lower()
    fest = cultural_repository.get_festival_by_id(slug_or_id)
    if fest:
        return fest

    for f in cultural_repository.festivals:
        f_slug = f.name.lower().replace(" ", "-").replace("&", "and")
        if f.id.lower() == clean_target or f_slug == clean_target or clean_target in f.id.lower():
            return f

    raise HTTPException(status_code=404, detail=f"Festival '{slug_or_id}' not found.")
