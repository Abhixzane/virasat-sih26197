import json

with open('backend/app/data/image_mismatch_review.jsonl', 'r', encoding='utf-8') as f:
    reviews = [json.loads(line) for line in f]

with open('scripts/review_outcomes.txt', 'w', encoding='utf-8') as out:
    out.write(f"Total reviewed: {len(reviews)}\n")
    for i, r in enumerate(reviews):
        out.write(f"{i+1:2d}. [{r['tier']}] {r['entity_id']}: '{r['entity_name']}'\n   OLD: '{r['previous_image_title']}'\n   NEW: '{r['new_image_title']}' ({r['final_outcome']})\n\n")

print(f"Wrote {len(reviews)} reviews to scripts/review_outcomes.txt")
