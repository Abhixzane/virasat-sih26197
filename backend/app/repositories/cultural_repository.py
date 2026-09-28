import json
import os
import threading
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.core.logging import logger
from app.models.schemas import (
    StateCity, HeritagePlace, Festival, ArtCraft,
    PerformingArt, CulturalExperience, CulturalStory
)

class CulturalRepository:
    """
    Centralized Cultural Data Repository.
    Acts as the single source of truth for all frontend views, universal search,
    relationship discovery, AI retrieval, and map layers.
    """
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, data_path: Optional[str] = None):
        if hasattr(self, "_initialized") and self._initialized:
            return
        self.data_path = data_path or settings.DATA_PATH
        self._db_lock = threading.Lock()
        self.raw_data: Dict[str, Any] = {}
        self.states_and_cities: List[StateCity] = []
        self.heritage_places: List[HeritagePlace] = []
        self.festivals: List[Festival] = []
        self.arts_crafts: List[ArtCraft] = []
        self.performing_arts: List[PerformingArt] = []
        self.experiences: List[CulturalExperience] = []
        self.stories: List[CulturalStory] = []

        # Fast lookup indexes
        self.by_id: Dict[str, Any] = {}
        self._initialized = True
        self.reload()

    def reload(self):
        """Loads or reloads data from the centralized database JSON."""
        with self._db_lock:
            if not os.path.exists(self.data_path):
                logger.error(f"Central cultural database file not found at: {self.data_path}")
                return

            try:
                with open(self.data_path, "r", encoding="utf-8") as f:
                    self.raw_data = json.load(f)

                self.states_and_cities = [
                    StateCity(**item) for item in self.raw_data.get("states_and_cities", [])
                ]
                self.heritage_places = [
                    HeritagePlace(**item) for item in self.raw_data.get("heritage_places", [])
                ]
                self.festivals = [
                    Festival(**item) for item in self.raw_data.get("festivals_and_traditions", [])
                ]
                self.arts_crafts = [
                    ArtCraft(**item) for item in self.raw_data.get("arts_crafts_and_artisans", [])
                ]
                self.performing_arts = [
                    PerformingArt(**item) for item in self.raw_data.get("folk_and_performing_arts", [])
                ]
                self.experiences = [
                    CulturalExperience(**item) for item in self.raw_data.get("cultural_experiences", [])
                ]
                self.stories = [
                    CulturalStory(**item) for item in self.raw_data.get("cultural_stories", [])
                ]

                # Rebuild fast index
                self.by_id.clear()
                for item in self.states_and_cities:
                    self.by_id[item.id] = ("state_city", item)
                for item in self.heritage_places:
                    self.by_id[item.id] = ("heritage", item)
                for item in self.festivals:
                    self.by_id[item.id] = ("festival", item)
                for item in self.arts_crafts:
                    self.by_id[item.id] = ("art_craft", item)
                for item in self.performing_arts:
                    self.by_id[item.id] = ("performing_art", item)
                for item in self.experiences:
                    self.by_id[item.id] = ("experience", item)
                for item in self.stories:
                    self.by_id[item.id] = ("story", item)

                logger.info(
                    f"Centralized Cultural Repository loaded {len(self.by_id)} total records. "
                    f"Places: {len(self.heritage_places)}, Festivals: {len(self.festivals)}, "
                    f"Crafts: {len(self.arts_crafts)}, Arts: {len(self.performing_arts)}"
                )
            except Exception as e:
                logger.error(f"Error loading centralized cultural database: {e}", exc_info=True)

    def save_to_disk(self):
        """Persists the current state back to disk to preserve synchronization."""
        with self._db_lock:
            data_to_write = {
                "metadata": self.raw_data.get("metadata", {}),
                "states_and_cities": [item.model_dump() for item in self.states_and_cities],
                "heritage_places": [item.model_dump() for item in self.heritage_places],
                "festivals_and_traditions": [item.model_dump() for item in self.festivals],
                "arts_crafts_and_artisans": [item.model_dump() for item in self.arts_crafts],
                "folk_and_performing_arts": [item.model_dump() for item in self.performing_arts],
                "cultural_experiences": [item.model_dump() for item in self.experiences],
                "cultural_stories": [item.model_dump() for item in self.stories]
            }
            with open(self.data_path, "w", encoding="utf-8") as f:
                json.dump(data_to_write, f, indent=2, ensure_ascii=False)
            logger.info("Persisted updated cultural database to disk.")

    # -------------------------------------------------------------
    # Getters
    # -------------------------------------------------------------
    def get_states(self) -> List[StateCity]:
        return [s for s in self.states_and_cities if getattr(s, "type", "city") == "state"]

    def get_cities(self, state: Optional[str] = None) -> List[StateCity]:
        cities = [c for c in self.states_and_cities if getattr(c, "type", "city") == "city"]
        if state:
            state_lower = state.strip().lower()
            cities = [c for c in cities if c.state.lower() == state_lower]
        return cities

    def get_heritage_places(self, state: Optional[str] = None, city: Optional[str] = None) -> List[HeritagePlace]:
        places = self.heritage_places
        if state:
            places = [p for p in places if p.state.lower() == state.strip().lower()]
        if city:
            places = [p for p in places if p.city.lower() == city.strip().lower()]
        return places

    def get_heritage_place_by_id(self, place_id: str) -> Optional[HeritagePlace]:
        res = self.by_id.get(place_id)
        if res and res[0] == "heritage":
            return res[1]
        # fallback search
        for p in self.heritage_places:
            if p.id == place_id or place_id in p.name.lower().replace(" ", "-"):
                return p
        # Check UNESCO Master Database
        try:
            from app.services.heritage.unesco_heritage_service import unesco_heritage_service
            up = unesco_heritage_service.get_property_by_id(place_id)
            if up:
                return HeritagePlace(
                    id=up.get("id"),
                    name=up.get("official_unesco_name"),
                    state=up.get("state"),
                    city=up.get("city_or_nearest_settlement", up.get("state")),
                    category=f"UNESCO {up.get('category')} Heritage",
                    historical_period=str(up.get("inscription_year")),
                    description=up.get("historical_background", ""),
                    historical_significance=up.get("cultural_importance", ""),
                    architectural_style=up.get("architectural_or_ecological_significance", ""),
                    latitude=float(up.get("latitude", 0.0)),
                    longitude=float(up.get("longitude", 0.0)),
                    image_url=f"/assets/heritage/{up.get('id')}.jpg",
                    source_url=up.get("official_unesco_url", "https://whc.unesco.org"),
                    verification_status="VERIFIED"
                )
        except Exception:
            pass
        return None

    def get_festivals(self, state: Optional[str] = None) -> List[Festival]:
        festivals = self.festivals
        if state:
            festivals = [f for f in festivals if f.state.lower() == state.strip().lower()]
        return festivals

    def get_festival_by_id(self, festival_id: str) -> Optional[Festival]:
        res = self.by_id.get(festival_id)
        if res and res[0] == "festival":
            return res[1]
        for f in self.festivals:
            if f.id == festival_id:
                return f
        # Check Master Festivals Database
        try:
            from app.services.festivals.festival_knowledge_service import festival_knowledge_service
            mf = festival_knowledge_service.get_festival_by_id(festival_id)
            if mf:
                return Festival(
                    id=mf.get("id"),
                    name=mf.get("name"),
                    state=mf.get("major_states", ["India"])[0],
                    region="Pan-India" if "All" in str(mf.get("major_states")) else "Regional",
                    category=mf.get("category", "Cultural"),
                    description=mf.get("short_description", ""),
                    historical_background=mf.get("historical_background", ""),
                    cultural_significance=mf.get("cultural_and_spiritual_significance", ""),
                    celebration_details=mf.get("how_people_celebrate", ""),
                    associated_communities=mf.get("religious_or_cultural_association", "Local Community"),
                    month_or_season=mf.get("usual_month", "Annual"),
                    image_url=f"/assets/festivals/{mf.get('id')}.jpg",
                    source_url=mf.get("official_website", "https://www.incredibleindia.gov.in"),
                    verification_status="VERIFIED"
                )
        except Exception:
            pass
        return None

    def get_arts_crafts(self, state: Optional[str] = None) -> List[ArtCraft]:
        arts = self.arts_crafts
        if state:
            arts = [a for a in arts if a.state.lower() == state.strip().lower()]
        return arts

    def get_art_craft_by_id(self, art_id: str) -> Optional[ArtCraft]:
        res = self.by_id.get(art_id)
        if res and res[0] == "art_craft":
            return res[1]
        for a in self.arts_crafts:
            if a.id == art_id:
                return a
        return None

    def get_performing_arts(self, state: Optional[str] = None) -> List[PerformingArt]:
        arts = self.performing_arts
        if state:
            arts = [a for a in arts if a.state.lower() == state.strip().lower()]
        return arts

    def get_performing_art_by_id(self, art_id: str) -> Optional[PerformingArt]:
        res = self.by_id.get(art_id)
        if res and res[0] == "performing_art":
            return res[1]
        for a in self.performing_arts:
            if a.id == art_id:
                return a
        return None

    def get_cultural_experiences(self, state: Optional[str] = None, city: Optional[str] = None) -> List[CulturalExperience]:
        exps = self.experiences
        if state:
            exps = [e for e in exps if e.state.lower() == state.strip().lower()]
        if city:
            exps = [e for e in exps if e.city.lower() == city.strip().lower()]
        return exps

    def get_cultural_experience_by_id(self, exp_id: str) -> Optional[CulturalExperience]:
        res = self.by_id.get(exp_id)
        if res and res[0] == "experience":
            return res[1]
        for e in self.experiences:
            if e.id == exp_id:
                return e
        return None

    def get_cultural_stories(self, state: Optional[str] = None) -> List[CulturalStory]:
        stories = self.stories
        if state:
            stories = [s for s in stories if s.state.lower() == state.strip().lower()]
        return stories

    def get_cultural_story_by_id(self, story_id: str) -> Optional[CulturalStory]:
        res = self.by_id.get(story_id)
        if res and res[0] == "story":
            return res[1]
        for s in self.stories:
            if s.id == story_id:
                return s
        return None

    def get_record_by_any_id(self, record_id: str) -> Optional[tuple[str, Any]]:
        return self.by_id.get(record_id)

    # -------------------------------------------------------------
    # Synchronization & Update Methods
    # -------------------------------------------------------------
    def update_record(self, record_type: str, record_id: str, updated_fields: Dict[str, Any]) -> bool:
        """
        Updates a record in memory and persists to disk.
        All subsequent queries, search, AI responses, and relationships immediately reflect the updated record.
        """
        found = False
        if record_type in ["heritage", "heritage_places"]:
            for idx, item in enumerate(self.heritage_places):
                if item.id == record_id:
                    new_dict = item.model_dump()
                    new_dict.update(updated_fields)
                    self.heritage_places[idx] = HeritagePlace(**new_dict)
                    self.by_id[record_id] = ("heritage", self.heritage_places[idx])
                    found = True
                    break
        elif record_type in ["festival", "festivals"]:
            for idx, item in enumerate(self.festivals):
                if item.id == record_id:
                    new_dict = item.model_dump()
                    new_dict.update(updated_fields)
                    self.festivals[idx] = Festival(**new_dict)
                    self.by_id[record_id] = ("festival", self.festivals[idx])
                    found = True
                    break
        elif record_type in ["art_craft", "arts_crafts"]:
            for idx, item in enumerate(self.arts_crafts):
                if item.id == record_id:
                    new_dict = item.model_dump()
                    new_dict.update(updated_fields)
                    self.arts_crafts[idx] = ArtCraft(**new_dict)
                    self.by_id[record_id] = ("art_craft", self.arts_crafts[idx])
                    found = True
                    break
        elif record_type in ["performing_art", "performing_arts"]:
            for idx, item in enumerate(self.performing_arts):
                if item.id == record_id:
                    new_dict = item.model_dump()
                    new_dict.update(updated_fields)
                    self.performing_arts[idx] = PerformingArt(**new_dict)
                    self.by_id[record_id] = ("performing_art", self.performing_arts[idx])
                    found = True
                    break
        elif record_type in ["experience", "experiences"]:
            for idx, item in enumerate(self.experiences):
                if item.id == record_id:
                    new_dict = item.model_dump()
                    new_dict.update(updated_fields)
                    self.experiences[idx] = CulturalExperience(**new_dict)
                    self.by_id[record_id] = ("experience", self.experiences[idx])
                    found = True
                    break
        elif record_type in ["story", "stories"]:
            for idx, item in enumerate(self.stories):
                if item.id == record_id:
                    new_dict = item.model_dump()
                    new_dict.update(updated_fields)
                    self.stories[idx] = CulturalStory(**new_dict)
                    self.by_id[record_id] = ("story", self.stories[idx])
                    found = True
                    break

        if found:
            self.save_to_disk()
            return True
        return False

# Global repository instance
cultural_repository = CulturalRepository()
