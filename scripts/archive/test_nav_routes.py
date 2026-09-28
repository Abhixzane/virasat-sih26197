import subprocess
import json
import re

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

routes = [
    ('/', 'Home', ['Heritage', 'Festivals']),
    ('/discover', 'Discover', ['Cultural', 'India']),
    ('/heritage', 'Heritage Places', ['Taj Mahal', 'Vittala', 'Konark', 'Fort']),
    ('/festivals', 'Festivals & Traditions', ['Chhath', 'Durga', 'Onam', 'Pongal', 'Bihu']),
    ('/arts-crafts', 'Arts & Crafts', ['Madhubani', 'Bidriware', 'Kanchipuram', 'Pashmina']),
    ('/performing-arts', 'Performing Arts', ['Kathakali', 'Bharatanatyam', 'Chhau', 'Odissi']),
    ('/experiences', 'Cultural Experiences', ['Trail', 'Walk', 'Heritage', 'Circuit']),
    ('/map', 'Cultural Map', ['leaflet', 'map', 'Cultural']),
    ('/itinerary', 'Itinerary Planner', ['Generate', 'Itinerary', 'Day']),
    ('/about', 'About Virasat', ['Virasat', 'Heritage', 'Smart India Hackathon'])
]

print("=== AUDITING ALL NAVIGATION ROUTES VIA HEADLESS CHROME ===")
failures = []

for path, title, expected_keywords in routes:
    url = f'http://localhost:5173{path}'
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
        matched_kws = [k for k in expected_keywords if k.lower() in dom.lower()]
        
        has_error = "something went wrong" in dom.lower() or "page not found" in dom.lower() or "404" in dom
        card_count = len(re.findall(r'class="[^"]*card[^"]*"', dom, re.IGNORECASE))
        
        print(f"Route: {path:18s} | DOM: {len(dom):6d} chars | Cards: {card_count:2d} | Matched: {matched_kws}")
        
        if has_error or len(matched_kws) == 0:
            print(f"  --> POTENTIAL ISSUE on {path}")
            failures.append((path, title, "Keywords not found or error in DOM"))
    except Exception as e:
        print(f"Route: {path:18s} | ERROR: {e}")
        failures.append((path, title, str(e)))

print("\nRoute Audit Summary:")
if not failures:
    print("ALL 10 NAVIGATION ROUTES RENDERED REAL CONTENT CLEANLY!")
else:
    print(f"Found {len(failures)} failures: {failures}")
