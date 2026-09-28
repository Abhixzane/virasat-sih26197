import json
import os
import sys

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_PATH = os.path.join(BASE_DIR, "backend", "app", "data", "verification_log.jsonl")
DB_PATH = os.path.join(BASE_DIR, "backend", "data", "cultural_database.json")

# 1. Load verification log
with open(LOG_PATH, "r", encoding="utf-8") as f:
    log_lines = [json.loads(line) for line in f if line.strip()]

# Determine which entities have at least one confirmed page_fetched == True check
verified_with_fetch = set()
for l in log_lines:
    outcome = str(l.get("outcome", "")).upper()
    if l.get("page_fetched") is True and outcome in ["CONFIRMED", "CORRECTED"]:
        verified_with_fetch.add(l["entity_id"])

print(f"Entities with confirmed page_fetched == True: {len(verified_with_fetch)}")

# 2. Load cultural database
with open(DB_PATH, "r", encoding="utf-8") as f:
    db = json.load(f)

downgraded_counts = {}
total_downgraded = 0

collection_keys = [
    "heritage_places",
    "festivals_and_traditions",
    "arts_crafts_and_artisans",
    "folk_and_performing_arts",
    "cultural_experiences"
]

for coll in collection_keys:
    if coll not in db:
        continue
    items = db[coll]
    downgraded_in_coll = 0
    for item in items:
        eid = item["id"]
        current_status = item.get("verification_status")
        if current_status == "VERIFIED":
            if eid not in verified_with_fetch:
                item["verification_status"] = "PARTIALLY_VERIFIED"
                downgraded_in_coll += 1
                total_downgraded += 1
    downgraded_counts[coll] = downgraded_in_coll

# Save updated database
with open(DB_PATH, "w", encoding="utf-8") as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print(f"Downgrade complete. Total records downgraded: {total_downgraded}")
for coll, cnt in downgraded_counts.items():
    print(f"  {coll}: {cnt} downgraded to PARTIALLY_VERIFIED")

# Check status summary
print("\n=== UPDATED VERIFICATION STATUS BREAKDOWN ===")
for coll in collection_keys:
    items = db[coll]
    v_cnt = sum(1 for x in items if x.get("verification_status") == "VERIFIED")
    pv_cnt = sum(1 for x in items if x.get("verification_status") == "PARTIALLY_VERIFIED")
    nr_cnt = sum(1 for x in items if x.get("verification_status") == "NEEDS_REVIEW")
    print(f"{coll:30} : {len(items):3} total | {v_cnt:3} VERIFIED | {pv_cnt:3} PARTIAL | {nr_cnt:3} NEEDS_REVIEW")
