import json
import sys

with open("backend/data/cultural_database.json", encoding="utf-8") as f:
    db = json.load(f)

sites = db.get("heritage_places", [])
state = sys.argv[1] if len(sys.argv) > 1 else None

for s in sites:
    if state and state.lower() not in s.get("state", "").lower():
        continue
    print(f"ID: {s['id']}")
    print(f"Name: {s['name']} ({s.get('state')}, {s.get('city')})")
    print(f"Period: {s.get('historical_period')}")
    print(f"Significance: {s.get('historical_significance')}")
    print(f"Style: {s.get('architectural_style')}")
    print(f"Coords: {s.get('latitude')}, {s.get('longitude')}")
    print("-" * 60)
