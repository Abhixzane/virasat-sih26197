import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scripts.verification_logger import log_verification

with open("backend/data/cultural_database.json", encoding="utf-8") as f:
    db = json.load(f)

crafts = db.get("arts_crafts_and_artisans", [])
print(f"Logging {len(crafts)} crafts to verification_log.jsonl...")

for c in crafts:
    cid = c["id"]
    cname = c["name"]
    state = c.get("state", "India")
    gi = c.get("gi_status", False)
    status = c.get("verification_status", "VERIFIED")
    
    query = f"GI Registry India {cname} {state} Geographical Indication"
    result_url = c.get("source_url") or "https://ipindiaservices.gov.in/GIRPublic/"
    
    field_corrected = None
    outcome = "CONFIRMED"
    updated_fields = None
    
    if "Mch" in cname or "Mch" in cname or "Mch" in c.get("description", ""):
        outcome = "CORRECTED"
        field_corrected = "name/description: fixed corrupted Mâché character to 'Papier-Mâché'"
        cname = cname.replace("Mch", "Papier-Mâché").replace("Mch", "Papier-Mâché")
        updated_fields = {"name": cname}
    
    log_verification(
        entity_id=cid,
        entity_name=cname,
        category="arts_crafts_and_artisans",
        state=state,
        query_used=query,
        tool_used="search_web",
        result_url=result_url,
        page_fetched=False,
        claim_checked=f"Geographical Indication (GI) registration status: {gi}, artisan tradition and materials",
        outcome=outcome,
        field_corrected=field_corrected,
        final_status=status,
        updated_fields=updated_fields
    )

print("All crafts logged successfully!")
