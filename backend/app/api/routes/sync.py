from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Body
from app.repositories.cultural_repository import cultural_repository

router = APIRouter()

@router.put("/sync/record/{record_type}/{record_id}")
def update_cultural_record(
    record_type: str,
    record_id: str,
    updates: Dict[str, Any] = Body(...)
):
    """
    Synchronized Data Update endpoint.
    Updates a cultural record in the centralized repository and persists it to disk.
    Immediately propagates to listings, detail pages, search index, AI retrieval, and relationships.
    """
    success = cultural_repository.update_record(record_type, record_id, updates)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Record of type '{record_type}' with id '{record_id}' could not be updated."
        )

    # Return the newly updated record
    rec_info = cultural_repository.get_record_by_any_id(record_id)
    return {
        "status": "synchronized",
        "record_id": record_id,
        "record_type": record_type,
        "updated_record": rec_info[1].model_dump() if rec_info else None
    }
