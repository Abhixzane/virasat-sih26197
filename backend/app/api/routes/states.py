from typing import List, Optional
from fastapi import APIRouter, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import StateCity

router = APIRouter()

@router.get("/states", response_model=List[StateCity])
def get_states():
    """Retrieve all Indian States and Union Territories."""
    return cultural_repository.get_states()

@router.get("/cities", response_model=List[StateCity])
def get_cities(state: Optional[str] = Query(None, description="Filter cities by state")):
    """Retrieve verified cultural cities with coordinates and descriptions."""
    return cultural_repository.get_cities(state=state)
