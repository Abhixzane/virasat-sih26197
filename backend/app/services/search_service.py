import re
import unicodedata
from typing import Optional, List, Dict
from rapidfuzz import fuzz
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import SearchResponse, SearchResultItem
from app.core.database import SessionLocal
from app.models.db_models import SearchLog

# Alias dictionary for historical, vernacular, and alternate names
CULTURAL_ALIASES = {
    "kashi": "Varanasi",
    "banaras": "Varanasi",
    "benares": "Varanasi",
    "qutub": "Qutub Minar & Complex",
    "qutb": "Qutub Minar & Complex",
    "amer": "Amber Fort & Palace",
    "amber": "Amber Fort & Palace",
    "hampi": "Group of Monuments at Hampi (Vijayanagara)",
    "vittala": "Vittala Temple Complex & Stone Chariot",
    "golden temple": "Sri Harmandir Sahib (The Golden Temple)",
    "harmandir sahib": "Sri Harmandir Sahib (The Golden Temple)",
    "harminder": "Sri Harmandir Sahib (The Golden Temple)",
    "meenakshi": "Arulmigu Meenakshi Amman Temple",
    "madurai": "Arulmigu Meenakshi Amman Temple",
    "sun temple": "Sun Temple Konark (Black Pagoda)",
    "konark": "Sun Temple Konark (Black Pagoda)",
    "black pagoda": "Sun Temple Konark (Black Pagoda)",
    "brihadeeswarar": "Brihadisvara Temple (Peruvudaiyar Kovil)",
    "tanjore temple": "Brihadisvara Temple (Peruvudaiyar Kovil)",
    "thanjavur": "Brihadisvara Temple (Peruvudaiyar Kovil)",
    "kailasa": "Ellora Caves & Kailasa Temple",
    "ellora": "Ellora Caves & Kailasa Temple",
    "ajanta": "Ajanta Caves",
    "khajuraho": "Khajuraho Group of Monuments",
    "sanchi": "Great Stupa at Sanchi",
    "mahabodhi": "Mahabodhi Temple Complex",
    "bodh gaya": "Mahabodhi Temple Complex",
    "nalanda": "Archaeological Site of Nalanda Mahavihara",
    "rani ki vav": "Rani ki Vav (The Queen's Stepwell)",
    "queen stepwell": "Rani ki Vav (The Queen's Stepwell)",
    "victoria memorial": "Victoria Memorial Hall",
    "gateway of india": "Gateway of India",
    "csmt": "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
    "victoria terminus": "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
    "charminar": "Charminar Monument & Mosque",
    "golconda": "Golconda Fort & Citadel",
    "lepakshi": "Lepakshi Veerabhadra Temple & Nandi",
    "ramappa": "Kakatiya Rudreshwara (Ramappa) Temple",
    "bom jesus": "Basilica of Bom Jesus & Old Goa Churches",
    "old goa": "Basilica of Bom Jesus & Old Goa Churches",
    "pattadakal": "Group of Monuments at Pattadakal",
    "badami": "Badami Rock-cut Cave Temples & Agastya Lake",
    "madhubani": "Madhubani Painting (Mithila Art)",
    "mithila": "Madhubani Painting (Mithila Art)",
    "channapatna": "Channapatna Wooden Toys & Lacquerware",
    "kanchipuram": "Kanchipuram Silk Sarees (Kanjivaram)",
    "kanjivaram": "Kanchipuram Silk Sarees (Kanjivaram)",
    "blue pottery": "Jaipur Blue Pottery",
    "bidriware": "Bidriware Metal Inlay Craft",
    "kathakali": "Kathakali Classical Dance-Drama",
    "bharatanatyam": "Bharatanatyam Classical Dance",
    "chhau": "Chhau Martial Folk Dance",
    "yakshagana": "Yakshagana Traditional Folk Theatre",
    "kalaripayattu": "Kalaripayattu Martial Art Form",
    "chhath": "Chhath Puja Sun Worship Festival",
    "durga puja": "Kolkata Durga Puja",
    "onam": "Onam Harvest Festival & Boat Races",
    "pushkar": "Pushkar Camel & Cultural Fair",
    "hornbill": "Hornbill Festival",
    "hemis": "Hemis Festival & Cham Dances",
    "thrissur pooram": "Thrissur Pooram Festival",
}

def normalize_text(text: str) -> str:
    """Normalize text: strip diacritics, lowercase, collapse whitespace."""
    if not text:
        return ""
    nfkd = unicodedata.normalize('NFKD', text)
    ascii_text = ''.join([c for c in nfkd if not unicodedata.combining(c)])
    return re.sub(r'\s+', ' ', ascii_text.strip().lower())

class SearchService:
    """
    Universal Cultural Search & Entity Resolution Engine.
    Incorporates query normalization, alias resolution, RapidFuzz token-sort similarity,
    exact/token scoring, and database query logging.
    """
    def __init__(self, repo=cultural_repository):
        self.repo = repo

    def search(
        self,
        query: str,
        category: Optional[str] = None,
        state: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> SearchResponse:
        clean_q = normalize_text(query)
        alias_target = CULTURAL_ALIASES.get(clean_q, "")

        matches: List[SearchResultItem] = []
        tokens = clean_q.split() if clean_q else []

        def calculate_score(name: str, desc: str, cat: str, st: str) -> float:
            score = 0.0
            name_norm = normalize_text(name)
            desc_norm = normalize_text(desc)
            cat_norm = normalize_text(cat)
            st_norm = normalize_text(st)

            if not clean_q:
                return 1.0

            # 1. Alias match bonus
            if alias_target and (normalize_text(alias_target) in name_norm or name_norm in normalize_text(alias_target)):
                score += 25.0

            # 2. Exact match
            if clean_q == name_norm:
                score += 20.0
            elif name_norm.startswith(clean_q):
                score += 15.0
            elif clean_q in name_norm:
                score += 10.0

            # 3. RapidFuzz Token-Sort Similarity
            fuzzy_ratio = fuzz.token_sort_ratio(clean_q, name_norm)
            if fuzzy_ratio >= 75:
                score += (fuzzy_ratio / 10.0)

            # 4. State / Category Match
            if clean_q in cat_norm or clean_q in st_norm:
                score += 4.0

            # 5. Token occurrences
            for token in tokens:
                if len(token) > 2:
                    if token in name_norm:
                        score += 4.0
                    elif token in cat_norm or token in st_norm:
                        score += 2.0
                    elif token in desc_norm:
                        score += 1.0

            return score

        # 1. Heritage Places
        for p in self.repo.heritage_places:
            if state and p.state.lower() != state.strip().lower():
                continue
            if category and category.lower() not in p.category.lower() and category.lower() != "heritage":
                continue
            sc = calculate_score(p.name, p.description, p.category, p.state)
            if not clean_q or sc >= 5.0:
                matches.append(SearchResultItem(
                    id=p.id,
                    name=p.name,
                    type="heritage",
                    state=p.state,
                    category=p.category,
                    description=p.description[:220] + ("..." if len(p.description) > 220 else ""),
                    image_url=p.image_url,
                    score=sc,
                    verification_status=p.verification_status
                ))

        # 2. Festivals & Traditions
        for f in self.repo.festivals:
            if state and f.state.lower() != state.strip().lower():
                continue
            if category and category.lower() not in f.category.lower() and category.lower() != "festival":
                continue
            sc = calculate_score(f.name, f.description + " " + f.cultural_significance, f.category, f.state)
            if not clean_q or sc >= 5.0:
                matches.append(SearchResultItem(
                    id=f.id,
                    name=f.name,
                    type="festival",
                    state=f.state,
                    category=f.category,
                    description=f.description[:220] + ("..." if len(f.description) > 220 else ""),
                    image_url=f.image_url,
                    score=sc,
                    verification_status=f.verification_status
                ))

        # 3. Arts, Crafts & Handlooms
        for c in self.repo.arts_crafts:
            if state and c.state.lower() != state.strip().lower():
                continue
            if category and category.lower() not in c.craft_category.lower() and category.lower() != "craft":
                continue
            sc = calculate_score(c.name, c.description + " " + c.cultural_significance, c.craft_category, c.state)
            if not clean_q or sc >= 5.0:
                matches.append(SearchResultItem(
                    id=c.id,
                    name=c.name,
                    type="art_craft",
                    state=c.state,
                    category=c.craft_category,
                    description=c.description[:220] + ("..." if len(c.description) > 220 else ""),
                    image_url=c.image_url,
                    score=sc,
                    verification_status=c.verification_status
                ))

        # 4. Performing Arts
        for a in self.repo.performing_arts:
            if state and a.state.lower() != state.strip().lower():
                continue
            if category and category.lower() not in a.category.lower() and category.lower() != "performing_art":
                continue
            sc = calculate_score(a.name, a.description + " " + a.cultural_significance, a.category, a.state)
            if not clean_q or sc >= 5.0:
                matches.append(SearchResultItem(
                    id=a.id,
                    name=a.name,
                    type="performing_art",
                    state=a.state,
                    category=a.category,
                    description=a.description[:220] + ("..." if len(a.description) > 220 else ""),
                    image_url=a.image_url,
                    score=sc,
                    verification_status=a.verification_status
                ))

        # 5. Cultural Experiences
        for e in self.repo.experiences:
            if state and e.state.lower() != state.strip().lower():
                continue
            if category and category.lower() not in e.category.lower() and category.lower() != "experience":
                continue
            sc = calculate_score(e.name, e.description, e.category, e.state)
            if not clean_q or sc >= 5.0:
                matches.append(SearchResultItem(
                    id=e.id,
                    name=e.name,
                    type="experience",
                    state=e.state,
                    category=e.category,
                    description=e.description[:220] + ("..." if len(e.description) > 220 else ""),
                    image_url=e.image_url,
                    score=sc,
                    verification_status=e.verification_status
                ))

        # 6. Cultural Stories
        for s in self.repo.stories:
            if state and s.state.lower() != state.strip().lower():
                continue
            if category and category.lower() not in s.story_category.lower() and category.lower() != "story":
                continue
            sc = calculate_score(s.title, s.narrative, s.story_category, s.state)
            if not clean_q or sc >= 5.0:
                matches.append(SearchResultItem(
                    id=s.id,
                    name=s.title,
                    type="story",
                    state=s.state,
                    category=s.story_category,
                    description=s.narrative[:220] + ("..." if len(s.narrative) > 220 else ""),
                    image_url="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
                    score=sc,
                    verification_status=s.verification_status
                ))

        # Sort by score descending
        matches.sort(key=lambda x: x.score, reverse=True)

        # Log query to search_logs if query provided
        if clean_q:
            try:
                db_session = SessionLocal()
                resolved = matches[0].name if matches else None
                db_session.add(SearchLog(
                    id=f"log-{hash(clean_q) % 10000000}",
                    query=query[:255],
                    detected_intent="cultural_discovery",
                    resolved_entity=resolved
                ))
                db_session.commit()
                db_session.close()
            except Exception:
                pass

        # Group results
        grouped: Dict[str, List[SearchResultItem]] = {
            "heritage": [],
            "festivals": [],
            "arts_crafts": [],
            "performing_arts": [],
            "experiences": [],
            "stories": [],
            "destinations": []
        }

        for m in matches:
            if m.type == "heritage":
                grouped["heritage"].append(m)
            elif m.type == "festival":
                grouped["festivals"].append(m)
            elif m.type == "art_craft":
                grouped["arts_crafts"].append(m)
            elif m.type == "performing_art":
                grouped["performing_arts"].append(m)
            elif m.type == "experience":
                grouped["experiences"].append(m)
            elif m.type == "story":
                grouped["stories"].append(m)

        paginated_flat = matches[offset:offset + limit]

        return SearchResponse(
            query=query,
            total_matches=len(matches),
            grouped_results=grouped,
            flat_results=paginated_flat
        )

search_service = SearchService()
