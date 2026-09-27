from fastapi import APIRouter, HTTPException
from app.services.relationship_service import relationship_service
from app.models.schemas import RelatedHeritageResponse

router = APIRouter()

@router.get("/related/{record_type}/{record_id}", response_model=RelatedHeritageResponse)
def get_connected_cultural_intelligence(record_type: str, record_id: str):
    """
    Connected Cultural Intelligence endpoint.
    Retrieves dynamically connected heritage monuments, festivals, crafts,
    performing arts, experiences, and historical narratives associated with a primary record.
    """
    result = relationship_service.get_related_heritage(record_type, record_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Record of type '{record_type}' with id '{record_id}' not found."
        )
    return result
