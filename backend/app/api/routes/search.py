from typing import Optional
from fastapi import APIRouter, Query
from app.services.search_service import search_service
from app.models.schemas import SearchResponse

router = APIRouter()

@router.get("/search", response_model=SearchResponse)
def universal_search(
    q: str = Query("", description="Search query string"),
    category: Optional[str] = Query(None, description="Category filter"),
    state: Optional[str] = Query(None, description="State filter"),
    limit: int = Query(50, ge=1, le=100, description="Results limit"),
    offset: int = Query(0, ge=0, description="Results offset")
):
    """
    Universal Cultural Search endpoint.
    Searches across heritage monuments, festivals, arts, performing arts,
    experiences, stories, and cities with case-insensitive matching and relevance scoring.
    """
    return search_service.search(
        query=q,
        category=category,
        state=state,
        limit=limit,
        offset=offset
    )
