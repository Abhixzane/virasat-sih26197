import json

with open("backend/data/cultural_database.json", encoding="utf-8") as f:
    db = json.load(f)

arts = db.get("folk_and_performing_arts", [])
print(f"Total performing arts: {len(arts)}")
for idx, a in enumerate(arts, 1):
    print(f"{idx:2}. {a['id']:36} | {a['name'][:35]:35} | {a.get('state'):18} | {str(a.get('category'))[:20]}")
