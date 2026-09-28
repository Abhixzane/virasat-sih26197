import re

with open('scripts/ingest_batch1.py', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = re.sub(
    r'"origin_region":\s*("[^"]+")',
    r'"origin": \1,\n        "origin_region": \1',
    content
)

with open('scripts/ingest_batch1.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Updated scripts/ingest_batch1.py successfully.')
