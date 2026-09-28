import json

with open("backend/data/cultural_database.json", encoding="utf-8") as f:
    db = json.load(f)

fests = db.get("festivals_and_traditions", [])
print(f"Total festivals: {len(fests)}")
for idx, f in enumerate(fests, 1):
    print(f"{idx:2}. {f['id']:36} | {f['name'][:35]:35} | {f['state']:18} | {str(f.get('date_type')):15} | {str(f.get('month_or_season'))[:25]}")
