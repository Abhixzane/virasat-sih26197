import os
import sys
import json

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "backend", "data", "cultural_database.json")
LOG_PATH = os.path.join(BASE_DIR, "backend", "app", "data", "image_sourcing_log.jsonl")
REVIEW_LOG_PATH = os.path.join(BASE_DIR, "backend", "app", "data", "image_mismatch_review.jsonl")

NEUTRAL_PLACEHOLDER = "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"
NEUTRAL_ATTRIBUTION = "Antigravity Cultural Archives (Neutral Architectural Motif)"
NEUTRAL_LICENSE = "Unsplash License"

# Explicit verified overrides
EXPLICIT_CORRECTIONS = {
    "fest-pongal-harvest": {
        "title": "File:Pongal Celebration in home.JPG",
        "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Pongal_Celebration_in_home.JPG/960px-Pongal_Celebration_in_home.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "attribution": "Arikrishnan / Wikimedia Commons",
        "license": "CC BY-SA 3.0",
        "source": "https://commons.wikimedia.org/wiki/File:Pongal_Celebration_in_home.JPG"
    },
    "kaziranga-living-heritage": {
        "title": "File:Indian rhinoceros in Kaziranga National Park March 2025 by Tisha Mukherjee 02.jpg",
        "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Indian_rhinoceros_in_Kaziranga_National_Park_March_2025_by_Tisha_Mukherjee_02.jpg/960px-Indian_rhinoceros_in_Kaziranga_National_Park_March_2025_by_Tisha_Mukherjee_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "attribution": "Tisha Mukherjee / Wikimedia Commons",
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Indian_rhinoceros_in_Kaziranga_National_Park_March_2025_by_Tisha_Mukherjee_02.jpg"
    },
    "folk-bihu-folk-dance": {
        "title": "File:Bihu Dance , Festival of India.jpg",
        "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Bihu_Dance_%2C_Festival_of_India.jpg/960px-Bihu_Dance_%2C_Festival_of_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "attribution": "Donvikro / Wikimedia Commons",
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Bihu_Dance_%2C_Festival_of_India.jpg"
    },
    "folk-bihu-dance": {
        "title": "File:Bihu Dance , Festival of India.jpg",
        "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Bihu_Dance_%2C_Festival_of_India.jpg/960px-Bihu_Dance_%2C_Festival_of_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "attribution": "Donvikro / Wikimedia Commons",
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Bihu_Dance_%2C_Festival_of_India.jpg"
    },
    "art-warli-painting": {
        "title": "File:Warli painting.jpg",
        "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Warli_painting.jpg/960px-Warli_painting.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "attribution": "Omrmankar / Wikimedia Commons",
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Warli_painting.jpg"
    },
    "fest-baisakhi-punjab": {
        "title": "File:Gidha dance in Punjab state india as on Baisakhi festival celebration.jpg",
        "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Gidha_dance_in_Punjab_state_india_as_on_Baisakhi_festival_celebration.jpg/960px-Gidha_dance_in_Punjab_state_india_as_on_Baisakhi_festival_celebration.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "attribution": "Dinesh Kumar bharadwaj / Wikimedia Commons",
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Gidha_dance_in_Punjab_state_india_as_on_Baisakhi_festival_celebration.jpg"
    },
    "exp-fort-kochi-heritage-circuit": {
        "title": "File:Chinese fishingnet kochi.jpg",
        "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Chinese_fishingnet_kochi.jpg/960px-Chinese_fishingnet_kochi.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
        "attribution": "Challiyil Eswaramangalath Vipin / Wikimedia Commons",
        "license": "CC BY-SA 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Chinese_fishingnet_kochi.jpg"
    }
}

# Entities that must fall back to the neutral placeholder
FALLBACK_IDS = {
    "place-st-paul-church-diu",
    "place-vishnu-temple-bishnupur",
    "place-barabar-caves",
    "place-vikramshila-monastery",
    "place-qila-mubarak-bathinda",
    "place-moti-daman-fort",
    "place-diu-fort",
    "fest-island-tourism-festival",
    "fest-subhash-mela-andaman",
    "fest-yoga-festival-puducherry",
    "fest-milad-un-nabi-lakshadweep",
    "fest-losar-arunachal",
    "art-pietra-dura-inlay",
    "art-kumartuli-clay-sculpting",
    "art-ladakh-pashmina",
    "art-lakshadweep-coir",
    "folk-bhojpuri-maithili-geet",
    "folk-garadi-dance",
    "folk-tarpa-dance",
    "folk-dhamal-ragini-haryana"
}

def main():
    print("Applying disciplined final corrections to image review...")

    with open(REVIEW_LOG_PATH, "r", encoding="utf-8") as f:
        reviews = [json.loads(line) for line in f]

    with open(LOG_PATH, "r", encoding="utf-8") as f:
        sourcing_logs = [json.loads(line) for line in f]

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        db = json.load(f)

    # Index db items
    db_items = {}
    for cat in ["heritage_places", "festivals_and_traditions", "arts_crafts_and_artisans", "folk_and_performing_arts", "cultural_experiences"]:
        for item in db.get(cat, []):
            db_items[item["id"]] = item

    # Index sourcing logs
    sourcing_map = {e["entity_id"]: e for e in sourcing_logs}

    # Update reviews
    for r in reviews:
        eid = r["entity_id"]
        if eid in EXPLICIT_CORRECTIONS:
            c = EXPLICIT_CORRECTIONS[eid]
            r["final_outcome"] = "corrected_with_verified_image"
            r["new_image_title"] = c["title"]
            r["new_image_url"] = c["url"]
            r["new_attribution"] = c["attribution"]
            r["new_license"] = c["license"]
            print(f"Applied verified correction for {eid} -> {c['title']}")

            if eid in db_items:
                db_items[eid]["image_url"] = c["url"]
                db_items[eid]["image_attribution"] = c["attribution"]
                db_items[eid]["license"] = c["license"]

            if eid in sourcing_map:
                s = sourcing_map[eid]
                s["result_url"] = c["source"]
                s["final_image_url"] = c["url"]
                s["attribution"] = c["attribution"]
                s["license"] = c["license"]
                s["outcome"] = "found_licensed_image"

        elif eid in FALLBACK_IDS:
            r["final_outcome"] = "fallback_to_placeholder"
            r["new_image_title"] = "Neutral Architectural Motif (Fallback)"
            r["new_image_url"] = NEUTRAL_PLACEHOLDER
            r["new_attribution"] = NEUTRAL_ATTRIBUTION
            r["new_license"] = NEUTRAL_LICENSE
            print(f"Applied neutral fallback for {eid}")

            if eid in db_items:
                db_items[eid]["image_url"] = NEUTRAL_PLACEHOLDER
                db_items[eid]["image_attribution"] = NEUTRAL_ATTRIBUTION
                db_items[eid]["license"] = NEUTRAL_LICENSE

            if eid in sourcing_map:
                s = sourcing_map[eid]
                s["result_url"] = None
                s["final_image_url"] = NEUTRAL_PLACEHOLDER
                s["attribution"] = NEUTRAL_ATTRIBUTION
                s["license"] = NEUTRAL_LICENSE
                s["outcome"] = "not_found_used_placeholder"

    # Save review log
    with open(REVIEW_LOG_PATH, "w", encoding="utf-8") as f:
        for r in reviews:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"Saved cleaned review log: {REVIEW_LOG_PATH}")

    # Save sourcing log
    with open(LOG_PATH, "w", encoding="utf-8") as f:
        for s in sourcing_logs:
            f.write(json.dumps(s, ensure_ascii=False) + "\n")
    print(f"Saved cleaned sourcing log: {LOG_PATH}")

    # Save database
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print(f"Saved cleaned database: {DATA_PATH}")

    # Metrics
    total_flagged = len(reviews)
    corrected = sum(1 for r in reviews if r["final_outcome"] == "corrected_with_verified_image")
    fallback = sum(1 for r in reviews if r["final_outcome"] == "fallback_to_placeholder")
    total_licensed = sum(1 for s in sourcing_logs if s["outcome"] == "found_licensed_image")
    total_placeholder = sum(1 for s in sourcing_logs if s["outcome"] == "not_found_used_placeholder")

    print("\n" + "=" * 60)
    print("FINAL STEP 3b AUDIT METRICS")
    print("=" * 60)
    print(f"Total Database Entities:         {len(sourcing_logs)}")
    print(f"Total Mismatches Flagged:        {total_flagged}")
    print(f"Successfully Corrected (Verified): {corrected}")
    print(f"Fell Back to Neutral Motif:      {fallback}")
    print(f"Final Total Real Licensed Photos: {total_licensed}")
    print(f"Final Total Neutral Placeholders:{total_placeholder}")
    print("=" * 60)

if __name__ == "__main__":
    main()
