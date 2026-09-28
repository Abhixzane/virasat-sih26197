import json

with open("backend/data/cultural_database.json", encoding="utf-8") as f:
    db = json.load(f)

total_entities = 0
total_verified = 0
total_partial = 0
total_needs_review = 0

print("=== VIRASAT DATABASE STATUS ===")
for k, v in db.items():
    if not isinstance(v, list):
        continue
    c_ver = sum(1 for x in v if x.get("verification_status") == "VERIFIED")
    c_part = sum(1 for x in v if x.get("verification_status") == "PARTIALLY_VERIFIED")
    c_nr = sum(1 for x in v if x.get("verification_status") == "NEEDS_REVIEW")
    total_entities += len(v)
    total_verified += c_ver
    total_partial += c_part
    total_needs_review += c_nr
    print(f"{k:30} : {len(v):3} total | {c_ver:3} VERIFIED | {c_part:2} PARTIAL | {c_nr:3} NEEDS_REVIEW")

print("=" * 65)
print(f"TOTAL ENTITIES: {total_entities}")
print(f"VERIFIED:       {total_verified}")
print(f"PARTIAL:        {total_partial}")
print(f"NEEDS_REVIEW:   {total_needs_review}")
