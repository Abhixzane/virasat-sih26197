import json

db = json.load(open("backend/data/cultural_database.json", encoding="utf-8"))

unesco = []
for p in db["heritage_places"]:
    sig = p.get("historical_significance", "").lower()
    desc = p.get("description", "").lower()
    src = p.get("source_url", "").lower()
    name = p.get("name", "").lower()
    if "unesco" in sig or "unesco" in desc or "unesco" in src or "world heritage" in sig or "world heritage" in desc:
        unesco.append(p)

print(f"Total UNESCO places: {len(unesco)}")
for i, p in enumerate(unesco):
    print(f"{i+1:2d}. {p['id']}: {p['name']} ({p['state']})")
