from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

# -------------------------------------------------------------
# Base Coordinates & Generic Models
# -------------------------------------------------------------
class Coordinates(BaseModel):
    lat: float
    lng: float

# -------------------------------------------------------------
# Collection A: States and Cities
# -------------------------------------------------------------
class StateCity(BaseModel):
    id: str
    name: str
    state: str
    region: str
    type: Optional[str] = "city"  # state or city
    description: str
    coordinates: Coordinates
    image_url: str

# -------------------------------------------------------------
# Collection B: Heritage Places
# -------------------------------------------------------------
class HeritagePlace(BaseModel):
    id: str
    name: str
    state: str
    city: str
    category: str
    historical_period: str
    description: str
    historical_significance: str
    architectural_style: str
    latitude: float
    longitude: float
    image_url: str
    image_attribution: Optional[str] = None
    license: Optional[str] = None
    source_url: str
    verification_status: str = "VERIFIED"
    entry_fee: Optional[str] = None
    opening_hours: Optional[str] = None

# -------------------------------------------------------------
# Collection C: Festivals and Traditions
# -------------------------------------------------------------
class Festival(BaseModel):
    id: str
    name: str
    state: str
    region: str
    category: str
    description: str
    historical_background: str
    cultural_significance: str
    celebration_details: str
    associated_communities: str
    month_or_season: str
    associated_place_ids: List[str] = Field(default_factory=list)
    related_tradition_ids: List[str] = Field(default_factory=list)
    image_url: str
    image_attribution: Optional[str] = None
    license: Optional[str] = None
    source_url: str
    verification_status: str = "VERIFIED"

# -------------------------------------------------------------
# Collection D: Arts, Crafts and Artisans
# -------------------------------------------------------------
class ArtCraft(BaseModel):
    id: str
    name: str
    state: str
    origin: str
    craft_category: str
    description: str
    materials_used: str
    production_technique: str
    cultural_significance: str
    artisan_name: str
    artisan_location: str
    gi_status: bool = False
    image_url: str
    image_attribution: Optional[str] = None
    license: Optional[str] = None
    source_url: str
    verification_status: str = "VERIFIED"

# -------------------------------------------------------------
# Collection E: Folk and Performing Arts
# -------------------------------------------------------------
class PerformingArt(BaseModel):
    id: str
    name: str
    state: str
    category: str
    origin: str
    description: str
    performance_style: str
    instruments: List[str] = Field(default_factory=list)
    cultural_significance: str
    image_url: str
    image_attribution: Optional[str] = None
    license: Optional[str] = None
    source_url: str
    verification_status: str = "VERIFIED"

# -------------------------------------------------------------
# Collection F: Cultural Experiences
# -------------------------------------------------------------
class CulturalExperience(BaseModel):
    id: str
    name: str
    state: str
    city: str
    category: str
    description: str
    cultural_significance: str
    associated_place_id: str
    duration: str
    latitude: float
    longitude: float
    image_url: str
    image_attribution: Optional[str] = None
    license: Optional[str] = None
    source_url: str
    verification_status: str = "VERIFIED"
    entry_fee: Optional[str] = None
    opening_hours: Optional[str] = None

# -------------------------------------------------------------
# Collection G: Cultural Stories
# -------------------------------------------------------------
class CulturalStory(BaseModel):
    id: str
    title: str
    state: str
    region: str
    story_category: str
    narrative: str
    cultural_context: Optional[str] = None
    cultural_significance: Optional[str] = None
    associated_place_id: str
    source_url: str
    verification_status: str = "VERIFIED"

# -------------------------------------------------------------
# Connected Cultural Intelligence Relationships Model
# -------------------------------------------------------------
class RelatedHeritageResponse(BaseModel):
    primary_record_id: str
    primary_record_type: str
    primary_record_name: str
    related_places: List[HeritagePlace] = Field(default_factory=list)
    related_festivals: List[Festival] = Field(default_factory=list)
    related_arts: List[ArtCraft] = Field(default_factory=list)
    related_performing_arts: List[PerformingArt] = Field(default_factory=list)
    related_experiences: List[CulturalExperience] = Field(default_factory=list)
    related_stories: List[CulturalStory] = Field(default_factory=list)
    source_references: List[str] = Field(default_factory=list)

# -------------------------------------------------------------
# Search Result Item and Grouped Response
# -------------------------------------------------------------
class SearchResultItem(BaseModel):
    id: str
    name: str
    type: str  # heritage, festival, art_craft, performing_art, experience, story, city, state
    state: str
    category: str
    description: str
    image_url: str
    score: float = 1.0
    verification_status: str = "VERIFIED"

class SearchResponse(BaseModel):
    query: str
    total_matches: int
    grouped_results: Dict[str, List[SearchResultItem]]
    flat_results: List[SearchResultItem]

# -------------------------------------------------------------
# Map Locations Model
# -------------------------------------------------------------
class MapMarker(BaseModel):
    id: str
    name: str
    type: str  # heritage or experience
    category: str
    state: str
    city: str
    latitude: float
    longitude: float
    description: str
    image_url: str
    verification_status: str

# -------------------------------------------------------------
# AI Cultural Guide Chat Request & Response
# -------------------------------------------------------------
class ChatMessage(BaseModel):
    role: str  # user or assistant or system
    content: str

class AIChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = Field(default_factory=list)
    preferred_language: Optional[str] = "en"  # en, hi, hinglish
    context_record_id: Optional[str] = None
    context_record_type: Optional[str] = None

class AIChatResponse(BaseModel):
    response: str
    grounded_in_database: bool
    retrieved_records: List[Dict[str, Any]] = Field(default_factory=list)
    source_references: List[str] = Field(default_factory=list)
    suggested_follow_ups: List[str] = Field(default_factory=list)
    language_detected: str = "en"

# -------------------------------------------------------------
# Cultural Itinerary Request & Response
# -------------------------------------------------------------
class ItineraryDay(BaseModel):
    day_number: int
    theme: str
    heritage_places: List[HeritagePlace]
    cultural_experiences: List[CulturalExperience]
    cultural_explanation: str
    associated_traditions: List[str] = Field(default_factory=list)

class ItineraryRequest(BaseModel):
    state_or_destination: str
    days: int = Field(default=3, ge=1, le=14)
    cultural_interests: List[str] = Field(default_factory=list)
    preferred_categories: List[str] = Field(default_factory=list)

class ItineraryResponse(BaseModel):
    destination: str
    duration_days: int
    itinerary_title: str
    overview: str
    days: List[ItineraryDay]
    verified_map_coordinates: List[Coordinates]
