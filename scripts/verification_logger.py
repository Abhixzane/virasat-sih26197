import os
import json
from datetime import datetime, timezone

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "backend"))
LOG_PATH = os.path.join(BACKEND_DIR, "app", "data", "verification_log.jsonl")
DB_PATH = os.path.join(BACKEND_DIR, "data", "cultural_database.json")

def log_verification(
    entity_id: str,
    entity_name: str,
    category: str,
    state: str,
    query_used: str,
    tool_used: str,
    result_url: str,
    page_fetched: bool,
    claim_checked: str,
    outcome: str,
    field_corrected: str = None,
    final_status: str = "VERIFIED",
    updated_fields: dict = None,
    supporting_claim: str = None,
    source_url: str = None
):
    log_entry = {
        "entity_id": entity_id,
        "entity_name": entity_name,
        "category": category,
        "state": state,
        "query_used": query_used,
        "tool_used": tool_used,
        "result_url": result_url,
        "page_fetched": page_fetched,
        "claim_checked": claim_checked,
        "outcome": outcome,
        "field_corrected": field_corrected,
        "final_status": final_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
    
    # Update DB if provided
    if os.path.exists(DB_PATH):
        with open(DB_PATH, "r", encoding="utf-8") as f:
            db = json.load(f)
        
        collection_map = {
            "festival": "festivals_and_traditions",
            "festivals_and_traditions": "festivals_and_traditions",
            "performing_art": "folk_and_performing_arts",
            "folk_and_performing_arts": "folk_and_performing_arts",
            "heritage_site": "heritage_places",
            "heritage_places": "heritage_places",
            "craft": "arts_crafts_and_artisans",
            "arts_crafts_and_artisans": "arts_crafts_and_artisans",
            "cultural_experience": "cultural_experiences",
            "cultural_experiences": "cultural_experiences",
            "experience": "cultural_experiences"
        }
        coll = collection_map.get(category)
        if coll and coll in db:
            for item in db[coll]:
                if item["id"] == entity_id:
                    item["verification_status"] = final_status
                    if source_url:
                        item["source_url"] = source_url
                    elif result_url:
                        item["source_url"] = result_url
                    if supporting_claim:
                        item["supporting_claim"] = supporting_claim
                    if updated_fields:
                        for k, v in updated_fields.items():
                            item[k] = v
                    break
            with open(DB_PATH, "w", encoding="utf-8") as f:
                json.dump(db, f, indent=2, ensure_ascii=False)

    print(f"[{outcome.upper()}] {entity_id} ({entity_name}) -> {final_status}")

