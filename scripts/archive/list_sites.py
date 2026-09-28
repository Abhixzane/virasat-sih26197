import json

with open("backend/data/cultural_database.json", encoding="utf-8") as f:
    db = json.load(f)

sites = db.get("heritage_places", [])
print(f"Total heritage places: {len(sites)}")
import sys
start = int(sys.argv[1]) if len(sys.argv) > 1 else 1
end = int(sys.argv[2]) if len(sys.argv) > 2 else len(sites)

for idx, s in enumerate(sites[start-1:end], start):
    print(f"{idx:3}. {s['id']:36} | {s['name'][:35]:35} | {s.get('state'):18} | {s.get('verification_status')}")
