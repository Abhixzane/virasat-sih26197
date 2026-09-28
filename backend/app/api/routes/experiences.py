from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import CulturalExperience

router = APIRouter()

@router.get("/experiences", response_model=List[CulturalExperience])
def get_cultural_experiences(
    state: Optional[str] = Query(None, description="Filter experiences by state"),
    city: Optional[str] = Query(None, description="Filter experiences by city"),
    category: Optional[str] = Query(None, description="Filter by experience category"),
    informational_or_bookable: Optional[str] = Query(None, description="Filter by INFORMATIONAL or BOOKABLE"),
    search: Optional[str] = Query(None, description="Search experiences")
):
    """Retrieve immersive cultural experiences, walks, workshops, and interpretation trails."""
    exps = cultural_repository.experiences

    if state:
        exps = [e for e in exps if e.state.lower() == state.strip().lower()]
    if city:
        exps = [e for e in exps if e.city.lower() == city.strip().lower()]
    if category:
        cat_lower = category.strip().lower()
        exps = [e for e in exps if cat_lower in e.category.lower()]
    if informational_or_bookable:
        ib_upper = informational_or_bookable.strip().upper()
        # All VIRASAT experiences are verified informational cultural listings
        exps = [e for e in exps if ib_upper in ["INFORMATIONAL", "ALL"]]
    if search:
        s_lower = search.strip().lower()
        exps = [e for e in exps if s_lower in e.name.lower() or s_lower in e.description.lower()]

    return exps

@router.get("/experiences/{exp_id}", response_model=CulturalExperience)
def get_cultural_experience_by_id(exp_id: str):
    """Retrieve details of a specific cultural experience by ID."""
    clean_target = exp_id.strip().lower()
    exp = cultural_repository.get_cultural_experience_by_id(exp_id)
    if exp:
        return exp

    for e in cultural_repository.experiences:
        if e.id.lower() == clean_target or clean_target in e.id.lower() or clean_target in e.name.lower():
            return e

    raise HTTPException(status_code=404, detail=f"Cultural experience '{exp_id}' not found.")
