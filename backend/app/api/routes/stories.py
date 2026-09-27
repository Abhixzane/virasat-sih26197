from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import CulturalStory

router = APIRouter()

@router.get("/stories", response_model=List[CulturalStory])
def get_cultural_stories(state: Optional[str] = Query(None, description="Filter stories by state")):
    """Retrieve verified cultural narratives, historical chronicles, and oral legends."""
    return cultural_repository.get_cultural_stories(state=state)

@router.get("/stories/{story_id}", response_model=CulturalStory)
def get_cultural_story_by_id(story_id: str):
    """Retrieve details of a specific cultural story by ID."""
    story = cultural_repository.get_cultural_story_by_id(story_id)
    if not story:
        raise HTTPException(status_code=404, detail=f"Cultural story '{story_id}' not found.")
    return story
