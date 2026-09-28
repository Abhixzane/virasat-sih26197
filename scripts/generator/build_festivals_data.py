"""
Generator for VIRASAT India Festival Master Knowledge Database (330+ Records).
Generates:
  - data/festivals/india_festivals_master.json
  - data/festivals/festival_categories.json
  - data/festivals/festival_locations.json
  - data/festivals/festival_dates.json
  - data/festivals/festival_sources.json
"""

import json
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FESTIVALS_DIR = os.path.join(ROOT_DIR, "data", "festivals")
BACKEND_FESTIVALS_DIR = os.path.join(ROOT_DIR, "backend", "data", "festivals")
os.makedirs(FESTIVALS_DIR, exist_ok=True)
os.makedirs(BACKEND_FESTIVALS_DIR, exist_ok=True)

CATEGORIES = [
    {
        "id": "cat-harvest-agricultural",
        "name": "Harvest & Agricultural",
        "description": "Celebrations marking crop harvesting, agricultural renewal, equinoxes, and agrarian gratitude to nature.",
        "cultural_scope": "Agrarian communities across all agro-climatic zones of India.",
        "icon": "🌾"
    },
    {
        "id": "cat-religious-hindu",
        "name": "Religious - Hindu",
        "description": "Devotional observances, temple brahmotsavams, divine leelas, vratas, and pujas rooted in Vedic and Puranic traditions.",
        "cultural_scope": "Pan-Indian and regional Hindu sampradayas (Shaiva, Vaishnava, Shakta, Smarta).",
        "icon": "🪔"
    },
    {
        "id": "cat-religious-buddhist",
        "name": "Religious - Buddhist",
        "description": "Sacred commemorations of Gautama Buddha's birth, enlightenment, parinirvana, monastic cham dances, and Losar.",
        "cultural_scope": "Theravada, Mahayana, and Vajrayana Buddhist communities across Ladakh, Sikkim, Arunachal, and pilgrimage sites.",
        "icon": "☸️"
    },
    {
        "id": "cat-religious-jain",
        "name": "Religious - Jain",
        "description": "Spiritual observances centered on non-violence (ahimsa), self-discipline, repentance (Kshamavani), and Tirthankara jayantis.",
        "cultural_scope": "Digambara and Shvetambara Jain traditions nationwide.",
        "icon": "🕊️"
    },
    {
        "id": "cat-religious-sikh",
        "name": "Religious - Sikh",
        "description": "Gurpurabs commemorating Sikh Gurus, installation of Sri Guru Granth Sahib, martial arts of Hola Mohalla, and Baisakhi.",
        "cultural_scope": "Sikh community in Punjab and historical gurdwaras worldwide.",
        "icon": "☬"
    },
    {
        "id": "cat-religious-islamic",
        "name": "Religious - Islamic",
        "description": "Islamic celebrations of Eid-ul-Fitr, Eid-ul-Adha, Milad-un-Nabi, and annual Sufi Urs celebrations at revered dargahs.",
        "cultural_scope": "Muslim communities and syncretic Sufi pilgrim centers across India.",
        "icon": "🌙"
    },
    {
        "id": "cat-religious-christian",
        "name": "Religious - Christian",
        "description": "Christian liturgical observances including Christmas, Easter, and feasts of historic patron saints and shrines.",
        "cultural_scope": "Christian traditions across Goa, Kerala, Tamil Nadu, and North-East India.",
        "icon": "✝️"
    },
    {
        "id": "cat-religious-parsi",
        "name": "Religious - Parsi & Zoroastrian",
        "description": "Celebrations of Jamshedi Navroz, Pateti, and holy fires by India's Zoroastrian Parsi and Irani community.",
        "cultural_scope": "Parsi community centered in Mumbai, Gujarat, and historic fire temples.",
        "icon": "🔥"
    },
    {
        "id": "cat-tribal-indigenous",
        "name": "Tribal & Indigenous Celebrations",
        "description": "Ancient earth-based ceremonies, sacred grove rituals, ancestor veneration, and living indigenous community traditions.",
        "cultural_scope": "Scheduled Tribes and indigenous communities of Central, Eastern, and North-Eastern India.",
        "icon": "🌿"
    },
    {
        "id": "cat-regional-new-year",
        "name": "Regional New Year Observances",
        "description": "Traditional solar and lunisolar astronomical calendar commencements marking regional cultural new years.",
        "cultural_scope": "State-specific cultural communities across India (Ugadi, Gudi Padwa, Vishu, Poila Boishakh, Puthandu, etc.).",
        "icon": "🌅"
    },
    {
        "id": "cat-fairs-melas",
        "name": "Traditional Fairs & Melas",
        "description": "Historic gathering grounds for trade, animal fairs, pilgrim confluences, folk performances, and rural exchange.",
        "cultural_scope": "Famous rural and pilgrim confluences (Pushkar, Sonpur, Tarnetar, Bateshwar).",
        "icon": "🎪"
    },
    {
        "id": "cat-classical-performing-arts",
        "name": "Classical & Performing Arts",
        "description": "State-sponsored and heritage-site festivals showcasing India's classical dance forms, ragas, and folk theatre.",
        "cultural_scope": "UNESCO and national heritage monuments providing magnificent architectural backdrops.",
        "icon": "🎭"
    },
    {
        "id": "cat-seasonal-celebrations",
        "name": "Seasonal Celebrations",
        "description": "Spring flower festivals, monsoon welcoming rituals, desert winter pageants, and high-altitude summer celebrations.",
        "cultural_scope": "Eco-zones including the Himalayas, Thar Desert, Rann of Kutch, and coastal lagoons.",
        "icon": "🌸"
    },
    {
        "id": "cat-national-commemorative",
        "name": "National Commemorative Days",
        "description": "Patriotic celebrations marking sovereign democratic identity, constitutional values, and freedom struggle martyrs.",
        "cultural_scope": "All citizens across all States and Union Territories of India.",
        "icon": "🇮🇳"
    },
    {
        "id": "cat-state-formation-heritage",
        "name": "State Formation & Heritage Days",
        "description": "Official commemorations celebrating linguistic reorganisation, statehood, and cultural regional pride.",
        "cultural_scope": "Individual state and union territory administrations.",
        "icon": "🏛️"
    }
]

print(f"Categories defined: {len(CATEGORIES)}")
