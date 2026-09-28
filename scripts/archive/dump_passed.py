import json
import urllib.parse
from test_match_rules import passed

with open('scripts/passed_images.txt', 'w', encoding='utf-8') as out:
    for e, title in passed:
        out.write(f"[{e['tier']}] {e['entity_type']} | {e['entity_id']}: '{e['entity_name']}'\n  File: '{title}'\n\n")

print(f"Wrote {len(passed)} passed images to scripts/passed_images.txt")
