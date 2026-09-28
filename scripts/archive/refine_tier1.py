import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
from scripts.source_images_full import query_wikimedia, DATA_PATH, LOG_PATH

targets = [
    ("kaziranga-living-heritage", "Kaziranga National Park Assam"),
    ("place-dholavira-harappan", "Dholavira Gujarat ruins"),
    ("fest-hemis-tsechu", "Hemis festival Ladakh mask"),
    ("art-tanjore-painting", "Tanjore painting Tamil Nadu"),
    ("art-warli-bamboo-craft", "Warli painting"),
    ("craft-kalamkari-srikalahasti", "Kalamkari textile"),
    ("craft-patan-patola", "Patola weaving Gujarat"),
    ("craft-kullu-shawl", "Kullu shawl Himachal Pradesh"),
    ("craft-goa-kaavi-art", "Kaavi art")
]

with open(DATA_PATH, "r", encoding="utf-8") as f:
    db = json.load(f)

# Read existing log
with open(LOG_PATH, "r", encoding="utf-8") as f:
    log_lines = [json.loads(line) for line in f]

log_map = {l["entity_id"]: l for l in log_lines}

updated = 0
for eid, q in targets:
    res = query_wikimedia(q)
    if res:
        print(f"FOUND [{eid}]: {res['license']} | {res['attribution']} | {res['title']}")
        # Update db
        for coll in ["heritage_places", "festivals_and_traditions", "arts_crafts_and_artisans", "folk_and_performing_arts"]:
            for item in db[coll]:
                if item["id"] == eid:
                    item["image_url"] = res["image_url"]
                    item["image_attribution"] = res["attribution"]
                    item["license"] = res["license"]
                    updated += 1
                    # Update log line
                    if eid in log_map:
                        log_map[eid].update({
                            "query": f"{q} Wikimedia Commons",
                            "result_url": res["source_url"],
                            "fetched": True,
                            "outcome": "found_licensed_image",
                            "license": res["license"],
                            "attribution": res["attribution"],
                            "final_image_url": res["image_url"],
                            "http_status": 200
                        })
    else:
        print(f"STILL MISSING [{eid}]")

print(f"Refined update count: {updated}")

with open(DATA_PATH, "w", encoding="utf-8") as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

with open(LOG_PATH, "w", encoding="utf-8") as f:
    for line in log_lines:
        f.write(json.dumps(line, ensure_ascii=False) + "\n")
