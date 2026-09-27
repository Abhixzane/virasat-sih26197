from fastapi import APIRouter
from app.repositories.cultural_repository import cultural_repository

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "VIRASAT Cultural API",
        "version": "2.0.0",
        "database_records_loaded": len(cultural_repository.by_id),
        "total_monuments": len(cultural_repository.heritage_places),
        "total_festivals": len(cultural_repository.festivals),
        "total_arts_crafts": len(cultural_repository.arts_crafts),
        "total_performing_arts": len(cultural_repository.performing_arts),
        "total_experiences": len(cultural_repository.experiences),
        "total_stories": len(cultural_repository.stories)
    }
