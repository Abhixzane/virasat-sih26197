import subprocess
import json
import re

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

def get_rendered_dom(url, wait_ms=2500):
    cmd = [
        chrome_path,
        '--headless=new',
        '--virtual-time-budget=' + str(wait_ms),
        '--dump-dom',
        url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
    return res.stdout

dom = get_rendered_dom('http://localhost:5173/')

print("=== CHECKING HOME PAGE RENDERING ===")
# Check for Statistics
print("Contains 'Heritage Sites':", "Heritage Sites" in dom)
print("Contains 'Living Festivals':", "Festivals" in dom)
print("Contains 'Handcrafted Traditions':", "Handcrafted" in dom or "Crafts" in dom)

# Find stats numbers in DOM
stat_matches = re.findall(r'(\d+)\+?</div>\s*<div[^>]*>([A-Za-z\s&;]+)</div>', dom)
print("Found Stats:", stat_matches[:8])

# Check Featured Heritage
print("Contains 'Featured Heritage':", "Featured Heritage" in dom or "UNESCO" in dom or "Taj Mahal" in dom or "Vittala" in dom)

# Check CTAs
ctas = re.findall(r'<a[^>]*href="([^"]*)"[^>]*>([^<]+)</a>', dom)
print("Sample Links & CTAs:", ctas[:10])

# Check Image tags on Home page
imgs = re.findall(r'<img[^>]*src="([^"]*)"[^>]*>', dom)
print(f"Total rendered images on Home: {len(imgs)}")
for img in imgs[:5]:
    print("  Image src:", img[:80])
