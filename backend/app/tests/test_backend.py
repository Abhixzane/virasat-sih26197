import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.repositories.cultural_repository import cultural_repository

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["total_monuments"] > 0
    assert data["total_festivals"] > 0

def test_states_and_cities():
    res_states = client.get("/api/states")
    assert res_states.status_code == 200
    assert len(res_states.json()) > 0

    res_cities = client.get("/api/cities?state=Bihar")
    assert res_cities.status_code == 200
    cities = res_cities.json()
    assert len(cities) > 0

def test_heritage_monuments():
    res = client.get("/api/heritage")
    assert res.status_code == 200
    places = res.json()
    assert len(places) > 0

    # Test single place
    first_id = places[0]["id"]
    res_single = client.get(f"/api/heritage/{first_id}")
    assert res_single.status_code == 200
    assert res_single.json()["id"] == first_id

def test_festivals():
    res = client.get("/api/festivals")
    assert res.status_code == 200
    fests = res.json()
    assert len(fests) > 0

    chhath = [f for f in fests if "chhath" in f["id"].lower()]
    assert len(chhath) > 0
    assert chhath[0]["state"] == "Bihar"

def test_arts_crafts_and_performing_arts():
    res_crafts = client.get("/api/arts-crafts")
    assert res_crafts.status_code == 200
    assert len(res_crafts.json()) > 0

    res_perf = client.get("/api/performing-arts")
    assert res_perf.status_code == 200
    assert len(res_perf.json()) > 0

def test_experiences_and_stories():
    res_exp = client.get("/api/experiences")
    assert res_exp.status_code == 200
    assert len(res_exp.json()) > 0

    res_stories = client.get("/api/stories")
    assert res_stories.status_code == 200
    assert len(res_stories.json()) > 0

def test_universal_search():
    # TEST 1: Search for festival
    res = client.get("/api/search?q=Chhath")
    assert res.status_code == 200
    data = res.json()
    assert data["total_matches"] > 0
    fest_matches = [item for item in data["flat_results"] if "chhath" in item["name"].lower()]
    assert len(fest_matches) > 0

    # Search for craft
    res_craft = client.get("/api/search?q=Madhubani")
    assert res_craft.status_code == 200
    assert res_craft.json()["total_matches"] > 0

def test_connected_cultural_intelligence():
    # Request related heritage for Chhath Puja
    res = client.get("/api/related/festival/fest-chhath-puja")
    assert res.status_code == 200
    data = res.json()
    assert data["primary_record_id"] == "fest-chhath-puja"
    # Verify related records exist
    assert len(data["related_places"]) > 0 or len(data["related_arts"]) > 0 or len(data["related_stories"]) > 0
    assert len(data["source_references"]) > 0

def test_map_locations():
    # TEST 4: Search for heritage place and verify coordinates from database
    res = client.get("/api/map/locations")
    assert res.status_code == 200
    markers = res.json()
    assert len(markers) > 0
    taj = [m for m in markers if "taj" in m["name"].lower()]
    assert len(taj) > 0
    assert abs(taj[0]["latitude"] - 27.1751) < 0.05
    assert abs(taj[0]["longitude"] - 78.0421) < 0.05

def test_ai_cultural_guide():
    # TEST 2: Ask the AI about festival & verify grounding
    payload = {
        "message": "Tell me about Chhath Puja in Bihar and its cultural significance",
        "preferred_language": "en"
    }
    res = client.post("/api/ai/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["grounded_in_database"] is True
    assert len(data["retrieved_records"]) > 0
    assert "Chhath" in data["response"]
    assert len(data["source_references"]) > 0

def test_itinerary_generator():
    # TEST 5: Generate cultural itinerary
    payload = {
        "state_or_destination": "Bihar",
        "days": 2,
        "cultural_interests": ["Heritage", "Monuments"]
    }
    res = client.post("/api/itinerary/generate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["duration_days"] == 2
    assert len(data["days"]) == 2
    assert len(data["verified_map_coordinates"]) > 0

def test_database_synchronization():
    # TEST 3: Update a record through supported data update process
    record_id = "fest-chhath-puja"
    update_payload = {
        "cultural_significance": "UPDATED: Ancient Vedic eco-tradition highlighting environmental balance and community unity without priestly mediation."
    }
    res_sync = client.put(f"/api/sync/record/festival/{record_id}", json=update_payload)
    assert res_sync.status_code == 200
    assert res_sync.json()["status"] == "synchronized"

    # Verify listing reflects update
    res_fest = client.get(f"/api/festivals/{record_id}")
    assert res_fest.status_code == 200
    assert "UPDATED:" in res_fest.json()["cultural_significance"]

    # Verify AI retrieval uses updated record
    ai_res = client.post("/api/ai/chat", json={"message": "What is the cultural significance of Chhath Puja?"})
    assert ai_res.status_code == 200
    assert "UPDATED:" in ai_res.json()["response"]

def test_missing_records_and_invalid_ids():
    # TEST 7: Test missing records and invalid IDs
    res_invalid = client.get("/api/heritage/invalid-nonexistent-id-999")
    assert res_invalid.status_code == 404

    # Empty search query returns all
    res_empty_search = client.get("/api/search?q=")
    assert res_empty_search.status_code == 200
