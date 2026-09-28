# scripts/build_festival_and_heritage_master.py
"""
Master Builder for VIRASAT India Festival Master Knowledge Database (300+ records)
and UNESCO World Heritage Master Database (42 properties).
Generates structured JSON databases, reference indexes, and source registries.
"""

import json
import os
import shutil

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FESTIVALS_DIR = os.path.join(ROOT_DIR, "data", "festivals")
HERITAGE_DIR = os.path.join(ROOT_DIR, "data", "heritage")
BACKEND_FESTIVALS_DIR = os.path.join(ROOT_DIR, "backend", "data", "festivals")
BACKEND_HERITAGE_DIR = os.path.join(ROOT_DIR, "backend", "data", "heritage")

os.makedirs(FESTIVALS_DIR, exist_ok=True)
os.makedirs(HERITAGE_DIR, exist_ok=True)
os.makedirs(BACKEND_FESTIVALS_DIR, exist_ok=True)
os.makedirs(BACKEND_HERITAGE_DIR, exist_ok=True)

print("Starting Master Database generation...")
