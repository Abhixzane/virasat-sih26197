import json

with open("backend/app/data/verification_log.jsonl", encoding="utf-8") as f:
    lines = [json.loads(line) for line in f if line.strip()]

print(f"Total lines in verification_log.jsonl: {len(lines)}")

verified_with_fetch = set()
for l in lines:
    outcome = str(l.get("outcome", "")).upper()
    if l.get("page_fetched") is True and outcome in ["CONFIRMED", "CORRECTED"]:
        verified_with_fetch.add(l["entity_id"])

print(f"Entities with page_fetched == True: {len(verified_with_fetch)}")
for eid in sorted(verified_with_fetch):
    # find line
    line = next(l for l in lines if l["entity_id"] == eid and l.get("page_fetched") is True)
    print(f"  {line['category']}: {eid} ({line['entity_name']}) - {line['result_url']}")
