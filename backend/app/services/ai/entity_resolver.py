"""
VIRASAT AI Entity Resolver
Resolves historical aliases, colloquial spellings, typos, and maps query tokens to canonical entities.
"""

import re
from typing import Optional, Dict, Any, List, Tuple
from app.services.travel.route_planner import CITY_ALIASES

# Canonical Synonyms Mapping
CANONICAL_SYNONYMS = {
    # Cities & Regions
    "kashi": "Varanasi",
    "banaras": "Varanasi",
    "benares": "Varanasi",
    "dilli": "Delhi",
    "new delhi": "Delhi",
    "bombay": "Mumbai",
    "calcutta": "Kolkata",
    "madras": "Chennai",
    "prayag": "Prayagraj",
    "allahabad": "Prayagraj",
    "bangalore": "Bengaluru",
    "baroda": "Vadodara",
    "cochin": "Kochi",
    "trivandrum": "Thiruvananthapuram",
    "poona": "Pune",
    "pondy": "Puducherry",
    "pondicherry": "Puducherry",
    "mamallapuram": "Mamallapuram",
    "mahabalipuram": "Mamallapuram",
    "tanjore": "Thanjavur",
    "ooty": "Udhagamandalam",
    "simla": "Shimla",
    "gauhati": "Guwahati",
    "vizag": "Visakhapatnam",
    "mysore": "Mysuru",
    "aurangabad": "Chhatrapati Sambhajinagar",
    "bodh gaya": "Gaya",
    "bodhgaya": "Gaya",

    # Monuments & Sites
    "taj mehal": "Taj Mahal",
    "taj mahl": "Taj Mahal",
    "tajmahal": "Taj Mahal",
    "taj": "Taj Mahal",
    "agra fort": "Agra Fort",
    "agrah fort": "Agra Fort",
    "agrah": "Agra",
    "fatehpur sikri": "Fatehpur Sikri",
    "qutab minar": "Qutb Minar",
    "humpi": "Hampi",
    "vijayanagara": "Hampi",
    "konark sun templ": "Konark Sun Temple",
    "ajanta alora": "Ajanta Caves",
    "elora": "Ellora Caves",
    "khajurao": "Khajuraho",
    "meenakshi amman": "Meenakshi Amman Temple",
    "buland darwaja": "Buland Darwaza",
    "hawa mehal": "Hawa Mahal",
    "sanchi stoopa": "Sanchi Stupa",
    "rani ki vav stepwel": "Rani ki Vav",

    # Crafts & Festivals
    "mithila painting": "Madhubani Painting",
    "kanjivaram": "Kanchipuram Silk",
    "chikankari": "Chikan Hand Embroidery",
    "blue potery": "Jaipur Blue Pottery",
    "pashmina": "Kashmir Pashmina",
    "chhath": "Chhath Puja",
    "rath yatra": "Jagannath Rath Yatra",
    "kumbh": "Maha Kumbh Mela",
    "durga puja": "Kolkata Durga Puja"
}

class EntityResolver:
    """Normalizes and resolves entity references from trilingual text."""

    def resolve_synonyms(self, query: str) -> Tuple[str, List[str]]:
        clean_q = query.lower()
        canonical_terms: List[str] = []
        for alias, canonical in CANONICAL_SYNONYMS.items():
            if alias in clean_q:
                canonical_terms.append(canonical)
        return clean_q, canonical_terms

    def resolve_city(self, token: str, known_cities: Optional[Dict[str, Any]] = None) -> Optional[str]:
        norm = token.strip().lower()
        if not norm or len(norm) < 3:
            return None
        if norm in CITY_ALIASES:
            return CITY_ALIASES[norm]
        if norm in CANONICAL_SYNONYMS:
            return CANONICAL_SYNONYMS[norm]
        if known_cities and norm in known_cities:
            return norm
        return None

    def clean_text(self, text: str) -> str:
        text = text.lower()
        text = re.sub(r'[\'’"“”,\.!\?;\:\(\)\[\]\{\}]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

entity_resolver = EntityResolver()
