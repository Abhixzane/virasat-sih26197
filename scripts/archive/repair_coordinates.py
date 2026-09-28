import json
import os

monuments_path = r"C:\Users\sinha\.gemini\antigravity\scratch\virasat-extracted\Virasat-SIH-2026-main\data\heritage\monuments.json"
db_path = r"C:\Users\sinha\.gemini\antigravity\scratch\virasat-sih26197\backend\data\cultural_database.json"

with open(monuments_path, "r", encoding="utf-8", errors="ignore") as f:
    monuments = json.load(f)

mon_map = {}
for m in monuments:
    coords = m.get("coordinates") or {}
    if coords.get("lat") and coords.get("lng"):
        name_clean = m.get("name", "").strip().lower()
        id_clean = m.get("id", "").strip().lower()
        mon_map[name_clean] = coords
        mon_map[id_clean] = coords

with open(db_path, "r", encoding="utf-8") as f:
    db = json.load(f)

updated = 0
for p in db.get("heritage_places", []):
    lat = p.get("latitude", 0.0)
    lng = p.get("longitude", 0.0)
    if abs(lat) < 0.1 or abs(lng) < 0.1:
        name_key = p.get("name", "").strip().lower()
        id_key = p.get("id", "").strip().lower()
        coords = mon_map.get(name_key) or mon_map.get(id_key)
        if not coords:
            for k, c in mon_map.items():
                if k in name_key or name_key in k:
                    coords = c
                    break
        if coords:
            p["latitude"] = float(coords["lat"])
            p["longitude"] = float(coords["lng"])
            updated += 1
            print(f"Updated {p['name']}: ({p['latitude']}, {p['longitude']})")

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print(f"Total monuments updated with verified coordinates: {updated}")
