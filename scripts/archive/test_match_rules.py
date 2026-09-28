import json
import urllib.parse
import re

with open('backend/app/data/image_sourcing_log.jsonl', 'r', encoding='utf-8') as f:
    entries = [json.loads(line) for line in f]

found = [e for e in entries if e.get('outcome') == 'found_licensed_image']

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
    "tour", "trail", "circuit", "promenade", "alleys", "dawn", "twilight", "imperial"
}

SYNONYMS = {
    "amber": ["amer", "amber"],
    "amer": ["amer", "amber"],
    "qutub": ["qutb", "qutub"],
    "qutb": ["qutb", "qutub"],
    "baisakhi": ["vaisakhi", "baisakhi"],
    "vaisakhi": ["vaisakhi", "baisakhi"],
    "thanjavur": ["tanjore", "thanjavur", "brihadisvara", "brihadeeswarar"],
    "tanjore": ["tanjore", "thanjavur", "brihadisvara", "brihadeeswarar"],
    "madhubani": ["mithila", "madhubani"],
    "mithila": ["mithila", "madhubani"],
    "kanchipuram": ["kanjeevaram", "kanchipuram", "conjeevaram"],
    "kanjeevaram": ["kanjeevaram", "kanchipuram", "conjeevaram"],
    "ellora": ["ellora", "kailasa", "kailash"],
    "mahabalipuram": ["mamallapuram", "mahabalipuram", "shore temple"],
    "belur": ["belur", "halebidu", "hoysala", "chennakeshava"],
    "halebidu": ["belur", "halebidu", "hoysala", "hoysaleswara"],
    "cherrapunji": ["nongriat", "root bridge", "living root", "jingkieng"],
    "nongriat": ["nongriat", "root bridge", "living root", "jingkieng"],
    "kaziranga": ["rhino", "kaziranga", "rhinoceros"],
    "khajuraho": ["khajuraho", "kandariya", "lakshmana temple"],
    "konark": ["konark", "sun temple", "black pagoda"],
    "hampi": ["hampi", "vittala", "virupaksha", "vijayanagara"],
    "vittala": ["vittala", "vitthala", "stone chariot", "hampi"],
    "lepakshi": ["lepakshi", "veerabhadra"],
    "pondicherry": ["puducherry", "pondicherry", "french quarter", "white town"],
    "puducherry": ["puducherry", "pondicherry", "french quarter", "white town"],
    "chandigarh": ["chandigarh", "corbusier", "rock garden"],
    "bhagoria": ["bhagoria", "haat"],
    "santiniketan": ["santiniketan", "shantiniketan", "tagore", "visva-bharati"],
    "shantiniketan": ["santiniketan", "shantiniketan", "tagore", "visva-bharati"],
    "srinagar": ["srinagar", "dal lake", "shikara", "shalimar", "pari mahal"],
    "kullu": ["kullu", "dussehra", "nati"],
    "bathinda": ["bathinda", "bhatinda", "govindgarh"],
    "patiala": ["patiala", "sheesh mahal"],
    "kurukshetra": ["kurukshetra", "brahma sarovar", "jyotisar"],
    "kashmir": ["kashmir", "pashmina", "kani", "walnut", "rouf"],
    "assam": ["muga", "sualkuchi", "kamakhya", "majuli", "charaideo", "rang ghar", "kareng ghar"],
    "tripura": ["tripura", "ujjayanta", "neermahal", "unakoti", "hojagiri", "reang"],
    "manipur": ["manipur", "kangla", "ina memorial", "moirang", "pung cholom", "sangai", "yaoshang", "longpi"],
    "nagaland": ["nagaland", "hornbill", "kohima", "kachari", "chang lo"],
    "mizoram": ["mizoram", "cheraw", "sibuta lung", "vangchhia"],
    "meghalaya": ["meghalaya", "wangala", "shad suk mynsiem", "mawphlang", "nartiang"],
    "ladakh": ["ladakh", "leh", "hemis", "losar", "cham dance", "shingskos"],
    "lakshadweep": ["lakshadweep", "kavaratti", "kolkali"],
    "andaman": ["cellular jail", "ross island", "viper island", "nicobarese"]
}

def get_file_title(result_url):
    if not result_url:
        return ''
    path = result_url.split('/wiki/')[-1]
    title = urllib.parse.unquote(path)
    title = title.replace('File:', '').replace('File%3A', '').replace('_', ' ')
    return title

def get_entity_keywords(name, eid):
    # Extract candidate keywords from name and eid
    clean = re.sub(r'\(.*?\)', '', name)
    clean = clean.replace('&', ' ').replace(',', ' ').replace('-', ' ').replace('/', ' ')
    words = [w.lower().strip() for w in clean.split() if len(w.strip()) >= 3]
    distinctive = [w for w in words if w not in GENERIC_WORDS]

    # Also check eid
    eid_parts = [p.lower() for p in eid.split('-') if len(p) >= 3 and p not in GENERIC_WORDS and p not in ['place', 'fest', 'art', 'craft', 'folk', 'exp']]
    for p in eid_parts:
        if p not in distinctive:
            distinctive.append(p)

    # Expand synonyms
    expanded = set(distinctive)
    for d in distinctive:
        if d in SYNONYMS:
            for s in SYNONYMS[d]:
                expanded.add(s.lower())
    return list(expanded)

# Blacklist of blatant mismatch patterns
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
    "a sattriya dancer performing the dance form in assam" # for bihu!
]

flagged = []
passed = []

for e in found:
    title = get_file_title(e.get('result_url')).lower()
    eid = e['entity_id']
    ename = e['entity_name']
    keywords = get_entity_keywords(ename, eid)

    # Check obvious mismatch first
    is_mismatch = False
    reason = ""
    for bad in OBVIOUS_MISMATCH:
        if bad in title:
            # Special check: is Sattriya dance assigned to Sattriya?
            if "sattriya" in bad and ("sattriya" in eid or "sattriya" in ename.lower()):
                continue
            is_mismatch = True
            reason = f"Matches blacklisted mismatch pattern: '{bad}'"
            break

    # If not already blacklisted, check if ANY keyword appears in title
    if not is_mismatch:
        matched_kw = [kw for kw in keywords if kw in title]
        if not matched_kw:
            # No distinctive keyword found in title
            is_mismatch = True
            reason = f"No distinctive keyword from {keywords[:6]} found in file title '{title}'"

    if is_mismatch:
        flagged.append((e, title, reason))
    else:
        passed.append((e, title))

print(f"Passed: {len(passed)}")
print(f"Flagged: {len(flagged)}")
with open('scripts/flagged_mismatches.txt', 'w', encoding='utf-8') as out:
    for e, title, reason in flagged:
        out.write(f"[{e['tier']}] {e['entity_id']}: '{e['entity_name']}'\n  File: '{title}'\n  Reason: {reason}\n\n")

print("Flagged written to scripts/flagged_mismatches.txt")
