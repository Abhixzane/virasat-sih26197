import json

with open("backend/data/cultural_database.json", encoding="utf-8") as f:
    db = json.load(f)

exp = db.get("cultural_experiences", [])
for e in exp:
    print(f"ID: {e['id']}")
    print(f"Name: {e['name']} ({e.get('state')}, {e.get('city')})")
    print(f"Type: {e.get('experience_type')} | Duration: {e.get('duration_hours')}")
    print(f"Desc: {e.get('description')[:120]}...")
    print(f"Associated Places: {e.get('associated_place_ids', [])}")
    print(f"Associated Crafts: {e.get('associated_craft_ids', [])}")
    print("-" * 60)
