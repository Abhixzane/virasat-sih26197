import json
import os

LOG_PATH = "backend/app/data/verification_log.jsonl"
with open(LOG_PATH, "r", encoding="utf-8") as f:
    lines = [json.loads(l) for l in f if l.strip()]

updated_lines = []
for l in lines:
    if l.get("page_fetched") is not True:
        l["final_status"] = "PARTIALLY_VERIFIED"
    else:
        l["final_status"] = "VERIFIED"
    updated_lines.append(l)

with open(LOG_PATH, "w", encoding="utf-8") as f:
    for l in updated_lines:
        f.write(json.dumps(l, ensure_ascii=False) + "\n")

print(f"Updated {len(updated_lines)} lines in {LOG_PATH}")
