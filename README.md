# VIRASAT (विरासत) — AI-Powered Indian Cultural Heritage Discovery Platform
### Smart India Hackathon (SIH26197) | Next-Generation Cultural Intelligence

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![Python Tests](https://img.shields.io/badge/Tests-13%2F13%20Passed-brightgreen.svg?style=flat&logo=pytest)](https://docs.pytest.org)

---

## 🏛️ Project Overview

**VIRASAT (विरासत)** is a full-stack, enterprise-grade digital cultural platform that unlocks the profound richness of India's timeless heritage. Rather than treating monuments as isolated tourist spots, VIRASAT introduces **Connected Cultural Intelligence™** — an interconnected knowledge graph that weaves together:

1. **Monuments & Architectural Wonders** (UNESCO World Heritage Sites, ASI monuments, temple architecture)
2. **Living Traditions & Festivals** (Rituals, seasonal cycles, harvest festivities, regional calendars)
3. **GI-Tagged Traditional Arts & Crafts** (Master weavers, terracotta, metallurgy, Bidriware, Madhubani)
4. **Folk & Performing Arts** (Classical dance forms, temple theatre, shadow puppetry, martial arts)
5. **Authentic Cultural Experiences** (Dawn boat ceremonies, weaving village immersions, artisan workshops)
6. **Folklore, Legends & Oral Narratives** (Epic lore, regional oral histories, architectural mythology)

Every entity is interconnected with bidirectional links, geographic proximity, and thematic relationships, enabling travelers, researchers, students, and culture enthusiasts to explore India with scholarly depth and seamless modern navigation.

---

## 🌟 Key Highlights & Architectural Features

### 1. Connected Cultural Intelligence™ (Graph Explorer)
* **Single Centralized Database**: Zero isolated data siloes. Every monument links directly to its associated regional crafts, performing arts, folklore, and active festivals.
* **Interactive Relationship Modal**: Click "Explore Cultural Connections" on any heritage card to discover deep contextual ties across all 7 cultural dimensions.

### 2. Archival Retrieval-Grounded AI Cultural Guide
* **Strict Fact Grounding**: Uses a Retrieval Engine over verified cultural database records before generating responses.
* **Zero Fabrication Guarantee**: Does not fabricate imaginary ticket prices, synthetic opening hours, or fake government certifications.
* **Direct Record Citations**: AI responses cite exact database entities with clickable badges that open the source records.
* **Graceful Offline / Fallback Mode**: Even without an external LLM API key, an intelligent contextual retrieval synthesizer delivers accurate historical context and related recommendations.

### 3. Universal Multi-Dimensional Search & Discovery
* Real-time search across all 7 collections simultaneously.
* Search by keyword, historical dynasty (e.g., *Chola, Mughal, Vijayanagara*), architectural style (e.g., *Dravidian, Nagara, Indo-Saracenic*), state, or material.
* Quick-action modal (`Ctrl+K` / `⌘K` or search button).

### 4. Interactive Cultural Map of India
* High-performance geospatial visualization powered by **Leaflet**.
* Layer filtering by Monument, Festival, Traditional Craft, and Cultural Experience.
* Pin clustering, interactive popup previews, and one-click navigation to full heritage records.

### 5. AI Cultural Itinerary Generator
* Generates balanced day-by-day travel itineraries based on destination, duration (1–7 days), and cultural focus (Architectural Heritage, Arts & Crafts, Folk Traditions, Spiritual Exploration, or All-Around Immersion).
* Geographically clustered to minimize travel fatigue while ensuring rich cultural depth.

### 6. Authentic Visual Identity & Inclusive UX
* VIRASAT palette: Warm ivory canvas (`#FAF8F5`), royal terracotta (`#C85A32`), deep indigo (`#1E2A4A`), warm gold (`#D4AF37`), and subtle Indian tricolour accents (`#FF9933`, `#138808`).
* Fully responsive layout (Mobile, Tablet, Desktop) with high-contrast accessibility and smooth micro-interactions.

---

## 📊 Cultural Knowledge Base (Verified Data)

VIRASAT consolidates a verified, high-fidelity cultural dataset (`backend/data/cultural_database.json`) consisting of:
* **293 States & Major Cultural Cities**
* **66 Heritage Sites & Monuments** (with historical periods, dynasties, significance, and coordinates)
* **8 Living Traditions & Festivals** (cultural roots, timing, rituals, and regional celebrations)
* **8 Traditional Arts & Crafts** (GI certification status, origin states, raw materials, technique overviews)
* **7 Folk & Performing Arts** (dance forms, musical traditions, classical drama)
* **7 Authentic Cultural Experiences** (curated local immersion activities with best visiting times)
* **6 Cultural Stories & Folklore** (epic traditions, architectural legends, founding myths)

---

## 🏗️ System Architecture

```
                    ┌─────────────────────────────────────────────────────┐
                    │               VIRASAT Web Frontend                 │
                    │   React 18 + TypeScript + Vite + Tailwind CSS       │
                    │ (Interactive Map, Search Modal, Graph Cards, Chat) │
                    └──────────────────────────┬──────────────────────────┘
                                               │ HTTP / REST APIs
                                               ▼
                    ┌─────────────────────────────────────────────────────┐
                    │                VIRASAT FastAPI Backend              │
                    │         (Python 3.10+ / Pydantic V2 / Uvicorn)      │
                    └──────┬───────────┬───────────┬────────────┬─────────┘
                           │           │           │            │
            ┌──────────────▼───┐ ┌─────▼───────┐ ┌─▼──────────┐ ┌▼───────────────┐
            │ Search & Filter  │ │ Relationship│ │ Itinerary  │ │ AI Retrieval   │
            │     Service      │ │   Service   │ │  Generator │ │ & Chat Engine  │
            └──────────────┬───┘ └─────┬───────┘ └─┬──────────┘ └┬───────────────┘
                           │           │           │             │
                           └───────────┼───────────┼─────────────┘
                                       │           │
                                       ▼           ▼
                   ┌──────────────────────────────────────────────┐
                   │       Verified Cultural Knowledge Base       │
                   │        (JSON Knowledge Graph Engine)         │
                   │    Monuments • Crafts • Festivals • Folklore │
                   └──────────────────────────────────────────────┘
```

---

## 📂 Project Directory Structure

```
virasat-sih26197/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py             # All REST endpoints (Heritage, Search, Map, AI, Itinerary)
│   │   ├── core/
│   │   │   └── config.py             # App settings, environment vars, CORS
│   │   ├── models/
│   │   │   └── schemas.py            # Pydantic data models for all 7 cultural collections
│   │   ├── services/
│   │   │   ├── ai_service.py         # Grounded AI Chat engine with vector/text retrieval
│   │   │   ├── database.py           # In-memory fast query & indexing database service
│   │   │   ├── itinerary_service.py  # Geographic & thematic day-by-day itinerary builder
│   │   │   ├── relationships.py      # Cross-collection relational graph discovery
│   │   │   └── search_service.py     # Multi-entity fuzzy & tag-based search engine
│   │   ├── tests/
│   │   │   └── test_backend.py       # 13 comprehensive Pytest test cases
│   │   └── main.py                   # FastAPI initialization & middleware configuration
│   ├── data/
│   │   └── cultural_database.json    # Consolidated cultural knowledge base
│   ├── .env.example                  # Backend environment configuration template
│   ├── Procfile                      # Cloud deployment runner (Render/Railway/Heroku)
│   ├── render.yaml                   # Render Blueprint configuration
│   └── requirements.txt              # Backend Python dependencies
│
├── frontend/
│   ├── public/                       # Static public assets & icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIChatWidget.tsx               # Retrieval-grounded interactive AI assistant
│   │   │   ├── ArtCraftCard.tsx               # GI craft card with materials & GI badge
│   │   │   ├── ConnectedIntelligenceModal.tsx # Knowledge graph relationship explorer
│   │   │   ├── CulturalMapView.tsx            # Leaflet interactive map with layer toggles
│   │   │   ├── ExperienceCard.tsx             # Authentic cultural immersion card
│   │   │   ├── FestivalCard.tsx               # Living traditions & festival card
│   │   │   ├── HeritageCard.tsx               # Monument card with dynasty & history tags
│   │   │   ├── PerformingArtCard.tsx          # Folk & classical performing arts card
│   │   │   ├── SimpleFooter.tsx               # Footer with cultural disclaimer & links
│   │   │   ├── StoryCard.tsx                  # Oral tradition & folklore card
│   │   │   ├── TopNavbar.tsx                  # Responsive navigation bar with quick search
│   │   │   ├── TricolourBranding.tsx          # Indian cultural identity banner
│   │   │   └── UniversalSearchModal.tsx       # Instant search modal with keyboard shortcuts
│   │   ├── pages/
│   │   │   ├── AboutPage.tsx                  # Project mission, methodology, and SIH info
│   │   │   ├── AIGuidePage.tsx                # Dedicated AI Cultural Guide page with prompts
│   │   │   ├── ArtsCraftsPage.tsx             # Traditional crafts & GI registry showcase
│   │   │   ├── CulturalMapPage.tsx            # Fullscreen interactive map page
│   │   │   ├── DiscoverPage.tsx               # Multi-entity discovery hub with filter chips
│   │   │   ├── ExperiencesPage.tsx            # Authentic cultural experiences
│   │   │   ├── FestivalsPage.tsx              # Living traditions & festival calendar
│   │   │   ├── HeritagePage.tsx               # Heritage sites & architectural monuments
│   │   │   ├── HomePage.tsx                   # Immersive hero section & featured traditions
│   │   │   ├── ItineraryPage.tsx              # Custom cultural itinerary planner
│   │   │   ├── PerformingArtsPage.tsx         # Performing arts showcase
│   │   │   └── StoriesPage.tsx                # Folklore & oral traditions repository
│   │   ├── services/
│   │   │   └── api.ts                         # Strongly typed client API service
│   │   ├── types/
│   │   │   └── cultural.ts                    # TypeScript interfaces matching backend models
│   │   ├── App.tsx                            # Main router & modal state provider
│   │   ├── index.css                          # Custom Tailwind rules, typography & scrollbars
│   │   ├── main.tsx                           # React entry point
│   │   └── vite-env.d.ts                      # Vite client environment types
│   ├── .env.example                           # Frontend environment configuration template
│   ├── package.json                           # Frontend scripts & dependencies
│   ├── tailwind.config.js                     # Tailored VIRASAT theme (ivory, terracotta, gold)
│   ├── tsconfig.json                          # TypeScript configuration
│   ├── vercel.json                            # Vercel SPA rewrite configuration
│   └── vite.config.ts                         # Vite bundler configuration
│
├── .gitignore                                 # Git ignore rules for Python & Node
└── README.md                                  # Complete documentation
```

---

## 🚀 Getting Started (Run Locally)

### Prerequisites
* **Python 3.10+** (Tested on Python 3.11 / 3.12 / 3.14)
* **Node.js 18+** and **npm 9+**
* Git

---

### Step 1: Clone or Open the Repository
```bash
cd virasat-sih26197
```

---

### Step 2: Setup and Run the Backend API

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. (Recommended) Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```
   *Note: If you have a Google Gemini or OpenAI API key, you can add it to `AI_API_KEY` in `.env`. If left empty, VIRASAT automatically activates its verified archival context synthesizer without failing!*

5. Run unit and integration tests to verify health:
   ```bash
   pytest
   ```
   *(All 13 tests will pass with 100% green output)*

6. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   The backend API will be available at: **`http://127.0.0.1:8000`**  
   Interactive Swagger documentation: **`http://127.0.0.1:8000/docs`**

---

### Step 3: Setup and Run the Frontend

1. Open a new terminal window and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will be live at: **`http://localhost:5173`**

4. To build for production:
   ```bash
   npm run build
   ```
   The bundled static files will be placed into `frontend/dist/`.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Health check and total count of all 7 cultural collections |
| `/api/heritage` | `GET` | Retrieve monuments with optional `state`, `city`, `dynasty`, `style` filters |
| `/api/heritage/{id}` | `GET` | Detailed record for a single monument |
| `/api/festivals` | `GET` | Living traditions & festivals with optional `state`, `season`, `category` filters |
| `/api/arts-crafts` | `GET` | Traditional crafts with optional `state`, `gi_certified`, `material` filters |
| `/api/performing-arts`| `GET` | Classical & folk performing arts with optional `state`, `art_form` filters |
| `/api/experiences` | `GET` | Curated cultural immersion experiences with duration & season filters |
| `/api/stories` | `GET` | Regional folklore, myths, and oral histories |
| `/api/search` | `GET` | Universal search across all collections (`/api/search?q=chola`) |
| `/api/related/{type}/{id}` | `GET` | Connected Cultural Intelligence graph for any record |
| `/api/map/locations` | `GET` | Map pins with coordinates, category tags, and summary previews |
| `/api/ai/chat` | `POST` | Grounded AI conversation with database context & source citations |
| `/api/itinerary/generate` | `POST` | Custom cultural itinerary generator (destination, days, focus) |

---

## 🧪 Testing & Verification

The backend includes comprehensive test coverage verifying:
1. Health and database integrity across all 7 collections
2. Monument filtering by state, dynasty, and style
3. GI-certified craft indexing and material filtering
4. Universal search across multiple disparate entities
5. Cross-entity graph relationships (Connected Cultural Intelligence)
6. Geographic map marker extraction and coordinate validation
7. Grounded AI chat fallback and context retrieval
8. Itinerary generation logic with day-by-day clustering

To run the test suite:
```bash
cd backend
pytest app/tests/test_backend.py -v
```

---

## ☁️ Deployment Guidelines

### Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Root Directory**: `frontend`
* **Environment Variable**: `VITE_API_URL=https://your-backend-domain.com/api`
* Note: `frontend/vercel.json` is preconfigured to handle client-side Single Page Application (SPA) routing.

### Backend Deployment (Render / Railway / AWS / GCP)
* **Build Command**: `pip install -r requirements.txt`
* **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
* **Root Directory**: `backend`
* Note: `backend/Procfile` and `backend/render.yaml` are included for zero-friction 1-click cloud deployment.

---

## 🤝 Smart India Hackathon Submission Details

* **Problem Statement ID**: SIH26197
* **Project Name**: VIRASAT (विरासत) — Connected Cultural Intelligence Platform
* **Domain**: Heritage, Culture, Tourism & Generative AI
* **Key Innovations**:
  * Graph-linked multi-dimensional cultural taxonomy
  * Fact-grounded generative AI assistant (zero hallucinations, zero fabricated data)
  * Geospatial cultural mapping with layered multi-collection filters
  * Intelligent, fatigue-aware cultural itinerary synthesis

---

## 📄 License & Attribution

Developed with pride for the preservation, digital revival, and intelligent exploration of India's cultural heritage.
Data curated from open tourism archives, Archaeological Survey of India (ASI) public catalogs, and Geographical Indications (GI) Registry.
All rights reserved © 2026 VIRASAT Team.
