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
# AI Cultural Companion Schemas
# -------------------------------------------------------------
class UserMemory(BaseModel):
    home_city: Optional[str] = None
    preferred_language: Optional[str] = "en"
    budget_tier: Optional[str] = None  # budget, moderate, luxury
    budget_amount_inr: Optional[int] = None
    travel_style: Optional[str] = None  # solo, family, couple, friends, senior
    interests: List[str] = Field(default_factory=list)  # temples, forts, crafts, food, nature, festivals
    dietary_pref: Optional[str] = None  # vegetarian, vegan, non-veg, jain
    consent_personalized: bool = True

class TravelModeEstimate(BaseModel):
    mode: str  # train, flight, bus, drive
    title: str
    duration_hours: float
    duration_formatted: str
    estimated_fare_inr: str
    operational_details: str
    is_recommended: bool = False

class RouteCardData(BaseModel):
    origin: str
    destination: str
    distance_km: int
    driving_time_formatted: str
    modes: List[TravelModeEstimate] = Field(default_factory=list)
    highway_route: Optional[str] = None
    travel_tips: List[str] = Field(default_factory=list)
    disclaimer: str = "Estimates based on national highway and rail network averages. Live bookings, schedules, and exact fares should be verified directly via IRCTC or official carriers."

class PlaceCardData(BaseModel):
    id: str
    name: str
    type: str  # heritage, craft, festival, experience, city
    state: str
    district: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    action_label: Optional[str] = "Explore"

class UIAction(BaseModel):
    action: str  # NAVIGATE, SHOW_ON_MAP, OPEN_ITINERARY, FILTER_CRAFTS, FILTER_FESTIVALS, EXPLORE_RELATED
    path: Optional[str] = None
    params: Dict[str, Any] = Field(default_factory=dict)
    label: str

class ChatMessage(BaseModel):
    role: str  # user or assistant or system
    content: str
    suggested_follow_ups: Optional[List[str]] = None

class AIChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = Field(default_factory=list)
    preferred_language: Optional[str] = "en"  # en, hi, hinglish
    context_record_id: Optional[str] = None
    context_record_type: Optional[str] = None
    user_memory: Optional[Dict[str, Any]] = None
    active_itinerary: Optional[Dict[str, Any]] = None
    user_coordinates: Optional[Coordinates] = None

class AIChatResponse(BaseModel):
    response: str
    grounded_in_database: bool
    retrieved_records: List[Dict[str, Any]] = Field(default_factory=list)
    source_references: List[str] = Field(default_factory=list)
    suggested_follow_ups: List[str] = Field(default_factory=list)
    language_detected: str = "en"
    intent_detected: Optional[str] = None
    actions: List[UIAction] = Field(default_factory=list)
    route_card: Optional[RouteCardData] = None
    places_cards: List[PlaceCardData] = Field(default_factory=list)
    itinerary_card: Optional[Dict[str, Any]] = None
    memory_updates: Optional[Dict[str, Any]] = None

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
