# VIRASAT — REST API Reference Documentation

**Base URL:** `http://localhost:8000/api`  
**Interactive OpenAPI UI:** `http://localhost:8000/docs`  
**Alternative ReDoc UI:** `http://localhost:8000/redoc`

---

## 1. System & Health

### `GET /health`
Returns system status, active database backend, and total verified records loaded.
- **Response:**
  ```json
  {
    "status": "online",
    "platform": "VIRASAT Cultural Intelligence Platform",
    "version": "2.0.0",
    "database_backend": "SQLite (SQLAlchemy 2.0)",
    "database_records_loaded": 431
  }
  ```

### `GET /statistics`
Returns live platform counters for the Home dashboard and statistics strip.
- **Response:**
  ```json
  {
    "heritage_places": 75,
    "states_represented": 36,
    "festivals": 14,
    "crafts": 16,
    "performing_arts": 14,
    "cultural_experiences": 10,
    "stories": 9,
    "total_records": 431
  }
  ```

---

## 2. Geography & Locations

### `GET /states`
Retrieve all 36 Indian States and Union Territories.

### `GET /states/{state_id}`
Retrieve detailed cultural overview for a specific state.

### `GET /cities`
Retrieve cities with optional `?state=` filter.

### `GET /cities/{city_id}`
Retrieve city record by ID.

---

## 3. Heritage Places & Monuments

### `GET /heritage`
- **Query Params:**
  - `state` (string, optional)
  - `city` (string, optional)
  - `category` (string, optional)
  - `search` (string, optional)
  - `limit` (int, default 50)
  - `offset` (int, default 0)

### `GET /heritage/{slug_or_id}`
Retrieve a specific heritage site by its unique slug (e.g. `qutub-minar-complex`) or ID.

---

## 4. Festivals & Living Traditions

### `GET /festivals`
- **Query Params:**
  - `state` (string, optional)
  - `month` (string, optional)
  - `date_type` (`FIXED` | `LUNAR` | `ANNUAL_OFFICIAL` | `APPROX_SEASONAL`, optional)

### `GET /festivals/{slug_or_id}`
Retrieve a festival record by slug or ID.

---

## 5. Arts, Crafts & Artisans

### `GET /crafts` (or `/arts-crafts`)
- **Query Params:**
  - `state` (string, optional)
  - `category` (string, optional)
  - `gi_status` (`REGISTERED` | `APPLIED` | `NOT_REGISTERED` | `UNKNOWN`, optional)

### `GET /crafts/{slug_or_id}`
Retrieve a craft record by slug or ID.

### `GET /artisans`
Retrieve documented artisan clusters and master crafts profiles.

---

## 6. Folk & Performing Arts

### `GET /performing-arts`
- **Query Params:**
  - `state` (string, optional)
  - `category` (string, optional)

### `GET /performing-arts/{slug_or_id}`
Retrieve a performing art record by slug or ID.

---

## 7. Cultural Experiences

### `GET /experiences`
- **Query Params:**
  - `state` (string, optional)
  - `city` (string, optional)
  - `informational_or_bookable` (`INFORMATIONAL` | `BOOKABLE`, optional)

### `GET /experiences/{id}`
Retrieve cultural experience by ID.

---

## 8. Interactive Cultural Map

### `GET /cultural-map/markers` (or `/map/locations`)
Returns GeoJSON-compatible coordinate markers for monuments, festivals, crafts, and experiences.
- **Query Params:**
  - `state` (string, optional)
  - `category` (string, optional)
  - `min_lat`, `max_lat`, `min_lng`, `max_lng` (bounding box, optional)

---

## 9. Universal Cultural Search & Entity Resolution

### `GET /search?q={query}`
Cross-collection search with RapidFuzz token-sort similarity, alias resolution, category filtering, and ranking.

---

## 10. Connected Cultural Intelligence

### `GET /entities/{entity_type}/{id}/related` (or `/related/{type}/{id}`)
Graph-based bidirectional relationships connecting monuments, festivals, crafts, and experiences.

---

## 11. AI Cultural Guide

### `POST /ai/chat`
- **Request Body:**
  ```json
  {
    "message": "Tell me about Vittala Temple musical pillars",
    "conversation_history": [],
    "preferred_language": "en"
  }
  ```
- **Response:**
  ```json
  {
    "response": "...",
    "grounded_in_database": true,
    "retrieved_records": [...],
    "source_references": ["https://asi.nic.in"],
    "suggested_follow_ups": [...]
  }
  ```

---

## 12. Cultural Itinerary Generator

### `POST /itinerary/generate`
- **Request Body:**
  ```json
  {
    "state_or_destination": "Rajasthan",
    "days": 3,
    "cultural_interests": ["heritage", "crafts"]
  }
  ```
- **Response:**
  Day-wise itinerary grouped by geographical proximity with real verified stops.
