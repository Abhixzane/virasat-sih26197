from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import CulturalExperience

router = APIRouter()

@router.get("/experiences", response_model=List[CulturalExperience])
def get_cultural_experiences(
    state: Optional[str] = Query(None, description="Filter experiences by state"),
    city: Optional[str] = Query(None, description="Filter experiences by city")
):
    """Retrieve immersive cultural experiences, artisan walkthroughs, and rituals."""
    return cultural_repository.get_cultural_experiences(state=state, city=city)

@router.get("/experiences/{exp_id}", response_model=CulturalExperience)
def get_cultural_experience_by_id(exp_id: str):
    """Retrieve details of a specific cultural experience by ID."""
    exp = cultural_repository.get_cultural_experience_by_id(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Cultural experience '{exp_id}' not found.")
    return exp
