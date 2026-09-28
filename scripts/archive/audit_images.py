import json
import urllib.request
import urllib.error

with open("backend/data/cultural_database.json", encoding="utf-8") as f:
    db = json.load(f)

# Sample 3 from each of the 5 categories (total 15 records)
sample_entities = []

categories = [
    ("heritage_places", 3),
    ("festivals_and_traditions", 3),
    ("arts_crafts_and_artisans", 3),
    ("folk_and_performing_arts", 3),
    ("cultural_experiences", 3)
]

for cat, count in categories:
    items = db.get(cat, [])
    for item in items[:count]:
        sample_entities.append((cat, item))

print(f"Auditing {len(sample_entities)} sampled entities for image resolution and licensing...\n")

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

results = []

for cat, item in sample_entities:
    eid = item["id"]
    name = item["name"]
    img_url = item.get("image_url")
    src_url = item.get("source_url")
    attribution = item.get("image_attribution")
    license_type = item.get("license") or item.get("image_license")
    
    status_code = None
    content_type = None
    is_working = False
    
    if img_url:
        try:
            req = urllib.request.Request(img_url, headers=headers, method="HEAD")
            with urllib.request.urlopen(req, timeout=5) as resp:
                status_code = resp.status
                content_type = resp.headers.get("Content-Type")
                if status_code in [200, 301, 302] and content_type and "image" in content_type:
                    is_working = True
        except Exception as e:
            try:
                # Some servers reject HEAD, try GET with stream
                req = urllib.request.Request(img_url, headers=headers)
                with urllib.request.urlopen(req, timeout=5) as resp:
                    status_code = resp.status
                    content_type = resp.headers.get("Content-Type")
                    if status_code == 200:
                        is_working = True
            except Exception as e2:
                status_code = f"Err: {e2}"
    
    results.append({
        "category": cat,
        "id": eid,
        "name": name,
        "image_url": img_url,
        "is_working": is_working,
        "status_code": status_code,
        "content_type": content_type,
        "attribution": attribution,
        "license": license_type,
        "source_url": src_url
    })

print(f"{'Category':24} | {'ID':30} | {'URL Status':12} | {'Attribution':12} | {'License':10}")
print("-" * 100)
for r in results:
    url_stat = "200 OK" if r["is_working"] else str(r["status_code"])[:12]
    attr_stat = "Stored" if r["attribution"] else "NULL/Missing"
    lic_stat = str(r["license"]) if r["license"] else "NULL/Missing"
    print(f"{r['category']:24} | {r['id']:30} | {url_stat:12} | {attr_stat:12} | {lic_stat:10}")
