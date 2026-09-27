import re
from typing import List, Dict, Any, Tuple
from app.repositories.cultural_repository import cultural_repository

class AIRetrievalEngine:
    """
    Cultural Knowledge Retrieval Engine.
    Extracts entities and cultural concepts from the user's prompt and fetches
    matching records across monuments, festivals, crafts, performing arts, experiences, and stories.
    """
    def __init__(self, repo=cultural_repository):
        self.repo = repo

    def extract_entities_and_retrieve(
        self,
        query: str,
        context_record_id: str = None
    ) -> Tuple[List[Dict[str, Any]], List[str]]:
        clean_q = query.lower().strip()
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

        # 2. Token & regex entity matching across all collections
        words = set(re.findall(r'\b[a-zA-Z]{3,}\b', clean_q))

        # Check festivals
        for f in self.repo.festivals:
            name_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', f.name.lower()))
            if f.name.lower() in clean_q or f.id in clean_q or (words and len(words.intersection(name_words)) >= 1):
                d = f.model_dump()
                d["_entity_type"] = "festival"
                if d not in retrieved_records:
                    retrieved_records.append(d)
                if f.source_url and f.source_url not in sources:
                    sources.append(f.source_url)

        # Check heritage places
        for p in self.repo.heritage_places:
            p_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', p.name.lower()))
            if p.name.lower() in clean_q or p.id in clean_q or (words and len(words.intersection(p_words)) >= 2):
                d = p.model_dump()
                d["_entity_type"] = "heritage"
                if d not in retrieved_records:
                    retrieved_records.append(d)
                if p.source_url and p.source_url not in sources:
                    sources.append(p.source_url)

        # Check arts & crafts
        for a in self.repo.arts_crafts:
            a_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', a.name.lower()))
            if a.name.lower() in clean_q or a.id in clean_q or (words and len(words.intersection(a_words)) >= 1):
                d = a.model_dump()
                d["_entity_type"] = "art_craft"
                if d not in retrieved_records:
                    retrieved_records.append(d)
                if a.source_url and a.source_url not in sources:
                    sources.append(a.source_url)

        # Check folk & performing arts
        for pa in self.repo.performing_arts:
            pa_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', pa.name.lower()))
            if pa.name.lower() in clean_q or pa.id in clean_q or (words and len(words.intersection(pa_words)) >= 1):
                d = pa.model_dump()
                d["_entity_type"] = "performing_art"
                if d not in retrieved_records:
                    retrieved_records.append(d)
                if pa.source_url and pa.source_url not in sources:
                    sources.append(pa.source_url)

        # Check cultural stories
        for s in self.repo.stories:
            s_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', s.title.lower()))
            if s.title.lower() in clean_q or s.id in clean_q or (words and len(words.intersection(s_words)) >= 2):
                d = s.model_dump()
                d["_entity_type"] = "story"
                if d not in retrieved_records:
                    retrieved_records.append(d)
                if s.source_url and s.source_url not in sources:
                    sources.append(s.source_url)

        # Check state/city general mentions
        for sc in self.repo.states_and_cities:
            if sc.name.lower() in clean_q and len(sc.name) > 3:
                # Retrieve top items from this state
                for p in self.repo.get_heritage_places(state=sc.state)[:2]:
                    d = p.model_dump()
                    d["_entity_type"] = "heritage"
                    if d not in retrieved_records:
                        retrieved_records.append(d)
                    if p.source_url and p.source_url not in sources:
                        sources.append(p.source_url)
                for f in self.repo.get_festivals(state=sc.state)[:1]:
                    d = f.model_dump()
                    d["_entity_type"] = "festival"
                    if d not in retrieved_records:
                        retrieved_records.append(d)
                break

        return retrieved_records[:6], sources

ai_retrieval_engine = AIRetrievalEngine()
