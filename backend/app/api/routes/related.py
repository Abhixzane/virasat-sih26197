from fastapi import APIRouter, HTTPException
from app.services.relationship_service import relationship_service
from app.models.schemas import RelatedHeritageResponse

router = APIRouter()

def _get_related(record_type: str, record_id: str) -> RelatedHeritageResponse:
    result = relationship_service.get_related_heritage(record_type, record_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Record of type '{record_type}' with id '{record_id}' not found."
        )
    return result

@router.get("/related/{record_type}/{record_id}", response_model=RelatedHeritageResponse)
def get_connected_cultural_intelligence(record_type: str, record_id: str):
    """
    Connected Cultural Intelligence endpoint.
    Retrieves dynamically connected heritage monuments, festivals, crafts,
    performing arts, experiences, and historical narratives associated with a primary record.
    """
    return _get_related(record_type, record_id)

@router.get("/entities/{entity_type}/{id}/related", response_model=RelatedHeritageResponse)
def get_entity_related_intelligence(entity_type: str, id: str):
    """Standard Section 9 endpoint for connected cultural intelligence."""
    return _get_related(entity_type, id)
