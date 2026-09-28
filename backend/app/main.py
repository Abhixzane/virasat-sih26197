from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger
from app.core.database import init_db
from app.api.routes import (
    health, states, heritage, festivals,
    arts_crafts, performing_arts, experiences,
    stories, search, related, map as map_route,
    ai, itinerary, sync, statistics, sources, artisans, auth
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("==================================================================")
    logger.info("VIRASAT Full-Stack Cultural Heritage Platform Backend Initialized")
    logger.info("Initializing relational database backend...")
    init_db()
    logger.info("OpenAPI Documentation available at: /docs")
    logger.info("Connected Cultural Intelligence Engine active.")
    logger.info("==================================================================")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="VIRASAT — Complete Full-Stack AI Cultural Heritage Discovery Platform API (SIH26197)",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api
api_prefix = settings.API_V1_STR
app.include_router(health.router, prefix=api_prefix, tags=["System Health"])
app.include_router(statistics.router, prefix=api_prefix, tags=["Platform Statistics"])
app.include_router(states.router, prefix=api_prefix, tags=["States & Cities"])
app.include_router(heritage.router, prefix=api_prefix, tags=["Heritage Places & Monuments"])
app.include_router(festivals.router, prefix=api_prefix, tags=["Festivals & Living Traditions"])
app.include_router(arts_crafts.router, prefix=api_prefix, tags=["Arts, Crafts & Artisans"])
app.include_router(artisans.router, prefix=api_prefix, tags=["Master Artisans & Clusters"])
app.include_router(performing_arts.router, prefix=api_prefix, tags=["Folk & Performing Arts"])
app.include_router(experiences.router, prefix=api_prefix, tags=["Cultural Experiences"])
app.include_router(stories.router, prefix=api_prefix, tags=["Cultural Stories"])
app.include_router(search.router, prefix=api_prefix, tags=["Universal Cultural Search"])
app.include_router(related.router, prefix=api_prefix, tags=["Connected Cultural Intelligence"])
app.include_router(sources.router, prefix=api_prefix, tags=["Verified Sources & Provenance"])
app.include_router(map_route.router, prefix=api_prefix, tags=["Interactive Cultural Map"])
app.include_router(ai.router, prefix=api_prefix, tags=["VIRASAT AI Cultural Guide"])
app.include_router(itinerary.router, prefix=api_prefix, tags=["Cultural Itinerary Generator"])
app.include_router(sync.router, prefix=api_prefix, tags=["Database Synchronization"])
app.include_router(auth.router, prefix=api_prefix, tags=["Authentication & User Profiles"])

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
