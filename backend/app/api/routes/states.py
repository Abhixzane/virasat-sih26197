from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import StateCity

router = APIRouter()

@router.get("/states", response_model=List[StateCity])
def get_states():
    """Retrieve all Indian States and Union Territories."""
    return cultural_repository.get_states()

@router.get("/states/{state_id}", response_model=StateCity)
def get_state_by_id(state_id: str):
    """Retrieve details of a specific Indian State or Union Territory."""
    clean_id = state_id.strip().lower()
    for s in cultural_repository.get_states():
        if s.id.lower() == clean_id or s.name.lower() == clean_id or clean_id in s.id.lower():
            return s
    raise HTTPException(status_code=404, detail=f"State '{state_id}' not found.")

@router.get("/cities", response_model=List[StateCity])
def get_cities(state: Optional[str] = Query(None, description="Filter cities by state")):
    """Retrieve verified cultural cities with coordinates and descriptions."""
    return cultural_repository.get_cities(state=state)

@router.get("/cities/{city_id}", response_model=StateCity)
def get_city_by_id(city_id: str):
    """Retrieve details of a specific cultural city."""
    clean_id = city_id.strip().lower()
    for c in cultural_repository.get_cities():
        if c.id.lower() == clean_id or c.name.lower() == clean_id or clean_id in c.id.lower():
            return c
    raise HTTPException(status_code=404, detail=f"City '{city_id}' not found.")
