# VIRASAT — System Architecture Specification

## 1. System Overview

VIRASAT is a unified cultural-intelligence and heritage discovery platform engineered for the Smart India Hackathon (SIH 2026). It connects India's monuments, archaeological sites, vibrant festivals, traditional handicrafts, performing arts, and curated cultural experiences into a single verified, relational database.

```mermaid
flowchart TD
    subgraph Client["Frontend Layer (React 18 + Vite + TS)"]
        UI["Tricolor UI / Navigation"]
        Map["Leaflet Cultural Map"]
        SearchUI["Universal Search"]
        ChatUI["AI Cultural Guide (English/Hinglish)"]
        ItinUI["Itinerary Generator"]
    end

    subgraph API["Backend API Layer (FastAPI 0.141)"]
        Router["FastAPI REST Routers"]
        SearchSvc["Search & Entity Resolution (RapidFuzz)"]
        AISvc["AI Guide (Grounded RAG + Fallback)"]
        ItinSvc["Itinerary Service (Geo-clustered)"]
        RelSvc["Connected Intelligence Graph Engine"]
    end

    subgraph DataLayer["Persistence & Storage Layer"]
        ORM["SQLAlchemy 2.0 ORM Models"]
        DB[("PostgreSQL 15 / SQLite Fallback")]
        SeedJSON["Validated JSON Seeds (backend/app/data)"]
    end

    UI --> Router
    Map --> Router
    SearchUI --> Router
    ChatUI --> Router
    ItinUI --> Router

    Router --> SearchSvc
    Router --> AISvc
    Router --> ItinSvc
    Router --> RelSvc

    SearchSvc --> ORM
    AISvc --> ORM
    ItinSvc --> ORM
    RelSvc --> ORM

    ORM --> DB
    SeedJSON --> DB
```

## 2. Component Design

### 2.1 Backend Layer (Python / FastAPI)
- **FastAPI Core:** Async request handling, Pydantic v2 strict input/output validation, dependency injection for database sessions.
- **Relational Database Engine:** SQLAlchemy 2.0 supporting PostgreSQL 15+ (production with PostGIS if available) and SQLite (local zero-dependency fallback).
- **Universal Search & Entity Resolution:** Normalization (lowercase, diacritics stripping), alias lookup, and RapidFuzz token-sort similarity scoring to eliminate hallucinations and irrelevant token matches.
- **Connected Cultural Intelligence Engine:** Bidirectional graph traversals linking monuments to regional festivals, living traditions, indigenous crafts, artisan clusters, and authentic experiences.
- **AI Cultural Guide:** Strict Grounded RAG architecture ensuring answers originate purely from verified database records. When records are missing, the assistant returns an exact non-hallucination notice.

### 2.2 Frontend Layer (React 18 / TypeScript / Vite / Tailwind)
- **Design Tokens:** Strict Indian Tricolor palette (`saffron`, `indiaGreen`, `ivory`, `charcoal`) defined in `tailwind.config.js`. Zero extraneous blue or purple accent hues in core components.
- **Global Navigation:** 9 primary exploration tabs + right-hand utility cluster (`Search`, `Ask VIRASAT AI`, `About`) conforming strictly to Grandmaster v2.0 Section 5.1.
- **Interactive Geospatial Map:** Leaflet map with category-coded pins (saffron for monuments, green for festivals, neutral for crafts, outline for experiences), full detail popups, and radius-based nearby discoveries.
- **Verified Badging:** Unified `<VerifiedBadge />` component representing `VERIFIED`, `PARTIALLY_VERIFIED`, and `UNVERIFIED` statuses backed by citable sources.
