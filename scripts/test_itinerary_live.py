import sys, os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath("backend"))
from fastapi.testclient import TestClient
from app.main import app




client = TestClient(app)

for dest in ["Tamil Nadu", "Varanasi", "Agra", "Hampi", "Amritsar", "Madurai"]:
    res = client.post("/api/itinerary/generate", json={"state_or_destination": dest, "days": 3})
    assert res.status_code == 200, f"Failed for {dest}: {res.text}"
    data = res.json()
    print(f"=== {dest} ({data['itinerary_title']}) ===")
    for d in data["days"]:
        p_names = [p["name"] for p in d["heritage_places"]]
        h_names = [h["name"] for h in d["nearby_hotels"]]
        r_names = [r["name"] for r in d["nearby_restaurants"]]
        m_names = [m["name"] for m in d["local_markets"]]
        print(f"Day {d['day_number']} [{d.get('day_city')}]: {d.get('route_title')}")
        print(f"  Monuments: {p_names}")
        print(f"  Hotels: {h_names}")
        print(f"  Restaurants: {r_names}")
        print(f"  Markets: {m_names}")
        print(f"  Curator Note: {d.get('curator_travel_note')[:60]}...")
    print()
print("ALL DESTINATION TESTS PASSED 100%!")
