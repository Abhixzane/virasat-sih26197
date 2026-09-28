import json

with open("backend/data/cultural_database.json", encoding="utf-8") as f:
    db = json.load(f)

crafts = db.get("arts_crafts_and_artisans", [])
print(f"Total crafts: {len(crafts)}")
for idx, c in enumerate(crafts, 1):
    print(f"{idx:2}. {c['id']:35} | {c['name'][:30]:30} | {c.get('state'):15} | GI: {str(c.get('gi_status')):5} | {c.get('verification_status')}")
