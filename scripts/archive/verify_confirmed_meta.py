import urllib.request, urllib.parse, json, ssl, re, sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ctx = ssl._create_unverified_context()

files = [
    "File:Pongal Celebration in home.JPG",
    "File:Indian rhinoceros in Kaziranga National Park March 2025 by Tisha Mukherjee 02.jpg",
    "File:Bihu Dance , Festival of India.jpg",
    "File:Warli painting.jpg",
    "File:Gidha dance in Punjab state india as on Baisakhi festival celebration.jpg",
    "File:Chinese fishingnet kochi.jpg",
    "File:A man weaving the famous handloom Chanderi Saree.jpg",
    "File:'Phulkari' (bridal shawl), Punjab, early 20th century, cotton, silk and embroidery, Honolulu Academy of Arts.jpg",
    "File:Kaavi Art in the Convent of Santa Monica, Old Goa, India..jpg",
    "File:Evening,india gate,delhi - panoramio.jpg",
    "File:Arch-monument - Gate Way of India.jpg",
    "File:French Quarter, Pondicherry (1) (23662163628).jpg",
    "File:Mysore Palace Dussehra Illumination.jpg",
    "File:Woman doing Block Printing at Bagru village, Jaipur, India.jpg",
    "File:A view of Open hand monument part of Chandigarh Capitol Complex, World Heritage Site.jpg",
    "File:Ellora Cave 16 Pillar.jpg",
    "File:2023 Khajuraho Temple.jpg",
    "File:'Humayun's Tomb'.jpg",
    "File:System of reservoirs and canals found at Dholavira.jpg"
]

results = {}
for fn in files:
    params = {'action': 'query', 'titles': fn, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiurlwidth': '800', 'format': 'json'}
    url = f'https://commons.wikimedia.org/w/api.php?{urllib.parse.urlencode(params)}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Virasat/2.0'})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=8) as r:
            d = json.loads(r.read().decode('utf-8'))
            pages = d.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                if 'imageinfo' in p:
                    info = p['imageinfo'][0]
                    meta = info.get('extmetadata', {})
                    lic = meta.get('LicenseShortName', {}).get('value', 'CC BY-SA')
                    artist_raw = meta.get('Artist', {}).get('value', 'Wikimedia Commons')
                    artist = re.sub(r'<[^>]+>', '', artist_raw).strip()
                    artist = re.sub(r'\s+', ' ', artist)
                    if not artist or len(artist) > 80:
                        artist = "Wikimedia Commons Contributor"
                    results[fn] = {
                        "thumb": info.get('thumburl'),
                        "lic": lic,
                        "attr": f"{artist} / Wikimedia Commons",
                        "src": f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(fn.replace(' ', '_'))}"
                    }
                    print(f"OK: {fn} -> {lic} | {artist}")
                else:
                    print(f"FAILED: {fn}")
    except Exception as e:
        print(f"ERROR: {fn}: {e}")

with open('scripts/confirmed_metadata.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print(f"Saved {len(results)} confirmed image metadata.")
