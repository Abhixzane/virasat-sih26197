# scripts/generator/generate_all_datasets.py
"""
VIRASAT India Festival Master Knowledge Database & UNESCO World Heritage Database
Generates:
  /data/festivals/india_festivals_master.json (330+ records)
  /data/festivals/festival_categories.json
  /data/festivals/festival_locations.json
  /data/festivals/festival_dates.json
  /data/festivals/festival_sources.json
  /data/heritage/unesco_world_heritage.json (42 properties)
  /data/heritage/heritage_categories.json
  /data/heritage/heritage_locations.json
  /data/heritage/heritage_sources.json
Mirrors to /backend/data/festivals/ and /backend/data/heritage/.
"""

import json
import os
import shutil

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FESTIVALS_DIR = os.path.join(ROOT_DIR, "data", "festivals")
HERITAGE_DIR = os.path.join(ROOT_DIR, "data", "heritage")
BACKEND_FESTIVALS_DIR = os.path.join(ROOT_DIR, "backend", "data", "festivals")
BACKEND_HERITAGE_DIR = os.path.join(ROOT_DIR, "backend", "data", "heritage")

os.makedirs(FESTIVALS_DIR, exist_ok=True)
os.makedirs(HERITAGE_DIR, exist_ok=True)
os.makedirs(BACKEND_FESTIVALS_DIR, exist_ok=True)
os.makedirs(BACKEND_HERITAGE_DIR, exist_ok=True)

from unesco_data import UNESCO_WORLD_HERITAGE_PROPERTIES, UNESCO_CRITERIA
from festival_builder_helper import fest
from data_part1_north import PART1_FESTIVALS

print(f"Base setup ready. Loaded UNESCO: {len(UNESCO_WORLD_HERITAGE_PROPERTIES)}, Loaded Part 1: {len(PART1_FESTIVALS)}")
