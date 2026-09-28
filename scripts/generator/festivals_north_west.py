# scripts/generator/festivals_north_west.py
"""
Festivals of Northern and Western India:
J&K, Ladakh, Himachal Pradesh, Punjab, Chandigarh, Haryana, Delhi, Rajasthan, Gujarat, Goa, D&NH & Daman & Diu.
"""

def make_fest(
    fid, name, alt_names, category, religion, short_desc, hist_bg, origin, why,
    spiritual_sig, hist_sig, rituals, celebrate, food, clothes, music_dance, symbols,
    duration, cal_system, date_calc, usual_month, date_type, date_rule, d2026, d2027,
    d_source, states, cities, venues, best_time, rec_days, exp, transport, stay,
    safety, etiquette, access, website, sources, confidence="VERIFIED_OFFICIAL"
):
    return {
        "id": fid,
        "name": name,
        "alternate_names": alt_names,
        "category": category,
        "religious_or_cultural_association": religion,
        "short_description": short_desc,
        "historical_background": hist_bg,
        "origin_and_traditional_stories": origin,
        "why_celebrated": why,
        "cultural_and_spiritual_significance": spiritual_sig,
        "historical_significance": hist_sig,
        "important_rituals": rituals if isinstance(rituals, list) else [rituals],
        "how_people_celebrate": celebrate,
        "traditional_food_and_sweets": food if isinstance(food, list) else [food],
        "traditional_clothing": clothes,
        "music_dance_performances": music_dance,
        "important_symbols_and_decorations": symbols,
        "typical_duration": duration,
        "calendar_system": cal_system,
        "date_calculation_rule": date_calc,
        "usual_month": usual_month,
        "date_type": date_type,
        "date_rule": date_rule,
        "date_2026": d2026,
        "date_2027": d2027,
        "date_source": d_source,
        "date_last_verified": "2026-09-28",
        "major_states": states if isinstance(states, list) else [states],
        "major_cities": cities if isinstance(cities, list) else [cities],
        "famous_venues": venues if isinstance(venues, list) else [venues],
        "best_time_to_visit": best_time,
        "recommended_duration_days": rec_days,
        "tourist_experience": exp,
        "local_transportation": transport,
        "accommodation_considerations": stay,
        "crowd_and_safety": safety,
        "visitor_etiquette": etiquette,
        "accessibility_considerations": access,
        "official_website": website,
        "sources": sources if isinstance(sources, list) else [sources],
        "last_verified_date": "2026-09-28",
        "data_confidence_status": confidence
    }

FESTIVALS_NORTH_WEST = []
