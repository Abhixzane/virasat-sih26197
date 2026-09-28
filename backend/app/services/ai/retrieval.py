import re
from typing import List, Dict, Any, Tuple, Optional
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

class AIRetrievalEngine:
    """
    Cultural Knowledge Retrieval Engine.
    Extracts entities and cultural concepts from the user's prompt and fetches
    matching records across monuments, festivals, crafts, performing arts, experiences, and stories.
    Supports session-aware anaphora resolution and prevents false-positive fallbacks for unseeded entities.
    """
    def __init__(self, repo=cultural_repository):
        self.repo = repo

    def extract_entities_and_retrieve(
        self,
        query: str,
        context_record_id: Optional[str] = None,
        conversation_history: Optional[List[Any]] = None
    ) -> Tuple[List[Dict[str, Any]], List[str]]:
        clean_q = query.lower().strip()
        norm_q = clean_text(query)
        words = set(re.findall(r'\b[a-zA-Z]{3,}\b', norm_q)) - STOP_WORDS
        retrieved_records: List[Dict[str, Any]] = []
        sources: List[str] = []

        # 1. If explicit context record is provided
        if context_record_id:
            rec = self.repo.get_record_by_any_id(context_record_id)
            if rec:
                rec_type, entity = rec
                rec_dict = entity.model_dump()
                rec_dict["_entity_type"] = rec_type
                retrieved_records.append(rec_dict)
                if getattr(entity, "source_url", None):
                    sources.append(entity.source_url)

        # 2. Check heritage places
        for p in self.repo.heritage_places:
            p_norm = clean_text(p.name)
            p_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', p_norm)) - STOP_WORDS
            primary_title = clean_text(p.name.split(',')[0])
            if (p.name.lower() in clean_q or p.id in clean_q or
                primary_title in norm_q or
                (words and words.issubset(p_words)) or
                (len(words.intersection(p_words)) >= 2)):
                d = p.model_dump()
                d["_entity_type"] = "heritage"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if p.source_url and p.source_url not in sources:
                    sources.append(p.source_url)

        # 3. Check festivals
        for f in self.repo.festivals:
            f_norm = clean_text(f.name)
            f_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', f_norm)) - STOP_WORDS
            primary_title = clean_text(f.name.split(',')[0])
            if (f.name.lower() in clean_q or f.id in clean_q or
                primary_title in norm_q or
                (words and words.issubset(f_words)) or
                (len(words.intersection(f_words)) >= 2)):
                d = f.model_dump()
                d["_entity_type"] = "festival"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if f.source_url and f.source_url not in sources:
                    sources.append(f.source_url)

        # 4. Check arts & crafts
        for a in self.repo.arts_crafts:
            a_norm = clean_text(a.name)
            a_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', a_norm)) - STOP_WORDS
            primary_title = clean_text(a.name.split(',')[0])
            if (a.name.lower() in clean_q or a.id in clean_q or
                primary_title in norm_q or
                (words and words.issubset(a_words)) or
                (len(words.intersection(a_words)) >= 2)):
                d = a.model_dump()
                d["_entity_type"] = "art_craft"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if a.source_url and a.source_url not in sources:
                    sources.append(a.source_url)

        # 5. Check folk & performing arts
        for pa in self.repo.performing_arts:
            pa_norm = clean_text(pa.name)
            pa_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', pa_norm)) - STOP_WORDS
            primary_title = clean_text(pa.name.split(',')[0])
            if (pa.name.lower() in clean_q or pa.id in clean_q or
                primary_title in norm_q or
                (words and words.issubset(pa_words)) or
                (len(words.intersection(pa_words)) >= 2)):
                d = pa.model_dump()
                d["_entity_type"] = "performing_art"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if pa.source_url and pa.source_url not in sources:
                    sources.append(pa.source_url)

        # 6. Check cultural experiences & stories
        for exp in self.repo.experiences:
            exp_norm = clean_text(exp.name)
            exp_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', exp_norm)) - STOP_WORDS
            if (exp.name.lower() in clean_q or exp.id in clean_q or
                (words and words.issubset(exp_words)) or
                (len(words.intersection(exp_words)) >= 2)):
                d = exp.model_dump()
                d["_entity_type"] = "experience"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if exp.source_url and exp.source_url not in sources:
                    sources.append(exp.source_url)

        for s in self.repo.stories:
            s_norm = clean_text(s.title)
            s_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', s_norm)) - STOP_WORDS
            if (s.title.lower() in clean_q or s.id in clean_q or
                (words and words.issubset(s_words)) or
                (len(words.intersection(s_words)) >= 2)):
                d = s.model_dump()
                d["_entity_type"] = "story"
                if not any(r.get("id") == d.get("id") for r in retrieved_records):
                    retrieved_records.append(d)
                if s.source_url and s.source_url not in sources:
                    sources.append(s.source_url)

        # 7. Anaphora / Pronoun resolution across conversation history
        has_pronoun = bool(re.search(r'\b(it|its|this|that|these|those|there|here|the monument|the temple|the tomb|the fort|the palace|the site|the craft|the art|the festival|the dance|the place)\b', clean_q))
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
                    u_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', u_norm)) - STOP_WORDS
                    for p in self.repo.heritage_places:
                        p_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', clean_text(p.name))) - STOP_WORDS
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

        # 8. State/city exploration fallback ONLY if query has no unmatched substantive entity tokens
        has_unmatched_substantive = False
        if words:
            matched_any = False
            for r in retrieved_records:
                r_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', clean_text(r.get("name") or r.get("title", ""))))
                if words.intersection(r_words):
                    matched_any = True
                    break
            if not matched_any:
                has_unmatched_substantive = True

        if not retrieved_records and not has_unmatched_substantive:
            for sc in self.repo.states_and_cities:
                if sc.name.lower() in clean_q and len(sc.name) > 3:
                    for p in self.repo.get_heritage_places(state=sc.state)[:2]:
                        d = p.model_dump()
                        d["_entity_type"] = "heritage"
                        if not any(r.get("id") == d.get("id") for r in retrieved_records):
                            retrieved_records.append(d)
                        if p.source_url and p.source_url not in sources:
                            sources.append(p.source_url)
                    for f in self.repo.get_festivals(state=sc.state)[:1]:
                        d = f.model_dump()
                        d["_entity_type"] = "festival"
                        if not any(r.get("id") == d.get("id") for r in retrieved_records):
                            retrieved_records.append(d)
                        if f.source_url and f.source_url not in sources:
                            sources.append(f.source_url)
                    break

        return retrieved_records[:6], sources

ai_retrieval_engine = AIRetrievalEngine()
