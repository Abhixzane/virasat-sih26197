import json
import urllib.parse
import re

with open('backend/app/data/image_sourcing_log.jsonl', 'r', encoding='utf-8') as f:
    entries = [json.loads(line) for line in f]

found = [e for e in entries if e.get('outcome') == 'found_licensed_image']

def get_file_title(result_url):
    if not result_url:
        return ''
    path = result_url.split('/wiki/')[-1]
    title = urllib.parse.unquote(path)
    title = title.replace('File:', '').replace('File%3A', '').replace('_', ' ')
    return title

with open('scripts/inspect_titles.txt', 'w', encoding='utf-8') as out:
    for i, e in enumerate(found):
        title = get_file_title(e.get('result_url'))
        out.write(f"{i+1:3d}. [{e['tier']}] {e['entity_type']} | {e['entity_id']}: '{e['entity_name']}' -> '{title}'\n")

print(f"Wrote {len(found)} entries to scripts/inspect_titles.txt")
