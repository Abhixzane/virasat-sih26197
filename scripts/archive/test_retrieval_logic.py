import sys
import os
import re
from typing import List, Dict, Any, Tuple, Optional

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.repositories.cultural_repository import cultural_repository

STOP_WORDS = {
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
    "indian", "there", "their", "his", "her", "name", "called", "some"
}

def clean_text(t: str) -> str:
    return re.sub(r"[^\w\s]", " ", t.lower()).strip()

def test_extract(query: str, history: list = None):
    clean_q = query.lower().strip()
    norm_q = clean_text(query)
    q_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', norm_q)) - STOP_WORDS

    retrieved = []
    sources = []

    # Check heritage places
    for p in cultural_repository.heritage_places:
        p_name_norm = clean_text(p.name)
        p_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', p_name_norm)) - STOP_WORDS
        primary_title = clean_text(p.name.split(',')[0])
        
        # Exact match or title in query or query in title
        if (p.name.lower() in clean_q or p.id in clean_q or 
            primary_title in norm_q or 
            (q_words and q_words.issubset(p_words)) or
            (len(q_words.intersection(p_words)) >= 2)):
            d = p.model_dump()
            d["_entity_type"] = "heritage"
            retrieved.append(d)
            if p.source_url:
                sources.append(p.source_url)

    # Anaphora check if nothing retrieved and query has pronouns
    has_pronoun = bool(re.search(r'\b(it|its|this|that|the monument|the temple|the tomb)\b', clean_q))
    if (not retrieved or has_pronoun) and history:
        for msg in reversed(history):
            content = msg.get("content", "")
            role = msg.get("role", "")
            if role == "assistant":
                m = re.search(r'###\s+([^\n\(—]+)', content)
                if m:
                    cand = clean_text(m.group(1))
                    for p in cultural_repository.heritage_places:
                        if cand in clean_text(p.name) or clean_text(p.name) in cand:
                            d = p.model_dump()
                            d["_entity_type"] = "heritage"
                            if d not in retrieved:
                                retrieved.insert(0, d)
                            if p.source_url and p.source_url not in sources:
                                sources.insert(0, p.source_url)
                            break
            elif role == "user":
                u_norm = clean_text(content)
                u_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', u_norm)) - STOP_WORDS
                for p in cultural_repository.heritage_places:
                    p_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', clean_text(p.name))) - STOP_WORDS
                    if clean_text(p.name.split(',')[0]) in u_norm or (u_words and u_words.issubset(p_words)):
                        d = p.model_dump()
                        d["_entity_type"] = "heritage"
                        if d not in retrieved:
                            retrieved.insert(0, d)
                        if p.source_url and p.source_url not in sources:
                            sources.insert(0, p.source_url)
                        break
            if retrieved:
                break

    # State city check only if NO substantive unknown words
    # Check if there are content words that matched nothing
    # E.g. "atlantis sun citadel" -> "atlantis" matched nothing!
    has_unmatched_substantive = False
    if q_words:
        # check if all q_words matched anything
        matched_any = False
        for r in retrieved:
            r_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', clean_text(r.get("name", ""))))
            if q_words.intersection(r_words):
                matched_any = True
                break
        if not matched_any and len(q_words) > 0:
            has_unmatched_substantive = True

    if not retrieved and not has_unmatched_substantive:
        for sc in cultural_repository.states_and_cities:
            if sc.name.lower() in clean_q and len(sc.name) > 3:
                for p in cultural_repository.get_heritage_places(state=sc.state)[:2]:
                    d = p.model_dump()
                    d["_entity_type"] = "heritage"
                    retrieved.append(d)
                break

    return retrieved, sources

# Run test 1:
r1, s1 = test_extract("Tell me about Humayun's Tomb")
print("Test 1 (Humayun's Tomb):", len(r1), [x['name'] for x in r1], s1)

# Run test 2:
r2, s2 = test_extract("Tell me about the Atlantis Sun Citadel in Patna")
print("Test 2 (Atlantis Sun Citadel in Patna):", len(r2), [x['name'] for x in r2], s2)

# Run test 3:
history = [
    {"role": "user", "content": "Tell me about Humayun's Tomb"},
    {"role": "assistant", "content": "### Humayun's Tomb Complex, New Delhi (Heritage — Delhi)\n**Overview & Context:**..."}
]
r3, s3 = test_extract("What is its architectural style?", history=history)
print("Test 3 (What is its architectural style?):", len(r3), [x['name'] for x in r3], s3)
