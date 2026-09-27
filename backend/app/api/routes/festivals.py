from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import Festival

router = APIRouter()

@router.get("/festivals", response_model=List[Festival])
def get_festivals(state: Optional[str] = Query(None, description="Filter festivals by state")):
    """Retrieve verified Indian festivals, living traditions, and cultural celebrations."""
    return cultural_repository.get_festivals(state=state)

@router.get("/festivals/{festival_id}", response_model=Festival)
def get_festival_by_id(festival_id: str):
    """Retrieve details of a specific festival by ID."""
    fest = cultural_repository.get_festival_by_id(festival_id)
    if not fest:
        raise HTTPException(status_code=404, detail=f"Festival '{festival_id}' not found.")
    return fest
