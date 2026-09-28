"""
Reset all unverified entities (festivals, performing arts, heritage sites, experiences)
to verification_status = 'NEEDS_REVIEW' in cultural_database.json and seeds.
Only the 44 crafts that were specifically audited against IP India GI registry are kept at their verified/partially verified status.
"""
import os
import json

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "backend"))
DB_PATH = os.path.join(BACKEND_DIR, "data", "cultural_database.json")
LOG_PATH = os.path.join(BACKEND_DIR, "app", "data", "verification_log.jsonl")

with open(DB_PATH, "r", encoding="utf-8") as f:
    db = json.load(f)

# Revert festivals
for fest in db.get("festivals_and_traditions", []):
    fest["verification_status"] = "NEEDS_REVIEW"

# Revert performing arts
for art in db.get("folk_and_performing_arts", []):
    art["verification_status"] = "NEEDS_REVIEW"

# Revert heritage places
for site in db.get("heritage_places", []):
    site["verification_status"] = "NEEDS_REVIEW"

# Revert cultural experiences
for exp in db.get("cultural_experiences", []):
    exp["verification_status"] = "NEEDS_REVIEW"

# Initialize empty verification log
os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
with open(LOG_PATH, "w", encoding="utf-8") as f:
    pass  # create empty file

with open(DB_PATH, "w", encoding="utf-8") as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print("Reset complete: All non-craft entities set to NEEDS_REVIEW.")
print(f"Initialized empty verification log at: {LOG_PATH}")
