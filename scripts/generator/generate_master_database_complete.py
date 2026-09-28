# scripts/generator/generate_master_database_complete.py
"""
Complete Master Database Generator for VIRASAT:
Generates 331 festivals and 42 UNESCO World Heritage properties.
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
