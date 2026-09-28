import subprocess
import re

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

pages = [
    ('Home', 'http://localhost:5173/'),
    ('Heritage', 'http://localhost:5173/heritage'),
    ('Cultural Map', 'http://localhost:5173/cultural-map')
]

print("=== CHECKING BROWSER CONSOLE & STDErr LOGS ===")

for name, url in pages:
    cmd = [
        chrome_path,
        '--headless=new',
        '--enable-logging=stderr',
        '--v=1',
        '--virtual-time-budget=3000',
        url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
    stderr = res.stderr
    
    # Filter out normal Chromium informational lines
    error_lines = []
    for line in stderr.splitlines():
        lower = line.lower()
        if "error" in lower or "fatal" in lower or "uncaught" in lower or "exception" in lower:
            # Filter out expected system/sandbox/gpu noise
            if any(ign in lower for ign in ["gpu", "sandbox", "gl_", "d3d", "shared_image", "passthrough"]):
                continue
            error_lines.append(line.strip())
            
    print(f"[{name:14s}] Raw stderr lines: {len(stderr.splitlines())} | Suspicious lines: {len(error_lines)}")
    for el in error_lines[:5]:
        print(f"   -> {el}")

print("Console check complete.")
