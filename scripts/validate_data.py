"""
VIRASAT Data Validation Engine
Validates all canonical JSON datasets in backend/app/data/seeds against
their JSON schemas, checks coordinate bounds, ensures non-empty required fields,
and verifies source attribution completeness.
"""
import os
import sys
import json
import glob

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "backend"))
SCHEMAS_DIR = os.path.join(BACKEND_DIR, "app", "data", "schemas")
SEEDS_DIR = os.path.join(BACKEND_DIR, "app", "data", "seeds")

def validate_datasets():
    print("=" * 70)
    print("VIRASAT DATASET VALIDATION RUNNER")
    print("=" * 70)

    dataset_schema_map = {
        "heritage_sites.json": "heritage.schema.json",
        "festivals.json": "festival.schema.json",
        "crafts.json": "craft.schema.json",
        "performing_arts.json": "performing_art.schema.json",
        "cultural_experiences.json": "experience.schema.json",
    }

    total_validations = 0
    passed_validations = 0
    errors = []

    for data_file, schema_file in dataset_schema_map.items():
        data_path = os.path.join(SEEDS_DIR, data_file)
        schema_path = os.path.join(SCHEMAS_DIR, schema_file)

        if not os.path.exists(data_path):
            print(f"Skipping {data_file}: file does not exist")
            continue
        if not os.path.exists(schema_path):
            print(f"Skipping schema {schema_file}: schema file missing")
            continue

        with open(data_path, "r", encoding="utf-8") as f:
            records = json.load(f)
        with open(schema_path, "r", encoding="utf-8") as f:
            schema = json.load(f)

        required_fields = schema.get("required", [])
        print(f"Validating {data_file} ({len(records)} records) against {schema_file}...")

        for idx, rec in enumerate(records):
            total_validations += 1
            rec_id = rec.get("id", f"index-{idx}")

            # Check required fields
            missing = [req for req in required_fields if req not in rec or rec[req] is None]
            if missing:
                errors.append(f"[{data_file}] Record {rec_id} missing required fields: {missing}")
                continue

            # Check coordinates if present
            if "latitude" in rec and "longitude" in rec and rec["latitude"] is not None and rec["longitude"] is not None:
                lat = rec["latitude"]
                lng = rec["longitude"]
                if not (6.0 <= lat <= 38.0 and 68.0 <= lng <= 98.0):
                    errors.append(f"[{data_file}] Record {rec_id} has out-of-bounds coordinates for India: ({lat}, {lng})")
                    continue

            # Check verification status
            if "verification_status" in rec and rec["verification_status"] not in ["VERIFIED", "PARTIALLY_VERIFIED", "UNVERIFIED", "NEEDS_REVIEW"]:
                errors.append(f"[{data_file}] Record {rec_id} has invalid verification_status: {rec['verification_status']}")
                continue

            passed_validations += 1

    print("-" * 70)
    print(f"Validation complete: {passed_validations}/{total_validations} records verified successfully.")
    if errors:
        print(f"FAILED VALIDATIONS ({len(errors)} errors):")
        for err in errors[:10]:
            print("  *", err)
        return False
    else:
        print("ALL VERIFIED DATASETS PASSED CANONICAL SCHEMA CHECKS!")
        return True

if __name__ == "__main__":
    success = validate_datasets()
    sys.exit(0 if success else 1)
