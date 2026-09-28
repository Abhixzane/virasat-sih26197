import urllib.request
import urllib.parse
import ssl
import json
import re
import time

ctx = ssl._create_unverified_context()

def fetch_wikimedia_photo(query: str):
    base_url = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": "6",
        "prop": "imageinfo",
        "iiprop": "url|extmetadata",
        "iiurlwidth": "800",
        "format": "json",
        "gsrlimit": "6"
    }
    url = f"{base_url}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "VirasatHeritagePlatform/2.0 (virasat-heritage@example.org)"})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            for page_id, page in pages.items():
                title = page.get("title", "")
                # Skip non-photo formats
                if any(title.lower().endswith(ext) for ext in [".svg", ".pdf", ".tif", ".tiff", ".ogg", ".webm", ".djvu", ".gif"]):
                    continue
                # Skip coats of arms, flags, maps, logos, icons
                title_lower = title.lower()
                if any(bad in title_lower for bad in ["flag of", "coat of arms", "locator map", "logo", "icon", "schema", "plan of"]):
                    continue
                if "imageinfo" in page and page["imageinfo"]:
                    info = page["imageinfo"][0]
                    thumb_url = info.get("thumburl", info.get("url", ""))
                    meta = info.get("extmetadata", {})
                    license_name = meta.get("LicenseShortName", {}).get("value", "")
                    if not license_name:
                        license_name = meta.get("UsageTerms", {}).get("value", "CC-BY-SA")
                    artist_raw = meta.get("Artist", {}).get("value", "")
                    if not artist_raw:
                        artist_raw = meta.get("Credit", {}).get("value", "Wikimedia Commons")
                    artist = re.sub(r"<[^>]+>", "", artist_raw).strip()
                    artist = re.sub(r"\s+", " ", artist)
                    if not artist or len(artist) > 100:
                        artist = "Wikimedia Commons Contributor"

                    # Quick GET verify on thumb_url
                    t_req = urllib.request.Request(thumb_url, headers={"User-Agent": "Mozilla/5.0"})
                    try:
                        with urllib.request.urlopen(t_req, context=ctx, timeout=6) as tr:
                            if tr.status == 200:
                                return {
                                    "title": title,
                                    "image_url": thumb_url,
                                    "license": license_name,
                                    "attribution": f"{artist} / Wikimedia Commons",
                                    "source_url": f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}",
                                    "status": 200
                                }
                    except Exception:
                        continue
    except Exception as e:
        pass
    return None

test_set = [
    ("Taj Mahal", "Taj Mahal Agra building"),
    ("Stone Chariot Hampi", "Stone Chariot Vittala Temple Hampi"),
    ("Rani ki Vav", "Rani ki Vav Patan stepwell"),
    ("Amber Fort", "Amber Fort Jaipur Rajasthan"),
    ("Konark Sun Temple", "Sun Temple Main Structure Konark"),
    ("Chhatrapati Shivaji Terminus", "Chhatrapati Shivaji Terminus Mumbai building"),
    ("Humayun's Tomb", "Humayun's Tomb Delhi mausoleum"),
    ("Qutub Minar", "Qutub Minar Delhi tower"),
    ("Red Fort", "Red Fort Delhi Lal Qila"),
    ("Ajanta Caves", "Ajanta Caves Maharashtra"),
    ("Ellora Caves", "Kailasa temple Ellora Caves"),
    ("Basilica of Bom Jesus", "Basilica of Bom Jesus Old Goa"),
    ("Mahabodhi Temple", "Mahabodhi Temple Bodh Gaya"),
    ("Brihadisvara Temple", "Brihadisvara Temple Thanjavur"),
    ("Shore Temple", "Shore Temple Mahabalipuram"),
    ("Khajuraho", "Kandariya Mahadeva temple Khajuraho"),
    ("Sanchi Stupa", "Great Stupa Sanchi"),
    ("Diwali", "Diwali diya lamps celebration"),
    ("Durga Puja", "Durga Puja idol Kolkata"),
    ("Onam", "Onam Pookkalam Kerala"),
    ("Pongal", "Pongal pot festival celebration"),
    ("Bihu", "Rongali Bihu dance Assam"),
    ("Hornbill Festival", "Hornbill Festival Nagaland"),
    ("Chhath Puja", "Chhath Puja sunrise Bihar"),
    ("Madhubani Painting", "Madhubani painting Mithila"),
    ("Pashmina Shawl", "Pashmina shawl Kashmir"),
    ("Bidriware", "Bidriware Bidar Karnataka"),
    ("Patan Patola", "Patan Patola saree Gujarat"),
    ("Kanchipuram Silk", "Kanchipuram silk saree"),
    ("Channapatna Toys", "Channapatna wooden toys"),
    ("Jaipur Blue Pottery", "Jaipur blue pottery"),
    ("Kathakali", "Kathakali dancer Kerala"),
    ("Bharatanatyam", "Bharatanatyam dancer"),
    ("Chhau Dance", "Chhau dance mask"),
    ("Kalbelia Dance", "Kalbelia dancer Rajasthan"),
    ("Kalaripayattu", "Kalaripayattu martial art Kerala")
]

success = 0
for name, q in test_set:
    res = fetch_wikimedia_photo(q)
    if res:
        success += 1
        print(f"[OK] {name:28s} -> {res['license']:14s} | {res['attribution'][:30]} | {res['image_url'][:60]}...")
    else:
        print(f"[MISS] {name:26s} (query: {q})")
    time.sleep(0.1)

print(f"\nTotal tested: {len(test_set)}, Success: {success}/{len(test_set)}")
