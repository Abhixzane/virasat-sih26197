import json
import urllib.request
import urllib.parse
import ssl
import re
import time

ctx = ssl._create_unverified_context()

def search_commons_strict(queries, required_tokens, forbidden_tokens=None):
    if forbidden_tokens is None:
        forbidden_tokens = []
    
    base_url = "https://commons.wikimedia.org/w/api.php"
    for q in queries:
        params = {
            "action": "query",
            "generator": "search",
            "gsrsearch": q,
            "gsrnamespace": "6",
            "prop": "imageinfo",
            "iiprop": "url|extmetadata",
            "iiurlwidth": "800",
            "format": "json",
            "gsrlimit": "12"
        }
        url = f"{base_url}?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers={"User-Agent": "VirasatHeritagePlatform/2.0"})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                pages = data.get("query", {}).get("pages", {})
                for pid, p in pages.items():
                    title = p.get("title", "")
                    title_lower = title.lower()
                    if any(title_lower.endswith(ext) for ext in [".svg", ".pdf", ".tif", ".tiff", ".ogg", ".webm", ".djvu", ".gif", ".png"]):
                        continue
                    if any(f in title_lower for f in forbidden_tokens):
                        continue
                    if any(bad in title_lower for bad in ["flag of", "coat of arms", "locator map", "logo", "icon", "schema", "plan of", "diagram", "coin", "map", "sketch", "polling booth", "vote"]):
                        continue
                    
                    # Check if at least one required token is in the title
                    if not any(req_tok.lower() in title_lower for req_tok in required_tokens):
                        # Also check ImageDescription / Categories
                        meta = p.get("imageinfo", [{}])[0].get("extmetadata", {})
                        desc = meta.get("ImageDescription", {}).get("value", "").lower()
                        cats = meta.get("Categories", {}).get("value", "").lower()
                        combined = f"{desc} {cats}"
                        if not any(req_tok.lower() in combined for req_tok in required_tokens):
                            continue

                    # Validate thumbnail and license
                    info = p.get("imageinfo", [{}])[0]
                    thumb = info.get("thumburl", info.get("url", ""))
                    meta = info.get("extmetadata", {})
                    lic = meta.get("LicenseShortName", {}).get("value", "CC BY-SA")
                    artist_raw = meta.get("Artist", {}).get("value", "Wikimedia Commons")
                    artist = re.sub(r"<[^>]+>", "", artist_raw).strip()
                    if not artist or len(artist) > 80:
                        artist = "Wikimedia Commons Contributor"
                    
                    return {
                        "title": title,
                        "image_url": thumb,
                        "license": lic,
                        "attribution": f"{artist} / Wikimedia Commons",
                        "source_url": f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
                    }
        except Exception as ex:
            pass
        time.sleep(0.05)
    return None

test_cases = [
    ("fest-pongal-harvest", "Thai Pongal", ['"Pongal Celebration" Tamil Nadu', '"Pongal pot"', '"Pongal" Tamil festival'], ["pongal"]),
    ("ellora-caves", "Ellora Caves", ['"Kailasa temple" Ellora', '"Ellora Caves"'], ["kailasa", "ellora"]),
    ("hoysala-temples-belur", "Hoysala Belur", ['"Chennakeshava Temple" Belur', '"Hoysaleswara Temple" Halebidu'], ["chennakeshava", "hoysaleswara", "belur", "halebidu", "hoysala"]),
    ("khajuraho-monuments", "Khajuraho", ['"Kandariya Mahadeva" Khajuraho', '"Khajuraho temple"'], ["kandariya", "khajuraho"]),
    ("kaziranga-living-heritage", "Kaziranga", ['"Kaziranga" rhinoceros', '"Kaziranga National Park" landscape'], ["kaziranga", "rhinoceros", "rhino"]),
    ("humayuns-tomb", "Humayun's Tomb", ['"Humayun\'s Tomb" Delhi exterior', '"Humayun\'s Tomb" front'], ["humayun"]),
    ("india-gate", "India Gate", ['"India Gate" New Delhi evening', '"India Gate" Rajpath'], ["india gate"]),
    ("gateway-of-india", "Gateway of India", ['"Gateway of India" Mumbai waterfront', '"Gateway of India" arch'], ["gateway of india"]),
    ("french-quarter-puducherry", "French Quarter Puducherry", ['"French Quarter" Pondicherry', '"White Town" Pondicherry', 'Pondicherry street French'], ["pondicherry", "puducherry", "white town", "french quarter"]),
    ("art-warli-painting", "Warli Painting", ['"Warli painting"', '"Warli" tribal art'], ["warli"]),
    ("craft-punjab-phulkari", "Phulkari", ['"Phulkari" embroidery Punjab', '"Phulkari" dupatta'], ["phulkari"]),
    ("folk-bihu-folk-dance", "Bihu Dance", ['"Bihu dance" Assam', '"Rongali Bihu" dance'], ["bihu"]),
    ("place-lepakshi-veerabhadra", "Lepakshi Veerabhadra", ['"Lepakshi" Nandi', '"Veerabhadra Temple" Lepakshi'], ["lepakshi"])
]

for eid, name, qs, reqs in test_cases:
    res = search_commons_strict(qs, reqs, forbidden_tokens=["ajmer", "münster", "poland", "tarnów", "owlet", "annona", "sattriya", "peacock dance"])
    if res:
        print(f"[FOUND] {name} -> {res['title']} ({res['license']})")
    else:
        print(f"[NOT FOUND] {name} -> Fallback")
