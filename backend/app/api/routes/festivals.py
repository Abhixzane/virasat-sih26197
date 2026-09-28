from typing import List, Optional, Dict, Any, Union
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import Festival
from app.services.festivals.festival_knowledge_service import festival_knowledge_service
from app.services.festivals.festival_search_service import festival_search_service
from app.services.festivals.festival_date_service import festival_date_service

router = APIRouter()

@router.get("/festivals/master")
def get_master_festivals(
    state: Optional[str] = Query(None, description="Filter festivals by state"),
    category: Optional[str] = Query(None, description="Filter festivals by category"),
    month: Optional[str] = Query(None, description="Filter by usual month"),
    date_type: Optional[str] = Query(None, description="Filter by date_type"),
    search: Optional[str] = Query(None, description="Text search across names, cities, foods, and rituals"),
    limit: int = Query(50, ge=1, le=400)
):
    """Retrieve full 42-attribute records from the 363-festival master database."""
    return festival_search_service.search(
        query=search,
        state=state,
        category=category,
        month=month,
        date_type=date_type,
        limit=limit
    )

@router.get("/festivals/upcoming")
def get_upcoming_festivals(
    ref_date: Optional[str] = Query(None, description="Reference date YYYY-MM-DD (defaults to current)"),
    limit: int = Query(12, ge=1, le=50)
):
    """Retrieve upcoming festivals chronologically ordered from the master database."""
    return festival_date_service.get_upcoming_festivals(reference_date=ref_date, limit=limit)

@router.get("/festivals/stats")
def get_festival_stats():
    """Retrieve total festivals, regional breakdown, and calendar distribution."""
    return festival_knowledge_service.get_stats()

@router.get("/festivals", response_model=List[Union[Festival, Dict[str, Any]]])
def get_festivals(
    state: Optional[str] = Query(None, description="Filter festivals by state"),
    category: Optional[str] = Query(None, description="Filter festivals by category"),
    date_type: Optional[str] = Query(None, description="Filter by date_type (FIXED, LUNAR, ANNUAL_OFFICIAL, APPROX_SEASONAL)"),
    month: Optional[str] = Query(None, description="Filter by month or traditional season"),
    search: Optional[str] = Query(None, description="Text search by name or significance")
):
    """Retrieve verified Indian festivals, living traditions, and cultural celebrations with filters."""
    festivals = list(cultural_repository.festivals)

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

    # If repository returns empty or limited results for specific queries, also query master dataset
    if len(festivals) < 5 and (search or state or category):
        master_matches = festival_search_service.search(
            query=search,
            state=state,
            category=category,
            month=month,
            limit=30
        )
        existing_ids = {f.id for f in festivals}
        for mf in master_matches:
            if mf["id"] not in existing_ids:
                festivals.append(mf)

    return festivals

@router.get("/festivals/{slug_or_id}")
def get_festival(slug_or_id: str):
    """Retrieve details of a specific festival by slug or ID from either repository or master knowledge database."""
    clean_target = slug_or_id.strip().lower()
    
    # 1. Direct repository lookup
    fest = cultural_repository.get_festival_by_id(slug_or_id)
    if fest:
        return fest

    # 2. Repository slug scan
    for f in cultural_repository.festivals:
        f_slug = f.name.lower().replace(" ", "-").replace("&", "and")
        if f.id.lower() == clean_target or f_slug == clean_target or clean_target in f.id.lower():
            return f

    # 3. Master Knowledge Service lookup
    mf = festival_knowledge_service.get_festival_by_id(slug_or_id)
    if mf:
        return mf

    # 4. Search in master dataset by slug
    master_matches = festival_search_service.search(query=slug_or_id, limit=1)
    if master_matches:
        return master_matches[0]

    raise HTTPException(status_code=404, detail=f"Festival '{slug_or_id}' not found.")
