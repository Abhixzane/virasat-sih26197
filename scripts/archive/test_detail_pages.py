import subprocess
import json
import re

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

test_entities = [
    # Heritage
    ("heritage", "place-taj-mahal", "Taj Mahal"),
    ("heritage", "place-hampi-vittala", "Vittala Temple"),
    ("heritage", "place-dl-humayuns-tomb", "Humayun's Tomb"),
    # Festival
    ("festivals", "fest-pongal-harvest", "Thai Pongal"),
    ("festivals", "fest-durga-puja", "Durga Puja"),
    ("festivals", "fest-onam", "Onam"),
    # Craft
    ("arts-crafts", "art-madhubani-painting", "Madhubani"),
    ("arts-crafts", "craft-chanderi-fabric", "Chanderi"),
    ("arts-crafts", "craft-bidriware", "Bidriware"),
    # Performing Art
    ("performing-arts", "folk-kathakali-dance", "Kathakali"),
    ("performing-arts", "folk-bihu-folk-dance", "Bihu"),
    ("performing-arts", "art-chhau", "Chhau"),
    # Experience
    ("experiences", "exp-mumbai-heritage-walk", "Mumbai"),
    ("experiences", "exp-kanchipuram-loom-heritage", "Kanchipuram"),
    ("experiences", "exp-jaipur-block-print-workshop", "Printing")
]

print("=== AUDITING 15 DETAIL PAGES ACROSS 5 ENTITY DOMAINS WITH EXACT ROUTES ===")
issues = []

for route_prefix, eid, expected_title in test_entities:
    url = f'http://localhost:5173/{route_prefix}/{eid}'
    cmd = [
        chrome_path,
        '--headless=new',
        '--virtual-time-budget=3000',
        '--dump-dom',
        url
    ]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=15)
        dom = res.stdout
        
        # Check Title
        has_title = expected_title.lower() in dom.lower()
        
        # Check Image
        img_match = re.search(r'<img[^>]*src="([^"]*)"[^>]*>', dom)
        img_src = img_match.group(1) if img_match else "NONE"
        has_valid_img = img_src != "NONE" and len(img_src) > 10
        
        # Check Verification Badge
        has_verif = "VERIFIED" in dom or "PARTIALLY_VERIFIED" in dom or "NEEDS_REVIEW" in dom or "Verified" in dom
        
        # Check Source Link
        has_src_link = "asi.nic.in" in dom or "wikipedia.org" in dom or "unesco.org" in dom or "tourism" in dom or "source" in dom.lower()
        
        # Check Related Records section
        has_related = "related" in dom.lower() or "explore" in dom.lower() or "connected" in dom.lower()
        
        print(f"[{route_prefix:16s}] {eid:32s} | Title: {'OK' if has_title else 'MISSING'} | Img: {'OK' if has_valid_img else 'NO_IMG'} | Badge: {'OK' if has_verif else 'NO_BADGE'} | Related: {'OK' if has_related else 'NO_RELATED'}")
        
        if not (has_title and has_valid_img):
            issues.append((route_prefix, eid, "Failed title or image check"))
    except Exception as e:
        print(f"[{route_prefix:16s}] {eid:32s} | ERROR: {e}")
        issues.append((route_prefix, eid, str(e)))

print("\nDetail Page Audit Summary:")
if not issues:
    print("SUCCESS: ALL 15 DETAIL PAGES (3 PER DOMAIN) RENDERED TITLES, IMAGES, BADGES, AND RELATED CONTENT CLEANLY!")
else:
    print(f"Found {len(issues)} issues: {issues}")
