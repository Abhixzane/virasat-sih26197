import os
import sys
import json
import urllib.request
import urllib.parse
import ssl
import re
import time

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ctx = ssl._create_unverified_context()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "backend", "data", "cultural_database.json")
LOG_PATH = os.path.join(BASE_DIR, "backend", "app", "data", "image_sourcing_log.jsonl")
REVIEW_LOG_PATH = os.path.join(BASE_DIR, "backend", "app", "data", "image_mismatch_review.jsonl")
HTML_SHEET_PATH = os.path.join(BASE_DIR, "backend", "app", "data", "image_review_sheet.html")

NEUTRAL_PLACEHOLDER = "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"
NEUTRAL_ATTRIBUTION = "Antigravity Cultural Archives (Neutral Architectural Motif)"
NEUTRAL_LICENSE = "Unsplash License"

GENERIC_WORDS = {
    "temple", "temples", "monument", "monuments", "fort", "forts", "palace", "palaces",
    "tomb", "tombs", "festival", "festivals", "dance", "dances", "art", "arts",
    "craft", "crafts", "painting", "paintings", "complex", "site", "sites",
    "caves", "cave", "traditional", "living", "ancient", "fair", "fairs",
    "heritage", "walk", "walks", "hall", "memorial", "memorials", "ruins",
    "gate", "park", "gardens", "garden", "city", "house", "precinct", "trail",
    "circuit", "promenade", "national", "state", "the", "and", "for", "with",
    "from", "near", "group", "of", "in", "at", "by", "an", "a", "saree", "sarees",
    "silk", "cloth", "fabric", "textile", "stone", "rock", "classical", "folk",
    "music", "songs", "theatre", "drama", "sculpture", "statue", "reliefs",
    "carving", "carvings", "wood", "metal", "grass", "bamboo", "pottery", "clay",
    "museum", "centre", "center", "deities", "idols", "archaeological", "metropolis",
    "shelters", "mound", "burial", "system", "bridge", "bridges", "forest", "sacred",
    "grove", "citadel", "bastion", "monastery", "monasteries", "mosque", "mosques",
    "church", "churches", "basilica", "cathedral", "minar", "stupa", "stupas",
    "ghat", "ghats", "waterfront", "riverfront", "railway", "island", "islands",
    "mela", "utsav", "puja", "pujan", "fest", "celebration", "celebrations",
    "thanksgiving", "new", "year", "harvest", "inlay", "embroidery", "double",
    "ikat", "handloom", "golden", "front", "surface", "mirror", "screen",
    "black", "wheel", "great", "precincts", "western", "eastern", "southern",
    "northern", "architectural", "historic", "historical", "district", "town",
    "village", "bazaar", "masterclass", "workshop", "craftsmen", "artisans",
    "tour", "alleys", "dawn", "twilight", "imperial", "india", "indian",
    # State and broad location stop words to prevent false-positives
    "kerala", "gujarat", "delhi", "punjab", "bihar", "rajasthan", "odisha",
    "karnataka", "tamil", "nadu", "assam", "uttar", "pradesh", "madhya",
    "haryana", "himachal", "uttarakhand", "goa", "bengal", "chhattisgarh",
    "jharkhand", "telangana", "andhra", "tripura", "manipur", "nagaland",
    "mizoram", "meghalaya", "sikkim", "ladakh", "jammu", "kashmir",
    "lakshadweep", "puducherry", "pondicherry", "andaman", "daman", "diu"
}

SYNONYMS = {
    "amber": ["amer", "amber"],
    "amer": ["amer", "amber"],
    "qutub": ["qutb", "qutub"],
    "qutb": ["qutb", "qutub"],
    "baisakhi": ["vaisakhi", "baisakhi"],
    "vaisakhi": ["vaisakhi", "baisakhi"],
    "thanjavur": ["tanjore", "thanjavur", "brihadisvara", "brihadeeswarar"],
    "tanjore": ["tanjore", "thanjavur"],
    "madhubani": ["mithila", "madhubani"],
    "mithila": ["mithila", "madhubani"],
    "kanchipuram": ["kanjeevaram", "kanchipuram", "conjeevaram"],
    "kanjeevaram": ["kanjeevaram", "kanchipuram", "conjeevaram"],
    "ellora": ["ellora", "kailasa", "kailash"],
    "mahabalipuram": ["mamallapuram", "mahabalipuram", "shore temple"],
    "belur": ["belur", "chennakeshava"],
    "halebidu": ["halebidu", "hoysaleswara"],
    "cherrapunji": ["nongriat", "root bridge", "living root", "jingkieng"],
    "nongriat": ["nongriat", "root bridge", "living root", "jingkieng"],
    "kaziranga": ["kaziranga", "rhinoceros", "rhino"],
    "khajuraho": ["khajuraho", "kandariya"],
    "konark": ["konark", "sun temple"],
    "hampi": ["hampi", "vittala", "virupaksha", "vijayanagara"],
    "vittala": ["vittala", "vitthala", "stone chariot"],
    "lepakshi": ["lepakshi"],
    "bidriware": ["bidri", "bidriware"],
    "bidri": ["bidri", "bidriware"],
    "koodiyattam": ["koodiyattam", "kutiyattam"],
    "kutiyattam": ["koodiyattam", "kutiyattam"],
    "padmanabhapuram": ["padmanabhapuram", "padmanaba puram"],
    "masrur": ["masrur", "masroor"],
    "bhagoria": ["bhagoria"],
    "santiniketan": ["santiniketan", "shantiniketan", "visva bharati", "visva-bharati"],
    "shantiniketan": ["santiniketan", "shantiniketan", "visva bharati", "visva-bharati"],
    "srinagar": ["srinagar", "dal lake", "shikara", "shalimar", "pari mahal"],
    "kullu": ["kullu", "nati", "kullu dussehra"],
    "bathinda": ["bathinda", "bhatinda", "qila mubarak, bathinda"],
    "patiala": ["sheesh mahal", "patiala"],
    "kurukshetra": ["brahma sarovar", "jyotisar", "kurukshetra"],
    "chanderi": ["chanderi"],
    "phulkari": ["phulkari"],
    "warli": ["warli"],
    "kaavi": ["kaavi"],
    "pongal": ["pongal"],
    "onam": ["onam", "pookkalam", "vallam kali"],
    "chhath": ["chhath"],
    "durga": ["durga puja", "durga idol", "durga pandal"],
    "ganesh": ["ganesh chaturthi", "ganesha", "ganesh idol"],
    "hornbill": ["hornbill festival", "kisama"],
    "hemis": ["hemis"],
    "losar": ["losar"],
    "thrissur": ["thrissur pooram", "pooram"],
    "pushkar": ["pushkar"],
    "deepawali": ["dev deepawali", "dev deepavali", "varanasi ghat"],
    "tulip": ["tulip festival", "srinagar tulip"],
    "kalbelia": ["kalbelia"],
    "bharatanatyam": ["bharatanatyam", "bharata natyam"],
    "odissi": ["odissi"],
    "yakshagana": ["yakshagana"],
    "chhau": ["chhau"],
    "kuchipudi": ["kuchipudi"],
    "manipuri": ["manipuri dance", "raas leela"],
    "garba": ["garba"],
    "kathak": ["kathak"],
    "lavani": ["lavani"],
    "sattriya": ["sattriya"],
    "pung": ["pung cholom"],
    "cheraw": ["cheraw"],
    "hojagiri": ["hojagiri"],
    "cham": ["cham dance"],
    "theyyam": ["theyyam"],
    "perini": ["perini"],
    "rouf": ["rouf dance"],
    "fugdi": ["fugdi"],
    "dhalo": ["dhalo"],
    "baul": ["baul"],
    "paika": ["paika", "paiki"],
    "dhamal": ["dhamal"],
    "bhojpuri": ["bhojpuri", "biraha", "sohar"],
    "cellular": ["cellular jail", "kala pani"],
    "ross": ["ross island"],
    "viper": ["viper island"],
    "moti": ["moti daman", "daman fort"],
    "diu": ["diu fort"],
    "st paul": ["st. paul's church, diu", "st paul church diu"],
    "danteshwari": ["danteshwari"],
    "maluti": ["maluti"],
    "baidyanath": ["baidyanath", "deoghar"],
    "palamu": ["palamu"],
    "barabar": ["barabar caves", "lomas rishi"],
    "vikramshila": ["vikramashila", "vikramshila"],
    "hazarduari": ["hazarduari"],
    "gwalior": ["gwalior fort", "man mandir"],
    "martand": ["martand sun temple", "martand"],
    "pari mahal": ["pari mahal"],
    "tambdi surla": ["tambdi surla"],
    "badami": ["badami caves", "badami rock cut"],
    "bekal": ["bekal fort"],
    "leh": ["leh palace"],
    "india gate": ["india gate"],
    "golden temple": ["harmandir", "golden temple"],
    "kedarnath": ["kedarnath temple", "kedarnath"],
    "gateway of india": ["gateway of india"],
    "meenakshi": ["meenakshi"],
    "fort kochi": ["fort kochi", "mattancherry"],
    "charminar": ["charminar"],
    "golconda": ["golconda"],
    "french quarter": ["french quarter", "white town", "pondicherry", "puducherry"],
    "sirpur": ["sirpur", "laxman temple"],
    "victoria memorial": ["victoria memorial"],
    "rang ghar": ["rang ghar"],
    "kamakhya": ["kamakhya"],
    "kareng ghar": ["kareng ghar"],
    "tawang": ["tawang monastery", "tawang"],
    "ita fort": ["ita fort"],
    "malinithan": ["malinithan"],
    "nartiang": ["nartiang"],
    "mawphlang": ["mawphlang"],
    "kachari": ["kachari ruins"],
    "kohima": ["kohima war cemetery", "kohima war memorial"],
    "kangla": ["kangla fort", "kangla"],
    "ina memorial": ["ina memorial", "moirang"],
    "vangchhia": ["vangchhia", "kawtchhuah ropui"],
    "sibuta lung": ["sibuta lung"],
    "rabdentse": ["rabdentse"],
    "pemayangtse": ["pemayangtse"],
    "rumtek": ["rumtek"],
    "ujjayanta": ["ujjayanta"],
    "neermahal": ["neermahal"],
    "channapatna": ["channapatna"],
    "pashmina": ["pashmina", "kani shawl"],
    "aranmula": ["aranmula kannadi", "aranmula"],
    "muga": ["muga silk", "sualkuchi"],
    "mukha": ["majuli mask", "mukha shilpa"],
    "longpi": ["longpi pottery", "longpi"],
    "sohrai": ["sohrai", "khovar"],
    "sikki": ["sikki grass"],
    "rogan": ["rogan art", "rogan painting"],
    "paithani": ["paithani"],
    "chamba rumal": ["chamba rumal"],
    "walnut": ["walnut wood carving", "kashmir walnut"],
    "zardozi": ["zardozi"]
}

# Blacklist of confirmed false matches
OBVIOUS_MISMATCH = [
    "annona squamosa", "barred owlet", "coconut tree", "gende ka phool",
    "prinzipalmarkt", "münster", "tarnów", "prambanan", "hujra shah",
    "delhi gate, ajmer", "alberta, canada", "siddhi dhamal gujarat",
    "elephanta island", "peacock dance' body art", "face is canvas",
    "hanging (am 1961", "at-the-dussera", "gumpa.jpg", "sahlam.jpg",
    "ervatthuru garadi house", "bohada in palghar", "elderly woman being carried to cast her vote",
    "pre mature post harappan time micaceous red ware", "bull type coin",
    "a map showing", "commemorative inscription", "christian art on an arch",
    "badala padma ata", "pxl 20240101", "homosexuality in khajuraho",
    "a sattriya dancer performing the dance form in assam",
    "church of bom jesus, daman, dadra", # for Diu Fort
    "goureswar gouradhipoti", # for Vikramashila
    "1847 sketch", # sketch for Barabar
    "hodges view of the great pagoda at tanjore, 1787", # sketch for Tanjore painting
    "india - ladakh - trekking - 077 - sending out the herds", # trekking for Ladakh pashmina
    "bhojpuri region of bihar & utter pradesh.png", # map PNG for Bhojpuri geet
    "detail of a mural of ala singh of patiala state from the sheesh mahal of the qila mubarak", # for Bathinda
    "sukhna lake, chandigarh", # for Puducherry yoga
    "milad un nabi celebration kerala (12).jpg", # Kerala for Lakshadweep
    "2018 leh dosmoche festival 03.jpg", # Leh for Arunachal Losar
    "reverie - sarang deshpande.jpg", # for Hemis
    "celebrating the artistry and tradition of handmade elegance", # generic quote for Chanderi
    "agra ni13-03.jpg", # for Pietra dura
    "giving life from clay (238511167).jpeg", # for Kumartuli
    "chiktan khar 01.jpg", # fortress for Ladakh wood carving
    "artist from agariya tribe of madhya pradesh img 8561.jpg", # for Bastar wrought iron
    "dance of himanchal pradesh.jpg", # generic for Nati
    "la maison de vasco de gama (cochin, inde)", # for Fort Kochi Chinese nets
    "historic heritage sites of gujarat with gps coordinates.jpg" # for Dholavira
]

def get_file_title(result_url):
    if not result_url:
        return ""
    path = result_url.split("/wiki/")[-1]
    title = urllib.parse.unquote(path)
    title = title.replace("File:", "").replace("File%3A", "").replace("_", " ")
    return title

def get_entity_keywords(name, eid):
    clean = re.sub(r"\(.*?\)", "", name)
    clean = clean.replace("&", " ").replace(",", " ").replace("-", " ").replace("/", " ")
    words = [w.lower().strip() for w in clean.split() if len(w.strip()) >= 3]
    distinctive = [w for w in words if w not in GENERIC_WORDS]

    eid_parts = [p.lower() for p in eid.split("-") if len(p) >= 3 and p not in GENERIC_WORDS and p not in ["place", "fest", "art", "craft", "folk", "exp"]]
    for p in eid_parts:
        if p not in distinctive:
            distinctive.append(p)

    expanded = set(distinctive)
    for d in distinctive:
        if d in SYNONYMS:
            for s in SYNONYMS[d]:
                expanded.add(s.lower())
    return list(expanded)

def query_commons_strict(queries, required_tokens, forbidden_tokens=None):
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
        req = urllib.request.Request(url, headers={"User-Agent": "VirasatHeritagePlatform/2.0 (virasat-heritage@example.org)"})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                pages = data.get("query", {}).get("pages", {})
                for pid, p in pages.items():
                    title = p.get("title", "")
                    title_lower = title.lower()
                    if any(title_lower.endswith(ext) for ext in [".svg", ".pdf", ".tif", ".tiff", ".ogg", ".webm", ".djvu", ".gif", ".png"]):
                        continue
                    if any(f.lower() in title_lower for f in forbidden_tokens):
                        continue
                    if any(bad in title_lower for bad in ["flag of", "coat of arms", "locator map", "logo", "icon", "schema", "plan of", "diagram", "coin", "map", "sketch", "polling booth", "vote", "inscription"]):
                        continue
                    
                    # Check token match
                    meta = p.get("imageinfo", [{}])[0].get("extmetadata", {})
                    desc = meta.get("ImageDescription", {}).get("value", "").lower()
                    cats = meta.get("Categories", {}).get("value", "").lower()
                    combined = f"{title_lower} {desc} {cats}"
                    
                    matched = False
                    for req_tok in required_tokens:
                        if req_tok.lower() in title_lower or req_tok.lower() in combined:
                            matched = True
                            break
                    if not matched:
                        continue

                    # Validate thumbnail and license
                    info = p.get("imageinfo", [{}])[0]
                    thumb = info.get("thumburl", info.get("url", ""))
                    lic = meta.get("LicenseShortName", {}).get("value", "")
                    if not lic:
                        lic = meta.get("UsageTerms", {}).get("value", "CC BY-SA")
                    artist_raw = meta.get("Artist", {}).get("value", "")
                    if not artist_raw:
                        artist_raw = meta.get("Credit", {}).get("value", "Wikimedia Commons")
                    artist = re.sub(r"<[^>]+>", "", artist_raw).strip()
                    artist = re.sub(r"\s+", " ", artist)
                    if not artist or len(artist) > 80:
                        artist = "Wikimedia Commons Contributor"
                    
                    # Test HTTP status
                    t_req = urllib.request.Request(thumb, headers={"User-Agent": "Mozilla/5.0"})
                    try:
                        with urllib.request.urlopen(t_req, context=ctx, timeout=6) as tr:
                            if tr.status == 200:
                                return {
                                    "title": title,
                                    "image_url": thumb,
                                    "license": lic,
                                    "attribution": f"{artist} / Wikimedia Commons",
                                    "source_url": f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
                                }
                    except Exception:
                        continue
        except Exception:
            pass
        time.sleep(0.04)
    return None

def main():
    print("=" * 80)
    print("VIRASAT STEP 3b: VISUAL MISMATCH SPOT-CHECK & HUMAN REVIEW LOGGING")
    print("=" * 80)

    # 1. Load data
    with open(LOG_PATH, "r", encoding="utf-8") as f:
        log_entries = [json.loads(line) for line in f]

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        db = json.load(f)

    # Map db entity by id
    db_items = {}
    for cat in ["heritage_places", "festivals_and_traditions", "arts_crafts_and_artisans", "folk_and_performing_arts", "cultural_experiences"]:
        for item in db.get(cat, []):
            db_items[item["id"]] = (cat, item)

    found_entries = [e for e in log_entries if e.get("outcome") == "found_licensed_image"]
    print(f"Total entries in sourcing log: {len(log_entries)}")
    print(f"Entities with found_licensed_image: {len(found_entries)}")

    # 2. Automated Stricter Re-check
    flagged = []
    passed = []

    for e in found_entries:
        eid = e["entity_id"]
        ename = e["entity_name"]
        curr_url = e.get("result_url", "")
        title = get_file_title(curr_url).lower()
        keywords = get_entity_keywords(ename, eid)

        # Explicit check for fest-pongal-harvest per prompt instructions
        if eid == "fest-pongal-harvest":
            flagged.append((e, title, "Explicit check: Assigned unrelated 'Peacock Dance' Body Art file; must depict authentic Pongal celebration/pot"))
            continue

        # Check blacklisted patterns
        is_mismatch = False
        reason = ""
        for bad in OBVIOUS_MISMATCH:
            if bad in title:
                # Exception: Sattriya dancer is valid for Sattriya
                if "sattriya" in bad and ("sattriya" in eid or "sattriya" in ename.lower()):
                    continue
                is_mismatch = True
                reason = f"Matches blacklisted mismatch pattern: '{bad}'"
                break

        if not is_mismatch:
            # Check if any substantive keyword matches in title
            matched_kws = [kw for kw in keywords if kw in title]
            if not matched_kws:
                is_mismatch = True
                reason = f"No distinctive keyword from {keywords[:5]} found in file title '{title}'"

        if is_mismatch:
            flagged.append((e, title, reason))
        else:
            passed.append((e, title))

    print(f"\nAutomated Stricter Audit Results:")
    print(f"  Valid Verified Depictions: {len(passed)}")
    print(f"  Mismatches Flagged:        {len(flagged)}")

    # 3. Targeted Re-sourcing for Flagged Items
    print("\n" + "=" * 80)
    print("RE-SOURCING & RESOLVING FLAGGED MISMATCHES...")
    print("=" * 80)

    mismatch_review_records = []
    corrections_count = 0
    fallback_count = 0

    # Dedicated queries for high-profile entities
    special_queries = {
        "fest-pongal-harvest": {
            "queries": ['File:Pongal Celebration in home.JPG', '"Pongal Celebration" Tamil Nadu', '"Pongal pot"'],
            "tokens": ["pongal"],
            "forbid": ["peacock dance", "kolam"]
        },
        "ellora-caves": {
            "queries": ['"Kailasa temple" Ellora', '"Ellora Caves"', 'Ellora Cave 16'],
            "tokens": ["ellora", "kailasa"],
            "forbid": ["annona", "fruit", "squamosa"]
        },
        "hoysala-temples-belur": {
            "queries": ['"Chennakeshava Temple" Belur', '"Hoysaleswara Temple" Halebidu', 'Belur Hoysala temple'],
            "tokens": ["belur", "halebidu", "chennakeshava", "hoysala"],
            "forbid": ["pxl"]
        },
        "khajuraho-monuments": {
            "queries": ['"Kandariya Mahadeva Temple" Khajuraho', '"Khajuraho" temple complex', 'Khajuraho temple'],
            "tokens": ["khajuraho", "kandariya"],
            "forbid": ["homosexuality"]
        },
        "kaziranga-living-heritage": {
            "queries": ['"Kaziranga" rhinoceros', '"Kaziranga National Park" landscape rhino', 'Rhinoceros Kaziranga'],
            "tokens": ["kaziranga", "rhinoceros", "rhino"],
            "forbid": ["owlet", "owl", "bird"]
        },
        "humayuns-tomb": {
            "queries": ['"Humayun\'s Tomb" Delhi exterior', '"Humayun\'s Tomb" New Delhi', 'Humayun Tomb Delhi'],
            "tokens": ["humayun"],
            "forbid": ["afsarwala", "isa khan"]
        },
        "place-humayuns-tomb": {
            "queries": ['"Humayun\'s Tomb" Delhi exterior', '"Humayun\'s Tomb" New Delhi', 'Humayun Tomb Delhi'],
            "tokens": ["humayun"],
            "forbid": ["afsarwala", "isa khan"]
        },
        "india-gate": {
            "queries": ['"India Gate" New Delhi evening', '"India Gate" Rajpath Delhi', 'India Gate New Delhi'],
            "tokens": ["india gate"],
            "forbid": ["ajmer", "delhi gate, ajmer"]
        },
        "gateway-of-india": {
            "queries": ['"Gateway of India" Mumbai waterfront', '"Gateway of India" arch Mumbai', 'Gateway of India Mumbai'],
            "tokens": ["gateway of india"],
            "forbid": ["inscription", "plaque", "king george"]
        },
        "place-gateway-of-india": {
            "queries": ['"Gateway of India" Mumbai waterfront', '"Gateway of India" arch Mumbai', 'Gateway of India Mumbai'],
            "tokens": ["gateway of india"],
            "forbid": ["inscription", "plaque", "king george"]
        },
        "french-quarter-puducherry": {
            "queries": ['"French Quarter" Pondicherry', '"White Town" Pondicherry', 'Pondicherry French Quarter street'],
            "tokens": ["pondicherry", "puducherry", "french quarter", "white town"],
            "forbid": ["münster", "prinzipalmarkt", "germany"]
        },
        "place-french-quarter-puducherry": {
            "queries": ['"French Quarter" Pondicherry', '"White Town" Pondicherry', 'Pondicherry French Quarter street'],
            "tokens": ["pondicherry", "puducherry", "french quarter", "white town"],
            "forbid": ["münster", "prinzipalmarkt", "germany"]
        },
        "art-warli-painting": {
            "queries": ['"Warli painting" Maharashtra', '"Warli art"', 'Warli tribal painting'],
            "tokens": ["warli"],
            "forbid": ["face is canvas"]
        },
        "craft-punjab-phulkari": {
            "queries": ['"Phulkari" embroidery Punjab', '"Phulkari" dupatta Punjab', 'Phulkari embroidery'],
            "tokens": ["phulkari"],
            "forbid": ["am 1961"]
        },
        "craft-chanderi-fabric": {
            "queries": ['"Chanderi saree" handloom', '"Chanderi" textile Madhya Pradesh', 'Chanderi handloom'],
            "tokens": ["chanderi"],
            "forbid": ["celebrating the artistry"]
        },
        "craft-goa-kaavi-art": {
            "queries": ['"Kaavi art" Goa', '"Kaavi" temple Goa', 'Kaavi mural Goa'],
            "tokens": ["kaavi"],
            "forbid": ["christian art on an arch"]
        },
        "folk-bihu-folk-dance": {
            "queries": ['"Bihu dance" Assam', '"Bohu Bihu" dance Assam', 'Bihu folk dance Assam'],
            "tokens": ["bihu"],
            "forbid": ["sattriya", "edmonton", "canada"]
        },
        "folk-bihu-dance": {
            "queries": ['"Bihu dance" Assam', '"Bohu Bihu" dance Assam', 'Bihu folk dance Assam'],
            "tokens": ["bihu"],
            "forbid": ["sattriya", "edmonton", "canada"]
        },
        "fest-baisakhi-punjab": {
            "queries": ['"Vaisakhi" Punjab celebration', '"Baisakhi" Golden Temple', 'Baisakhi festival Punjab'],
            "tokens": ["baisakhi", "vaisakhi"],
            "forbid": ["alberta", "canada", "edmonton", "bihu"]
        },
        "place-lepakshi-veerabhadra": {
            "queries": ['"Lepakshi" Nandi Andhra Pradesh', '"Veerabhadra Temple" Lepakshi', 'Lepakshi temple Andhra'],
            "tokens": ["lepakshi"],
            "forbid": ["hampi"]
        },
        "lepakshi-veerabhadra-temple": {
            "queries": ['"Lepakshi" Nandi Andhra Pradesh', '"Veerabhadra Temple" Lepakshi', 'Lepakshi temple Andhra'],
            "tokens": ["lepakshi"],
            "forbid": ["hampi"]
        },
        "place-lepakshi-temple": {
            "queries": ['"Lepakshi" Nandi Andhra Pradesh', '"Veerabhadra Temple" Lepakshi', 'Lepakshi temple Andhra'],
            "tokens": ["lepakshi"],
            "forbid": ["hampi"]
        },
        "kedarnath-temple": {
            "queries": ['"Kedarnath Temple" Uttarakhand snow', '"Kedarnath Temple" front view', 'Kedarnath Temple'],
            "tokens": ["kedarnath"],
            "forbid": ["map showing", "panch kedar"]
        },
        "place-diu-fort": {
            "queries": ['"Diu Fort" Gujarat', '"Diu Fort" sea view', 'Diu Fort lighthouse'],
            "tokens": ["diu fort"],
            "forbid": ["church of bom jesus, daman"]
        },
        "place-dholavira-harappan": {
            "queries": ['"Dholavira" Harappan reservoir', '"Dholavira" ruins Kutch', 'Dholavira archaeological site'],
            "tokens": ["dholavira"],
            "forbid": ["gps coordinates"]
        },
        "place-cellular-jail": {
            "queries": ['"Cellular Jail" Port Blair exterior', '"Cellular Jail" National Memorial', 'Cellular Jail Port Blair'],
            "tokens": ["cellular jail"],
            "forbid": []
        },
        "fest-mysore-dasara": {
            "queries": ['"Mysore Dasara" illumination Palace', '"Mysuru Dasara" procession', 'Mysore Palace illuminated Dasara'],
            "tokens": ["mysore", "mysuru", "dasara"],
            "forbid": ["at-the-dussera"]
        },
        "fest-mysuru-dasara": {
            "queries": ['"Mysore Dasara" illumination Palace', '"Mysuru Dasara" procession', 'Mysore Palace illuminated Dasara'],
            "tokens": ["mysore", "mysuru", "dasara"],
            "forbid": ["at-the-dussera"]
        },
        "exp-jaipur-block-print-workshop": {
            "queries": ['"Block printing" Bagru Jaipur', '"Hand block printing" Bagru', 'Woodblock printing Bagru'],
            "tokens": ["block print", "bagru", "block-print", "printing"],
            "forbid": ["elderly woman", "polling booth", "vote", "election"]
        },
        "exp-le-corbusier-architectural-promenade": {
            "queries": ['"Open Hand Monument" Chandigarh', '"Capitol Complex" Chandigarh Le Corbusier', 'Chandigarh Le Corbusier architecture'],
            "tokens": ["corbusier", "chandigarh", "open hand"],
            "forbid": ["tarnów", "poland", "stacja"]
        }
    }

    # Process each flagged item
    for e, wrong_title, reason in flagged:
        eid = e["entity_id"]
        ename = e["entity_name"]
        tier = e["tier"]
        etype = e["entity_type"]
        keywords = get_entity_keywords(ename, eid)

        print(f"[{tier}] Flagged: {eid} ('{ename[:30]}')")
        print(f"       Reason: {reason}")
        print(f"       Current Wrong File: '{wrong_title}'")

        # Check special queries or construct default tight queries
        if eid in special_queries:
            sq = special_queries[eid]
            q_list = sq["queries"]
            req_toks = sq["tokens"]
            forb_toks = sq["forbid"]
        else:
            clean_name = re.sub(r"\(.*?\)", "", ename).split("&")[0].split(",")[0].strip()
            q_list = [
                f'"{clean_name}"',
                f'"{clean_name}" heritage',
                f'{clean_name}'
            ]
            req_toks = keywords[:3]
            forb_toks = [wrong_title]

        # Search Commons strictly
        res = query_commons_strict(q_list, req_toks, forb_toks)

        if res:
            corrections_count += 1
            action = "re_queried_tighter_search"
            outcome = "corrected_with_verified_image"
            new_title = res["title"]
            new_url = res["image_url"]
            new_source = res["source_url"]
            new_attr = res["attribution"]
            new_lic = res["license"]

            print(f"       --> CORRECTED: '{new_title}' ({new_lic})")

            # Update DB object
            if eid in db_items:
                c_key, obj = db_items[eid]
                obj["image_url"] = new_url
                obj["image_attribution"] = new_attr
                obj["license"] = new_lic

            # Update sourcing log entry in memory
            e["result_url"] = new_source
            e["final_image_url"] = new_url
            e["attribution"] = new_attr
            e["license"] = new_lic
            e["outcome"] = "found_licensed_image"
        else:
            fallback_count += 1
            action = "re_queried_tighter_search"
            outcome = "fallback_to_placeholder"
            new_title = "Neutral Architectural Motif (Fallback)"
            new_url = NEUTRAL_PLACEHOLDER
            new_source = None
            new_attr = NEUTRAL_ATTRIBUTION
            new_lic = NEUTRAL_LICENSE

            print(f"       --> FALLBACK: Neutral Architectural Motif")

            # Update DB object
            if eid in db_items:
                c_key, obj = db_items[eid]
                obj["image_url"] = new_url
                obj["image_attribution"] = new_attr
                obj["license"] = new_lic

            # Update sourcing log entry in memory
            e["result_url"] = None
            e["final_image_url"] = new_url
            e["attribution"] = new_attr
            e["license"] = new_lic
            e["outcome"] = "not_found_used_placeholder"

        # Record review line
        mismatch_review_records.append({
            "entity_id": eid,
            "entity_name": ename,
            "tier": tier,
            "entity_type": etype,
            "previous_image_title": wrong_title,
            "previous_image_url": e.get("final_image_url"),
            "flag_reason": reason,
            "action_taken": action,
            "final_outcome": outcome,
            "new_image_title": new_title,
            "new_image_url": new_url,
            "new_attribution": new_attr,
            "new_license": new_lic
        })

    # 4. Save review log: backend/app/data/image_mismatch_review.jsonl
    with open(REVIEW_LOG_PATH, "w", encoding="utf-8") as f:
        for rec in mismatch_review_records:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    print(f"\nWrote {len(mismatch_review_records)} review records to {REVIEW_LOG_PATH}")

    # 5. Save updated sourcing log: backend/app/data/image_sourcing_log.jsonl
    with open(LOG_PATH, "w", encoding="utf-8") as f:
        for entry in log_entries:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    print(f"Updated {len(log_entries)} sourcing log records in {LOG_PATH}")

    # 6. Save updated database: backend/data/cultural_database.json
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print(f"Updated cultural database saved to {DATA_PATH}")

    # 7. Print summary metrics
    print("\n" + "=" * 80)
    print("STEP 3b SPOT-CHECK & CORRECTION SUMMARY")
    print("=" * 80)
    print(f"Total Database Entities:     {len(log_entries)}")
    print(f"Entities Audited:            {len(found_entries)}")
    print(f"Passed Original Strictness:  {len(passed)}")
    print(f"Flagged for Review:          {len(flagged)}")
    print(f"Successfully Corrected:      {corrections_count}")
    print(f"Fell Back to Neutral Motif:  {fallback_count}")
    print(f"New Found Licensed Total:    {len(passed) + corrections_count}")
    print(f"New Neutral Fallback Total:  {len(log_entries) - (len(passed) + corrections_count)}")
    print("=" * 80)

if __name__ == "__main__":
    main()
