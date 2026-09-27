from typing import Optional, List
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import (
    RelatedHeritageResponse, HeritagePlace, Festival, ArtCraft,
    PerformingArt, CulturalExperience, CulturalStory
)

class RelationshipService:
    """
    Connected Cultural Intelligence Engine.
    Discovers bidirectional and contextual relationships between heritage places,
    festivals, traditional crafts, performing arts, experiences, and stories.
    """
    def __init__(self, repo=cultural_repository):
        self.repo = repo

    def get_related_heritage(self, record_type: str, record_id: str) -> Optional[RelatedHeritageResponse]:
        record_info = self.repo.get_record_by_any_id(record_id)
        if not record_info:
            return None

        actual_type, entity = record_info
        record_name = getattr(entity, "name", getattr(entity, "title", record_id))
        record_state = getattr(entity, "state", "")
        record_region = getattr(entity, "region", "")

        related_places: List[HeritagePlace] = []
        related_festivals: List[Festival] = []
        related_arts: List[ArtCraft] = []
        related_performing_arts: List[PerformingArt] = []
        related_experiences: List[CulturalExperience] = []
        related_stories: List[CulturalStory] = []
        source_refs: List[str] = []

        if getattr(entity, "source_url", None):
            source_refs.append(entity.source_url)

        # ---------------------------------------------------------
        # Case 1: Primary record is a FESTIVAL
        # ---------------------------------------------------------
        if actual_type == "festival":
            fest: Festival = entity
            # 1. Directly associated places via associated_place_ids
            for pid in fest.associated_place_ids:
                p = self.repo.get_heritage_place_by_id(pid)
                if p and p not in related_places:
                    related_places.append(p)
                    if p.source_url and p.source_url not in source_refs:
                        source_refs.append(p.source_url)

            # 2. Directly related traditions/arts via related_tradition_ids
            for tid in fest.related_tradition_ids:
                art = self.repo.get_art_craft_by_id(tid)
                if art and art not in related_arts:
                    related_arts.append(art)
                    if art.source_url and art.source_url not in source_refs:
                        source_refs.append(art.source_url)
                part = self.repo.get_performing_art_by_id(tid)
                if part and part not in related_performing_arts:
                    related_performing_arts.append(part)
                    if part.source_url and part.source_url not in source_refs:
                        source_refs.append(part.source_url)

            # 3. Regional arts, performing arts, experiences, and stories from same state
            if fest.state:
                state_lower = fest.state.lower()
                for art in self.repo.get_arts_crafts(fest.state):
                    if art not in related_arts:
                        related_arts.append(art)
                for part in self.repo.get_performing_arts(fest.state):
                    if part not in related_performing_arts:
                        related_performing_arts.append(part)
                for exp in self.repo.get_cultural_experiences(fest.state):
                    if exp not in related_experiences:
                        related_experiences.append(exp)
                for story in self.repo.get_cultural_stories(fest.state):
                    if story not in related_stories:
                        related_stories.append(story)

        # ---------------------------------------------------------
        # Case 2: Primary record is a HERITAGE PLACE
        # ---------------------------------------------------------
        elif actual_type == "heritage":
            place: HeritagePlace = entity
            # 1. Festivals linking to this place
            for f in self.repo.festivals:
                if place.id in f.associated_place_ids or (f.state.lower() == place.state.lower() and f.state):
                    if f not in related_festivals:
                        related_festivals.append(f)
                        if f.source_url and f.source_url not in source_refs:
                            source_refs.append(f.source_url)

            # 2. Cultural experiences anchored at this place
            for exp in self.repo.experiences:
                if exp.associated_place_id == place.id or (exp.city.lower() == place.city.lower()):
                    if exp not in related_experiences:
                        related_experiences.append(exp)
                        if exp.source_url and exp.source_url not in source_refs:
                            source_refs.append(exp.source_url)

            # 3. Cultural stories rooted in this place
            for s in self.repo.stories:
                if s.associated_place_id == place.id or (s.state.lower() == place.state.lower()):
                    if s not in related_stories:
                        related_stories.append(s)
                        if s.source_url and s.source_url not in source_refs:
                            source_refs.append(s.source_url)

            # 4. Regional arts & performing arts
            if place.state:
                for art in self.repo.get_arts_crafts(place.state):
                    if art not in related_arts:
                        related_arts.append(art)
                for part in self.repo.get_performing_arts(place.state):
                    if part not in related_performing_arts:
                        related_performing_arts.append(part)

        # ---------------------------------------------------------
        # Case 3: Primary record is an ART OR CRAFT
        # ---------------------------------------------------------
        elif actual_type == "art_craft":
            art: ArtCraft = entity
            # 1. State heritage places
            if art.state:
                for p in self.repo.get_heritage_places(state=art.state)[:4]:
                    related_places.append(p)
                for f in self.repo.get_festivals(state=art.state):
                    if art.id in f.related_tradition_ids or f not in related_festivals:
                        related_festivals.append(f)
                for s in self.repo.get_cultural_stories(state=art.state):
                    related_stories.append(s)
                for part in self.repo.get_performing_arts(state=art.state):
                    related_performing_arts.append(part)

        # ---------------------------------------------------------
        # Case 4: Primary record is PERFORMING ART
        # ---------------------------------------------------------
        elif actual_type == "performing_art":
            part: PerformingArt = entity
            if part.state:
                for p in self.repo.get_heritage_places(state=part.state)[:4]:
                    related_places.append(p)
                for f in self.repo.get_festivals(state=part.state):
                    related_festivals.append(f)
                for a in self.repo.get_arts_crafts(state=part.state):
                    related_arts.append(a)
                for s in self.repo.get_cultural_stories(state=part.state):
                    related_stories.append(s)

        # ---------------------------------------------------------
        # Case 5: Primary record is CULTURAL EXPERIENCE
        # ---------------------------------------------------------
        elif actual_type == "experience":
            exp: CulturalExperience = entity
            if exp.associated_place_id:
                p = self.repo.get_heritage_place_by_id(exp.associated_place_id)
                if p:
                    related_places.append(p)
            for f in self.repo.get_festivals(state=exp.state):
                related_festivals.append(f)
            for a in self.repo.get_arts_crafts(state=exp.state):
                related_arts.append(a)
            for s in self.repo.get_cultural_stories(state=exp.state):
                related_stories.append(s)

        # ---------------------------------------------------------
        # Case 6: Primary record is CULTURAL STORY
        # ---------------------------------------------------------
        elif actual_type == "story":
            story: CulturalStory = entity
            if story.associated_place_id:
                p = self.repo.get_heritage_place_by_id(story.associated_place_id)
                if p:
                    related_places.append(p)
            for f in self.repo.get_festivals(state=story.state):
                related_festivals.append(f)
            for a in self.repo.get_arts_crafts(state=story.state):
                related_arts.append(a)
            for part in self.repo.get_performing_arts(state=story.state):
                related_performing_arts.append(part)

        return RelatedHeritageResponse(
            primary_record_id=record_id,
            primary_record_type=actual_type,
            primary_record_name=record_name,
            related_places=related_places[:6],
            related_festivals=related_festivals[:6],
            related_arts=related_arts[:6],
            related_performing_arts=related_performing_arts[:6],
            related_experiences=related_experiences[:6],
            related_stories=related_stories[:6],
            source_references=source_refs
        )

relationship_service = RelationshipService()
