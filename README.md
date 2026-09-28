# VIRASAT (विरासत) — Indian Cultural Heritage Intelligence & Discovery Platform
### Smart India Hackathon 2026 (SIH26197) | Grandmaster v2.0 Production Release

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-red.svg?style=flat&logo=sqlalchemy)](https://www.sqlalchemy.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![Pytest](https://img.shields.io/badge/Backend%20Tests-19%2F19%20Passed-brightgreen.svg?style=flat&logo=pytest)](https://docs.pytest.org)
[![Data Validation](https://img.shields.io/badge/JSON%20Schema-100%25%20Verified-brightgreen.svg)](docs/data-sources.md)

---

## 🏛️ Executive Summary

**VIRASAT (विरासत)** is a full-stack, data-driven Indian cultural heritage intelligence and discovery platform built for the **Smart India Hackathon (SIH 2026)**. Rather than treating India's monuments as isolated tourist stops with fake generic reviews, VIRASAT introduces **Connected Cultural Intelligence™** — an evidence-backed relational knowledge graph bridging:

1. **Heritage Monuments & Architecture** (UNESCO World Heritage Sites, Archaeological Survey of India (ASI) protected monuments, stepwells, hill forts)
2. **Living Traditions & Festivals** (Vedic celebrations, seasonal harvest rituals, temple chariot processions)
3. **GI-Tagged Traditional Crafts** (Registered master artisan lineages, Geographical Indications, traditional handloom)
4. **Folk & Classical Performing Arts** (Sangeet Natak Akademi classical dance forms, shadow puppetry, regional theatre)
5. **Authentic Cultural Experiences** (Dawn riverfront ceremonies, living artisan enclaves, heritage trails)
6. **Cultural Folklore & Oral Narratives** (Archival oral histories and architectural epigraphy)

Every single record is verified against official institutional repositories: **ASI Gazetteers, UNESCO World Heritage Centre, Sangeet Natak Akademi, GI Registry, and State Tourism Archives**.

---

## 🎨 Indian Tricolor Design System

VIRASAT strictly enforces a clean, dignified national design system inspired by the Indian flag and classical stone architecture:
- **Primary Saffron**: `#E05A2B` (deep saffron) — Hero brand accents, monument map pins, primary actions, active navigational states.
- **Secondary India Green**: `#138808` (deep flag green) — Provenance verification badges, experience pins, AI Guide CTA pill.
- **Warm Ivory Canvas**: `#FDFBF7` / `#FAF8F5` — Soft parchment background avoiding harsh pure white glare.
- **Charcoal Neutral Dark**: `#1C1917` / `#292524` — Dignified typography, header banners, footer background.
- **Zero Extraneous Hues**: Core chrome and UI elements are strictly free of generic blue/purple/pink hues.

---

## 🚀 Key Functional Capabilities

### 1. Relational Database & Canonical Schemas (Phase 3)
* **SQLAlchemy 2.0 Relational Engine**: 14 normalized relational tables (`states`, `cities`, `heritage_sites`, `festivals`, `crafts`, `artisans`, `performing_arts`, `cultural_experiences`, `cultural_relationships`, `sources`, `entity_sources`, `images`, `itinerary_sessions`, `search_logs`).
* **Canonical JSON Schemas**: Strict Draft-07 schemas in `backend/app/data/schemas/` ensuring zero unverified fields.
* **Repaired GPS Coordinates**: 100% of monuments have verified WGS84 GPS coordinates (no `(0.0, 0.0)` placeholders).
* **Automated Data Validation**: Reusable validation pipeline (`scripts/validate_data.py`) validates 100% of seed entities before ingestion.

### 2. Connected Cultural Intelligence™ (Graph Explorer)
* **Cross-Collection Relationships**: Bidirectional relational graph mapping monuments to nearby crafts, festivals, and performing arts.
* **Interactive Relationship Modal & Dynamic Detail View**: Detail routes (`/heritage/:slug`, `/festivals/:slug`, `/arts-crafts/:slug`, `/performing-arts/:slug`, `/experiences/:id`) display embedded mini-maps, full descriptions, conditional architectural attributes, and connected recommendation cards.

### 3. Archival Retrieval-Grounded AI Cultural Guide
* **Retrieval-Augmented Generation (RAG)**: Extracts cultural entities, queries the database, and injects verified archival context into prompt synthesis.
* **Strict Fact-Grounding & Hallucination Guard**: When a query cannot be verified, explicitly states:
  > *"I could not find a verified record for this in the VIRASAT database. To maintain archaeological integrity, I cannot provide unverified claims."*
* **Multilingual Fluency**: Seamlessly understands and responds in English, pure Shuddha हिन्दी (Devanagari), and natural conversational Hinglish.
* **Dual Runtime Engine**: Powered by Google Gemini (via `google-genai` SDK) with automatic zero-dependency grounded fallback when offline or without an API key.

### 4. Coherent Cultural Itinerary Generator
* **Nearest-Neighbor Spatial Routing**: Uses the **Haversine formula** to cluster and sequence sites day-by-day along real geographic paths, capping at max 3-4 sites/day to prevent transit fatigue.
* **Living Tradition Immersion**: Pairs each day's architectural monument cluster with a nearby afternoon/evening master craft workshop or cultural experience.
* **Zero Fabricated Schedules**: Renders explicit `"Not available (Consult local ASI office)"` chips for ticket prices and opening hours instead of inventing synthetic values.

### 5. Geospatial Cultural Map of India
* High-performance interactive map powered by **Leaflet** with custom Saffron pins (Monuments) and Green pins (Experiences).
* Real-time spatial proximity discovery panel highlighting nearby heritage within travel radius.
* Direct one-click popups linking to verified entity records.

---

## 📊 Database Inventory (Verified Holdings)

| Collection | Verified Count | Primary Provenance Authority |
| :--- | :--- | :--- |
| **States & Union Territories** | **36 / 36** | Survey of India / Census of India |
| **Cultural Cities & Hubs** | **257** | Ministry of Tourism & State Gazetteers |
| **Heritage Monuments & Sites** | **75** | Archaeological Survey of India (ASI) & UNESCO |
| **Living Traditions & Festivals** | **14** | Sangeet Natak Akademi & Ministry of Culture |
| **Traditional Crafts & Handloom** | **16** | Office of DC Handicrafts & GI Registry |
| **Master Artisan Guilds** | **16** | Recognized Craft Clusters & Societies |
| **Folk & Performing Arts** | **14** | Sangeet Natak Akademi |
| **Cultural Experiences** | **10** | Regional Tourism Boards & Living Communities |
| **Institutional Sources** | **5** | ASI, UNESCO, SNA, GI Registry, India Tourism |
| **Entity Source Citations** | **129** | Peer-reviewed & institutional source links |

---

## 🛠️ Quickstart & Local Setup

### Prerequisites
* **Python**: 3.10+ (tested on Python 3.11 & 3.14)
* **Node.js**: 18+ or 20+
* **npm**: 9+

### 1. Clone & Environment Setup
```bash
git clone https://github.com/your-org/virasat.git
cd virasat

# Copy environment template
cp .env.example .env
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed SQLite database (creates virasat.db with 422+ verified records)
python ../scripts/seed_database.py

# Run all verification tests
pytest app/tests -v

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend API will be accessible at: `http://127.0.0.1:8000` (Interactive Swagger docs: `http://127.0.0.1:8000/docs`).

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Run TypeScript type check and build verification
npm run lint
npm run build

# Start Vite dev server
npm run dev
```
Frontend Web UI will be accessible at: `http://localhost:5173`.

---

## 🐳 Docker Deployment

A full multi-container Docker Compose stack is provided:

```bash
# Start Postgres 16, FastAPI backend, and Nginx frontend in unified network
docker-compose up --build -d

# Check service logs
docker-compose logs -f
```

* **Frontend Web Application**: `http://localhost:3000`
* **FastAPI Backend Service**: `http://localhost:8000/api`
* **PostgreSQL Database**: `localhost:5432`

---

## 🧪 Testing & Verification Suite

Run the full end-to-end backend test suite:
```bash
cd backend
pytest app/tests -v
```

**19 Verified Test Suites (100% Pass Rate):**
- `test_health_endpoint`: Server health and active database records.
- `test_states_and_cities`: All 36 states and cities retrieval.
- `test_heritage_monuments`: Category filters and monuments listing.
- `test_festivals`: Month, season, and festival listings.
- `test_arts_crafts_and_performing_arts`: Craft listings and GI status validation.
- `test_experiences_and_stories`: Cultural experiences and oral narratives.
- `test_universal_search`: Multi-collection fuzzy search and scoring.
- `test_connected_cultural_intelligence`: Cross-collection relationship graph.
- `test_map_locations`: Spatial bounding-box and text filters.
- `test_ai_cultural_guide`: Retrieval-grounding and zero-hallucination fallback.
- `test_itinerary_generator`: Haversine nearest-neighbor route sequencing.
- `test_database_synchronization`: CRUD record update and live AI sync.
- `test_missing_records_and_invalid_ids`: HTTP 404 responses and input safety.
- `test_platform_statistics`: Verified counts across all 7 collections.
- `test_sources_endpoint`: Archival citation links and institutional sources.
- `test_artisans_endpoint`: Master artisan clusters and lineage validation.
- `test_cultural_map_markers`: WGS84 GPS coordinate validation.
- `test_alias_and_fuzzy_search`: Cultural aliases (Kashi -> Varanasi, Qutub -> Qutub Minar).
- `test_slug_lookups`: Slug-based detail view URL lookups.

---

## 📜 Documentation Reference

- **[System Architecture](docs/architecture.md)**: Full architecture specification and Mermaid diagrams.
- **[Database Schema](docs/database-schema.md)**: Complete 14-table relational ERD, keys, and indexes.
- **[Data Sources & Provenance](docs/data-sources.md)**: Institutional hierarchy and CC licensing standards.
- **[REST API Reference](docs/api-documentation.md)**: Complete endpoint documentation and request/response schemas.
- **[Setup & Deployment Guide](docs/setup-guide.md)**: Step-by-step local and production deployment instructions.
- **[Audit Report](docs/audit-report.md)**: Initial codebase audit, remediation steps, and quality scores.

---

## ⚖️ License & Heritage Attribution

All cultural data records are curated from public institutional records maintained by the **Archaeological Survey of India (ASI)**, **UNESCO World Heritage Centre**, **Sangeet Natak Akademi**, **Office of the Development Commissioner (Handicrafts)**, and **Geographical Indications Registry (Intellectual Property India)**.

Source code released under the **MIT License**.
Cultural metadata and photography attributed to respective open archives under **Creative Commons Attribution-ShareAlike (CC BY-SA)**.
