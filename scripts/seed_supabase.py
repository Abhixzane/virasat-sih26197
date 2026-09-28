# scripts/seed_supabase.py
"""
Supabase Seeding Script for VIRASAT Platform
Generates and executes SQL seeds for all 363 festivals and 42 UNESCO World Heritage sites.
Can also directly seed a Supabase project via REST client if credentials are configured.
"""

import os
import sys
import json

curr_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(curr_dir, "generator"))

from data_north import FESTIVALS_NORTH
from data_west import FESTIVALS_WEST
from data_central import FESTIVALS_CENTRAL
from data_east import FESTIVALS_EAST
from data_south import FESTIVALS_SOUTH
from data_northeast import FESTIVALS_NORTHEAST
from data_pan_india import FESTIVALS_PAN_INDIA
from unesco_data import UNESCO_WORLD_HERITAGE_PROPERTIES

def escape_sql(val):
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "TRUE" if val else "FALSE"
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, list):
        # Format as PostgreSQL ARRAY['a', 'b']
        escaped_items = [escape_sql(x) for x in val]
        return f"ARRAY[{', '.join(escaped_items)}]::TEXT[]"
    s = str(val).replace("'", "''")
    return f"'{s}'"

def generate_seed_sql():
    all_festivals = (
        FESTIVALS_NORTH +
        FESTIVALS_WEST +
        FESTIVALS_CENTRAL +
        FESTIVALS_EAST +
        FESTIVALS_SOUTH +
        FESTIVALS_NORTHEAST +
        FESTIVALS_PAN_INDIA
    )

    out_sql_path = os.path.join(curr_dir, "seed_supabase.sql")
    print(f"Generating SQL seed script: {out_sql_path}...")

    with open(out_sql_path, "w", encoding="utf-8") as f:
        f.write("-- ============================================================================\n")
        f.write("-- VIRASAT SUPABASE MASTER SEED DATA\n")
        f.write(f"-- Total Festivals: {len(all_festivals)} | Total UNESCO Sites: {len(UNESCO_WORLD_HERITAGE_PROPERTIES)}\n")
        f.write("-- ============================================================================\n\n")
        
        # 1. Festivals Insert
        f.write("-- 1. INSERT FESTIVALS MASTER\n")
        for fest in all_festivals:
            cols = [
                "id", "name", "alternate_names", "category", "religious_or_cultural_association",
                "short_description", "historical_background", "origin_and_traditional_stories",
                "why_celebrated", "cultural_and_spiritual_significance", "historical_significance",
                "important_rituals", "how_people_celebrate", "traditional_food_and_sweets",
                "traditional_clothing", "music_dance_performances", "important_symbols_and_decorations",
                "typical_duration", "calendar_system", "date_calculation_rule", "usual_month",
                "date_type", "date_rule", "date_2026", "date_2027", "date_source",
                "major_states", "major_cities", "famous_venues", "best_time_to_visit",
                "recommended_duration_days", "tourist_experience", "local_transportation",
                "accommodation_considerations", "crowd_and_safety", "visitor_etiquette",
                "accessibility_considerations", "official_website", "sources", "data_confidence_status"
            ]
            vals = [
                escape_sql(fest.get(c)) for c in cols
            ]
            cols_str = ", ".join(cols)
            vals_str = ", ".join(vals)
            f.write(f"INSERT INTO public.festivals_master ({cols_str}) VALUES ({vals_str})\n")
            f.write("ON CONFLICT (id) DO UPDATE SET updated_at = NOW();\n\n")

        # 2. UNESCO Insert
        f.write("\n-- 2. INSERT UNESCO WORLD HERITAGE\n")
        for u in UNESCO_WORLD_HERITAGE_PROPERTIES:
            cols = [
                "id", "official_unesco_name", "alternate_names", "category", "state", "district",
                "city_or_nearest_settlement", "inscription_year", "unesco_criteria",
                "historical_background", "architectural_or_ecological_significance",
                "cultural_importance", "historical_events_stories", "major_attractions",
                "visitor_experience", "best_time_to_visit", "recommended_visit_duration",
                "nearest_railway_station", "nearest_airport", "nearby_cities",
                "nearby_heritage_destinations", "nearby_hotels_areas", "local_cuisine",
                "transportation_information", "latitude", "longitude", "official_unesco_url",
                "data_verification_status"
            ]
            vals = [
                escape_sql(u.get(c)) for c in cols
            ]
            cols_str = ", ".join(cols)
            vals_str = ", ".join(vals)
            f.write(f"INSERT INTO public.unesco_world_heritage ({cols_str}) VALUES ({vals_str})\n")
            f.write("ON CONFLICT (id) DO UPDATE SET updated_at = NOW();\n\n")

    print(f"Generated {out_sql_path} with {len(all_festivals)} festivals and {len(UNESCO_WORLD_HERITAGE_PROPERTIES)} UNESCO sites.")

if __name__ == "__main__":
    generate_seed_sql()
