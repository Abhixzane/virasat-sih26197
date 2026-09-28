import os
import sys
import json
import subprocess

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
BACKEND_DIR = os.path.join(REPO_DIR, "backend")
DB_PATH = os.path.join(BACKEND_DIR, "data", "cultural_database.json")
sys.path.insert(0, CURRENT_DIR)

from ingest_batch1 import ingest_batch1

def main():
    print(f"Reading DB from: {DB_PATH}")
    with open(DB_PATH, "r", encoding="utf-8") as f:
        curr_data = json.load(f)

    # Fetch git HEAD version for the baseline arts, experiences, and stories
    cmd = ["git", "show", "HEAD:backend/data/cultural_database.json"]
    head_raw = subprocess.check_output(cmd, cwd=REPO_DIR, encoding="utf-8")
    head_data = json.loads(head_raw)

    for section in ["folk_and_performing_arts", "cultural_experiences", "cultural_stories"]:
        curr_data[section] = list(head_data.get(section, []))
        print(f"Section {section}: restored baseline of {len(curr_data[section])} items from HEAD.")

    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(curr_data, f, indent=2, ensure_ascii=False)

    print("Saved baseline to cultural_database.json.")
    print("Now triggering ingest_batch1()...")
    ingest_batch1()

if __name__ == "__main__":
    main()
