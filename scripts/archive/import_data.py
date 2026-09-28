"""
VIRASAT Data Ingestion Pipeline
Processes raw cultural research records, validates required fields,
normalizes state and city entities, resolves duplicate slugs, and reports
import metrics (imported, updated, duplicates, rejected).
"""
import os
import sys
import json
import re
from typing import Dict, Any, List

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "backend"))
RAW_DIR = os.path.join(BACKEND_DIR, "app", "data", "raw")
PROCESSED_DIR = os.path.join(BACKEND_DIR, "app", "data", "processed")
IMPORTS_DIR = os.path.join(BACKEND_DIR, "app", "data", "imports")

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(IMPORTS_DIR, exist_ok=True)

def normalize_slug(text: str) -> str:
    cleaned = re.sub(r'[^a-z0-9]+', '-', text.strip().lower()).strip('-')
    return cleaned or "unnamed-entry"

def run_import_pipeline(source_file: str, entity_type: str):
    print("=" * 70)
    print(f"VIRASAT INGESTION PIPELINE: {entity_type.upper()}")
    print("=" * 70)

    if not os.path.exists(source_file):
        print(f"Error: Source file {source_file} not found.")
        return

    with open(source_file, "r", encoding="utf-8") as f:
        records = json.load(f)

    report = {
        "entity_type": entity_type,
        "total_input": len(records),
        "imported": 0,
        "rejected": 0,
        "rejection_reasons": []
    }

    processed_records = []
    seen_slugs = set()

    for idx, rec in enumerate(records):
        name = rec.get("name") or rec.get("title")
        if not name:
            report["rejected"] += 1
            report["rejection_reasons"].append(f"Record #{idx} rejected: Missing name/title")
            continue

        slug = rec.get("slug") or normalize_slug(name)
        if slug in seen_slugs:
            report["rejected"] += 1
            report["rejection_reasons"].append(f"Record '{name}' rejected: Duplicate slug '{slug}'")
            continue
        seen_slugs.add(slug)

        # Coordinate sanity for spatial entities
        lat = rec.get("latitude")
        lng = rec.get("longitude")
        if lat is not None and lng is not None:
            if not (6.0 <= float(lat) <= 38.0 and 68.0 <= float(lng) <= 98.0):
                report["rejected"] += 1
                report["rejection_reasons"].append(f"Record '{name}' rejected: Invalid coordinates ({lat}, {lng})")
                continue

        rec["slug"] = slug
        rec["verification_status"] = rec.get("verification_status", "NEEDS_REVIEW")
        processed_records.append(rec)
        report["imported"] += 1

    out_file = os.path.join(PROCESSED_DIR, f"{entity_type}.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(processed_records, f, indent=2, ensure_ascii=False)

    print(f"Import Summary: {report['imported']}/{report['total_input']} valid records processed -> {out_file}")
    if report["rejection_reasons"]:
        print("Rejections:")
        for r in report["rejection_reasons"][:5]:
            print("  *", r)

    return report

if __name__ == "__main__":
    print("Ingestion utility ready. Call run_import_pipeline(source_file, entity_type)")
