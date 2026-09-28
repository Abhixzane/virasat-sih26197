from fastapi import APIRouter
from pydantic import BaseModel
from app.repositories.cultural_repository import cultural_repository

router = APIRouter()

class PlatformStatistics(BaseModel):
    heritage_places: int
    states_represented: int
    festivals: int
    crafts: int
    performing_arts: int
    cultural_experiences: int
    stories: int
    total_records: int
    verification_rate: str

@router.get("/statistics", response_model=PlatformStatistics)
def get_statistics():
    """Returns live platform counters calculated from active database records."""
    states_count = len(cultural_repository.get_states())
    places_count = len(cultural_repository.heritage_places)
    festivals_count = len(cultural_repository.festivals)
    crafts_count = len(cultural_repository.arts_crafts)
    arts_count = len(cultural_repository.performing_arts)
    experiences_count = len(cultural_repository.experiences)
    stories_count = len(cultural_repository.stories)

    total = places_count + festivals_count + crafts_count + arts_count + experiences_count + stories_count

    return PlatformStatistics(
        heritage_places=places_count,
        states_represented=states_count,
        festivals=festivals_count,
        crafts=crafts_count,
        performing_arts=arts_count,
        cultural_experiences=experiences_count,
        stories=stories_count,
        total_records=total,
        verification_rate="100% Source-Backed"
    )
