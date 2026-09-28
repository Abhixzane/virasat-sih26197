import json

with open("backend/data/cultural_database.json", encoding="utf-8") as f:
    db = json.load(f)

exp = db.get("cultural_experiences", [])
print(f"Total cultural experiences: {len(exp)}")
for idx, e in enumerate(exp, 1):
    print(f"{idx:2}. {e['id']:35} | {e['name'][:35]:35} | {e.get('state'):15} | {e.get('verification_status')}")
