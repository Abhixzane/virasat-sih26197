import urllib.request
import urllib.parse
import ssl
import json
import re

ctx = ssl._create_unverified_context()

def get_wikimedia_image(search_query: str):
    base_url = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": search_query,
        "gsrnamespace": "6",
        "prop": "imageinfo",
        "iiprop": "url|extmetadata",
        "format": "json",
        "gsrlimit": "4"
    }
    url = f"{base_url}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "VirasatHeritagePlatform/2.0 (virasat-heritage@example.org)"})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            for page_id, page in pages.items():
                title = page.get("title", "")
                # Skip SVGs, PDFs, TIFFs, audio/video
                if any(title.lower().endswith(ext) for ext in [".svg", ".pdf", ".tif", ".tiff", ".ogg", ".webm", ".djvu"]):
                    continue
                if "imageinfo" in page and page["imageinfo"]:
                    info = page["imageinfo"][0]
                    img_url = info.get("url", "")
                    meta = info.get("extmetadata", {})
                    license_name = meta.get("LicenseShortName", {}).get("value", "")
                    if not license_name:
                        license_name = meta.get("UsageTerms", {}).get("value", "CC-BY-SA")
                    artist_raw = meta.get("Artist", {}).get("value", "")
                    if not artist_raw:
                        artist_raw = meta.get("Credit", {}).get("value", "Wikimedia Commons")
                    artist = re.sub(r"<[^>]+>", "", artist_raw).strip()
                    artist = re.sub(r"\s+", " ", artist)
                    if not artist or len(artist) > 120:
                        artist = "Wikimedia Commons Contributor"

                    # Verify HTTP resolution of direct image URL
                    test_req = urllib.request.Request(img_url, headers={"User-Agent": "VirasatHeritagePlatform/2.0"}, method="HEAD")
                    try:
                        with urllib.request.urlopen(test_req, context=ctx, timeout=5) as head_resp:
                            if head_resp.status == 200:
                                return {
                                    "title": title,
                                    "image_url": img_url,
                                    "license": license_name,
                                    "attribution": f"{artist} / Wikimedia Commons",
                                    "source_url": f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}",
                                    "status": 200
                                }
                    except Exception:
                        continue
    except Exception as e:
        print(f"Error querying {search_query}: {e}")
    return None

test_items = [
    ("Taj Mahal Agra", "Taj Mahal"),
    ("Stone Chariot Hampi Vittala Temple", "Hampi Stone Chariot"),
    ("Konark Sun Temple Odisha", "Konark Sun Temple"),
    ("Madhubani painting Bihar", "Madhubani Painting"),
    ("Kathakali dance Kerala", "Kathakali"),
    ("Rani ki Vav Patan stepwell", "Rani ki Vav"),
    ("Chhath Puja Arghya", "Chhath Puja")
]

for q, label in test_items:
    res = get_wikimedia_image(q)
    if res:
        print(f"SUCCESS [{label}]:")
        print(f"  Title: {res['title']}")
        print(f"  License: {res['license']}")
        print(f"  Attribution: {res['attribution']}")
        print(f"  URL: {res['image_url'][:75]}...")
    else:
        print(f"FAILED [{label}]")
    print("-" * 50)
