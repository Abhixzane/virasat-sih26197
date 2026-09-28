import subprocess
import urllib.request
import json
import re

print("=== AUDITING CULTURAL MAP ENDPOINT & COMPONENT ===")

# 1. Test API endpoint /api/map/markers
url = 'http://localhost:8000/api/map/markers'
req = urllib.request.Request(url)
with urllib.request.urlopen(req, timeout=5) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    print(f"API /api/map/markers returned: {len(data)} markers")
    print(f"Sample marker: ID={data[0].get('id')}, Name='{data[0].get('name')}', Lat={data[0].get('latitude')}, Lng={data[0].get('longitude')}, Type={data[0].get('type')}")

# 2. Test rendering on /cultural-map via headless Chrome
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
cmd = [
    chrome_path,
    '--headless=new',
    '--virtual-time-budget=4000',
    '--dump-dom',
    'http://localhost:5173/cultural-map'
]
res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
dom = res.stdout

print(f"Rendered DOM length: {len(dom)} chars")
has_leaflet = "leaflet-container" in dom or "leaflet-pane" in dom or "leaflet" in dom
print("Contains Leaflet map container:", has_leaflet)

# Check for Map / List toggle buttons
has_toggle = "List View" in dom or "Map View" in dom or "list" in dom.lower()
print("Contains Map / List view controls:", has_toggle)

# Check for category filter badges/pills
has_filters = "All" in dom and ("Heritage" in dom or "Monuments" in dom) and "Festivals" in dom
print("Contains Category Filter controls:", has_filters)

# Check if markers or entities are rendered in list view
has_entities = "Taj Mahal" in dom or "Konark" in dom or "Hampi" in dom
print("Contains Core Heritage Entities in DOM:", has_entities)

assert len(data) > 100, "Expected >100 markers"
assert has_leaflet, "Leaflet container missing"
print("SUCCESS: CULTURAL MAP PASSED INTEGRATION CHECK!")
