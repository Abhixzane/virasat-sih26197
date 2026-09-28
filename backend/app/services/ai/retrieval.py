import re
import math
from typing import List, Dict, Any, Tuple, Optional
from app.repositories.cultural_repository import cultural_repository

STOP_WORDS = {
    # English stop words
    "the", "and", "for", "with", "about", "can", "you", "tell", "from", "are", 
    "what", "how", "why", "who", "which", "where", "when", "that", "this", 
    "all", "any", "its", "it", "more", "much", "built", "give", "show", "know", 
    "information", "details", "heritage", "place", "places", "culture", "cultural", 
    "tradition", "traditions", "traditional", "art", "arts", "craft", "crafts", 
    "dance", "dances", "style", "architectural", "architecture", "music", "song", 
    "temple", "temples", "tomb", "tombs", "fort", "forts", "palace", "palaces", 
    "monument", "monuments", "festival", "festivals", "fair", "fairs", "citadel", 
    "complex", "history", "historical", "period", "story", "stories", "famous", 
    "popular", "best", "visit", "trip", "tour", "travel", "city", "state", "india", 
    "indian", "there", "their", "his", "her", "name", "called", "some", "near", "nearby",
    "around", "good", "recommend", "suggest", "guide", "day", "days", "time", "hours",
    
    # Hindi and Hinglish particles & common conversational tokens
    "kya", "hai", "hain", "tha", "the", "thi", "hoga", "hogi", "batao", "kaise", 
    "kahan", "kab", "kyun", "kaun", "kise", "ke", "ki", "ka", "ko", "se", "mein", 
    "me", "par", "pe", "aur", "ya", "toh", "bhi", "yeh", "woh", "is", "us", "in", 
    "un", "kuch", "sab", "apna", "apne", "hum", "main", "aap", "tum", "jaana", 
    "ghoomna", "dekhna", "karein", "karo", "plan", "banao", "achha", "accha", 
    "kripya", "namaste", "hello", "hi", "hey", "chahiye", "sakte", "paas", "wala", 
    "wali", "wale", "kisko", "itna", "kitna", "kharcha", "lagta", "rahe", "raha",
    # Devanagari particles
    "क्या", "है", "हैं", "था", "थी", "थे", "बताओ", "कैसे", "कहाँ", "कब", "क्यों", 
    "कौन", "के", "की", "का", "को", "से", "में", "पर", "और", "या", "तो", "भी", 
    "यह", "वह", "इस", "उस", "कुछ", "सब", "हम", "मैं", "आप", "घूमना", "जाना", "देखना"
}

# Alias & synonym mappings: maps popular, colloquial, historic, Devanagari, and typo spellings to canonical keys
ENTITY_SYNONYMS = {
    # Varanasi / Kashi
    "kashi": "Varanasi",
    "काशी": "Varanasi",
    "banaras": "Varanasi",
    "बनारस": "Varanasi",
    "benares": "Varanasi",
    "kashi vishwanath": "Kashi Vishwanath",
    
    # Delhi / Dilli
    "dilli": "Delhi",
    "दिल्ली": "Delhi",
    "new delhi": "Delhi",
    "qutub": "Qutb Minar",
    "qutab": "Qutb Minar",
    "red fort": "Red Fort Complex",
    "lal qila": "Red Fort Complex",
    "लाल किला": "Red Fort Complex",
    "humayun": "Humayun's Tomb",

    # Prayagraj
    "prayag": "Prayagraj",
    "allahabad": "Prayagraj",
    "प्रयागराज": "Prayagraj",
    "triveni sangam": "Triveni Sangam",

    # Mumbai / Bombay
    "bombay": "Mumbai",
    "बंबई": "Mumbai",
    "gateway of india": "Gateway of India",
    "elephanta": "Elephanta Caves",

    # Kolkata / Calcutta
    "calcutta": "Kolkata",
    "कलकत्ता": "Kolkata",
    "victoria memorial": "Victoria Memorial",
    "dakshineswar": "Dakshineswar Kali Temple",

    # Chennai / Madras
    "madras": "Chennai",
    "मद्रास": "Chennai",

    # Hampi / Vijayanagara
    "humpi": "Hampi",
    "हम्पी": "Hampi",
    "vijayanagar": "Hampi",
    "vijayanagara": "Hampi",
    "vittala": "Vittala Temple",
    "virupaksha": "Virupaksha Temple",
    "stone chariot": "Vittala Temple Complex & Stone Chariot",

    # Mamallapuram / Mahabalipuram
    "mahabalipuram": "Mamallapuram",
    "महाबलीपुरम": "Mamallapuram",
    "shore temple": "Shore Temple & Group of Monuments",
    "pancha rathas": "Shore Temple & Group of Monuments",

    # Agra & Taj
    "taj mehal": "Taj Mahal",
    "taj mahl": "Taj Mahal",
    "tajmahal": "Taj Mahal",
    "taj": "Taj Mahal",
    "ताजमहल": "Taj Mahal",
    "fatehpur": "Fatehpur Sikri",
    "fatehpur sikri": "Fatehpur Sikri",
    "agra fort": "Agra",
    "agrah fort": "Agra",
    "agrah": "Agra",

    # Caves & Monuments
    "ajanta alora": "Ajanta Caves",
    "ajanta ellora": "Ajanta Caves",
    "alora": "Ellora Caves",
    "elora": "Ellora Caves",
    "kailash temple": "Ellora Caves",
    "aurangabad": "Ajanta Caves",
    "khajurao": "Khajuraho Group of Monuments",
    "खजुराहो": "Khajuraho Group of Monuments",
    "konark sun templ": "Sun Temple, Konark",
    "konark": "Sun Temple, Konark",
    "कोणारक": "Sun Temple, Konark",
    "jagannath": "Jagannath Temple, Puri",
    "puri rath yatra": "Jagannath Rath Yatra",

    # South Indian Heritage
    "meenakshi": "Meenakshi Amman Temple",
    "meenakshi amman": "Meenakshi Amman Temple",
    "madurai temple": "Meenakshi Amman Temple",
    "brihadisvara": "Brihadisvara Temple, Thanjavur",
    "tanjore temple": "Brihadisvara Temple, Thanjavur",
    "tanjore": "Thanjavur",
    "padmanabhaswamy": "Sree Padmanabhaswamy Temple",

    # Crafts & GI Tags
    "madhubani": "Madhubani (Mithila) Painting",
    "mithila": "Madhubani (Mithila) Painting",
    "मधुबनी": "Madhubani (Mithila) Painting",
    "blue pottery": "Jaipur Blue Pottery",
    "chikankari": "Lucknow Chikan Craft",
    "chikan": "Lucknow Chikan Craft",
    "pashmina": "Kashmir Pashmina",
    "पश्मीना": "Kashmir Pashmina",
    "kanchipuram": "Kanchipuram Silk",
    "kanjivaram": "Kanchipuram Silk",
    "dhokra": "Dhokra Metal Craft",
    "warli": "Warli Painting",
    "bidriware": "Bidriware",
    "kathakali": "Kathakali",
    "bharatanatyam": "Bharatanatyam",
    "garba": "Garba of Gujarat",

    # Festivals
    "chhath": "Chhath Puja",
    "छठ": "Chhath Puja",
    "kumbh": "Kumbh Mela",
    "कुंभ": "Kumbh Mela",
    "durga puja": "Durga Puja of Kolkata",
    "दुर्गा पूजा": "Durga Puja of Kolkata",
    "onam": "Onam",
    "ओणम": "Onam",
    "bihu": "Bohu (Bohag Bihu)",
    "pushkar": "Pushkar Camel Fair",
    "ganesh chaturthi": "Ganesh Chaturthi"
}

def clean_text(t: str) -> str:
    # Preserve alphanumeric and Devanagari script characters
    return re.sub(r"[^\w\s\u0900-\u097F]", " ", t.lower()).strip()

def extract_tokens(text: str) -> List[str]:
    """Extracts alphanumeric (Latin and Devanagari) tokens from query."""
    return re.findall(r'[\u0900-\u097F]{2,}|[a-zA-Z]{2,}', text.lower())

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = (math.sin(dphi / 2.0)**2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0)**2)
    return R * 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

class AIRetrievalEngine:
    """
    Enhanced Cultural Knowledge Retrieval Engine.
    Extracts entities, synonyms, Hindi/Hinglish concepts, and geographic proximity
    from the user prompt, fetching matching records across monuments, festivals,
    crafts, performing arts, experiences, and stories.
    """
    def __init__(self, repo=cultural_repository):
        self.repo = repo

    def resolve_synonyms_in_query(self, query: str) -> Tuple[str, List[str]]:
        """Scans the query for known synonyms/aliases and returns canonical entity terms."""
        lower_q = query.lower()
        expanded_terms: List[str] = []
        for alias, canonical in ENTITY_SYNONYMS.items():
            if alias in lower_q:
                expanded_terms.append(canonical)
        return lower_q, expanded_terms

    def find_nearby_entities(self, lat: float, lon: float, radius_km: float = 80.0) -> List[Dict[str, Any]]:
        """Finds heritage sites, experiences, and crafts in the geographic vicinity."""
        results = []
        for p in self.repo.heritage_places:
            dist = haversine_km(lat, lon, p.latitude, p.longitude)
            if dist <= radius_km:
                d = p.model_dump()
                d["_entity_type"] = "heritage"
                d["_distance_km"] = round(dist, 1)
                results.append((dist, d))

        for exp in self.repo.experiences:
            dist = haversine_km(lat, lon, exp.latitude, exp.longitude)
            if dist <= radius_km:
                d = exp.model_dump()
                d["_entity_type"] = "experience"
                d["_distance_km"] = round(dist, 1)
                results.append((dist, d))

        results.sort(key=lambda x: x[0])
        return [item[1] for item in results[:6]]

    def extract_entities_and_retrieve(
        self,
        query: str,
        context_record_id: Optional[str] = None,
        conversation_history: Optional[List[Any]] = None
    ) -> Tuple[List[Dict[str, Any]], List[str]]:
        clean_q = query.lower().strip()
        norm_q = clean_text(query)
        all_tokens = extract_tokens(norm_q)
        words = set(all_tokens) - STOP_WORDS
        retrieved_records: List[Dict[str, Any]] = []
        sources: List[str] = []

        # 1. Expand query with canonical synonyms
        _, canonical_terms = self.resolve_synonyms_in_query(query)
        for term in canonical_terms:
            t_tokens = set(extract_tokens(term)) - STOP_WORDS
            words = words.union(t_tokens)

        # 2. If explicit context record is provided
        if context_record_id:
            rec = self.repo.get_record_by_any_id(context_record_id)
            if rec:
                rec_type, entity = rec
                rec_dict = entity.model_dump()
                rec_dict["_entity_type"] = rec_type
                retrieved_records.append(rec_dict)
                if getattr(entity, "source_url", None):
                    sources.append(entity.source_url)

        # Helper matching function
        def matches_entity(entity_name: str, entity_id: str, state_str: str = "", district_str: str = "") -> bool:
            ent_norm = clean_text(entity_name)
            ent_tokens = set(extract_tokens(ent_norm)) - STOP_WORDS
            
            # Exact or substring match in query
            if entity_name.lower() in clean_q or entity_id in clean_q:
                return True
            
            # Canonical term match
            for ct in canonical_terms:
                if ct.lower() in entity_name.lower() or ct.lower() in ent_norm:
                    return True

            # Match primary title before comma (e.g. "Vittala Temple" from "Vittala Temple Complex & Stone Chariot, Hampi")
            primary_title = clean_text(entity_name.split(',')[0])
            if primary_title and len(primary_title) > 3 and primary_title in norm_q:
                return True

            # Substantive token overlap
            if words and ent_tokens:
                overlap = words.intersection(ent_tokens)
                if len(overlap) >= 2 or (len(overlap) == 1 and any(len(w) >= 5 for w in overlap)):
                    return True

            # Location match if user specifically queries that district or state
            if state_str and state_str.lower() in clean_q and len(state_str) > 4:
                if any(w in ent_tokens for w in words):
                    return True

            return False

        # 3. Check heritage places
        for p in self.repo.heritage_places:
            if matches_entity(p.name, p.id, p.state, p.city):
                d = p.model_dump()
                d["_entity_type"] = "heritage"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if p.source_url and p.source_url not in sources:
                    sources.append(p.source_url)

        # 4. Check festivals
        for f in self.repo.festivals:
            if matches_entity(f.name, f.id, f.state, f.region):
                d = f.model_dump()
                d["_entity_type"] = "festival"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if f.source_url and f.source_url not in sources:
                    sources.append(f.source_url)

        # 5. Check arts & crafts
        for a in self.repo.arts_crafts:
            if matches_entity(a.name, a.id, a.state, getattr(a, 'origin', '')):
                d = a.model_dump()
                d["_entity_type"] = "art_craft"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if a.source_url and a.source_url not in sources:
                    sources.append(a.source_url)

        # 6. Check folk & performing arts
        for pa in self.repo.performing_arts:
            if matches_entity(pa.name, pa.id, pa.state, ""):
                d = pa.model_dump()
                d["_entity_type"] = "performing_art"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if pa.source_url and pa.source_url not in sources:
                    sources.append(pa.source_url)

        # 7. Check cultural experiences & stories
        for exp in self.repo.experiences:
            if matches_entity(exp.name, exp.id, exp.state, exp.city):
                d = exp.model_dump()
                d["_entity_type"] = "experience"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if exp.source_url and exp.source_url not in sources:
                    sources.append(exp.source_url)

        for s in self.repo.stories:
            if matches_entity(s.title, s.id, s.state, ""):
                d = s.model_dump()
                d["_entity_type"] = "story"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if s.source_url and s.source_url not in sources:
                    sources.append(s.source_url)

        # 8. Check cities and cultural destinations (All 28 States & 8 UTs)
        for c in self.repo.states_and_cities:
            if matches_entity(c.name, c.id, c.state, ""):
                d = c.model_dump()
                d["_entity_type"] = "city"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if getattr(c, "source_url", None) and c.source_url not in sources:
                    sources.append(c.source_url)

        # 9. Anaphora / Pronoun resolution across conversation history (English & Hindi/Hinglish)
        pronoun_pattern = r'\b(it|its|this|that|these|those|there|here|the monument|the temple|the tomb|the fort|the palace|the site|the craft|the art|the festival|the place|woh|woh jagah|wahan|uske|uske paas|iska|iski|iski history|udhar|pehle wala|previous wala|previous one|is jagah|us jagah)\b'
        has_pronoun = bool(re.search(pronoun_pattern, clean_q))
        is_follow_up = has_pronoun or (len(words) == 0 and len(clean_q.split()) <= 6)

        if is_follow_up and conversation_history:
            for msg in reversed(conversation_history):
                content = msg.get("content", "") if isinstance(msg, dict) else getattr(msg, "content", "")
                role = msg.get("role", "") if isinstance(msg, dict) else getattr(msg, "role", "")
                resolved_id = None

                if role == "assistant":
                    m = re.search(r'###\s+([^\n\(—\-]+)', content)
                    if m:
                        cand_title = clean_text(m.group(1))
                        for p in self.repo.heritage_places:
                            if cand_title in clean_text(p.name) or clean_text(p.name) in cand_title:
                                resolved_id = p.id
                                break
                        if not resolved_id:
                            for f in self.repo.festivals:
                                if cand_title in clean_text(f.name) or clean_text(f.name) in cand_title:
                                    resolved_id = f.id
                                    break
                        if not resolved_id:
                            for a in self.repo.arts_crafts:
                                if cand_title in clean_text(a.name) or clean_text(a.name) in cand_title:
                                    resolved_id = a.id
                                    break
                elif role == "user":
                    u_norm = clean_text(content)
                    u_words = set(extract_tokens(u_norm)) - STOP_WORDS
                    for p in self.repo.heritage_places:
                        p_words = set(extract_tokens(clean_text(p.name))) - STOP_WORDS
                        if clean_text(p.name.split(',')[0]) in u_norm or (u_words and u_words.issubset(p_words)):
                            resolved_id = p.id
                            break

                if resolved_id:
                    rec_info = self.repo.get_record_by_any_id(resolved_id)
                    if rec_info:
                        rtype, rentity = rec_info
                        rd = rentity.model_dump()
                        rd["_entity_type"] = rtype
                        if not any(r.get("id") == rd.get("id") for r in retrieved_records):
                            retrieved_records.insert(0, rd)
                        if getattr(rentity, "source_url", None) and rentity.source_url not in sources:
                            sources.insert(0, rentity.source_url)
                        break

        # 9. State/city exploration fallback ONLY if query has recognized city/state name and no other entity
        if not retrieved_records:
            for sc in self.repo.states_and_cities:
                if (sc.name.lower() in clean_q or (getattr(sc, 'district', None) and sc.district.lower() in clean_q)) and len(sc.name) > 3:
                    target_state = sc.state
                    for p in self.repo.get_heritage_places(state=target_state)[:2]:
                        d = p.model_dump()
                        d["_entity_type"] = "heritage"
                        if not any(r.get("id") == d.get("id") for r in retrieved_records):
                            retrieved_records.append(d)
                        if p.source_url and p.source_url not in sources:
                            sources.append(p.source_url)
                    for f in self.repo.get_festivals(state=target_state)[:1]:
                        d = f.model_dump()
                        d["_entity_type"] = "festival"
                        if not any(r.get("id") == d.get("id") for r in retrieved_records):
                            retrieved_records.append(d)
                        if f.source_url and f.source_url not in sources:
                            sources.append(f.source_url)
                    for a in self.repo.get_arts_crafts(state=target_state)[:1]:
                        d = a.model_dump()
                        d["_entity_type"] = "art_craft"
                        if not any(r.get("id") == d.get("id") for r in retrieved_records):
                            retrieved_records.append(d)
                        if a.source_url and a.source_url not in sources:
                            sources.append(a.source_url)
                    break

        return retrieved_records[:6], sources

ai_retrieval_engine = AIRetrievalEngine()
