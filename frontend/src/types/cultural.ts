export interface Coordinates {
  lat: number;
  lng: number;
}

export interface StateCity {
  id: string;
  name: string;
  state: string;
  region: string;
  type?: 'state' | 'city';
  description: string;
  coordinates: Coordinates;
  image_url: string;
}

export interface HeritagePlace {
  id: string;
  name: string;
  state: string;
  city: string;
  category: string;
  historical_period: string;
  description: string;
  historical_significance: string;
  architectural_style: string;
  latitude: number;
  longitude: number;
  image_url: string;
  source_url: string;
  verification_status: string;
}

export interface Festival {
  id: string;
  name: string;
  state: string;
  region: string;
  category: string;
  description: string;
  historical_background: string;
  cultural_significance: string;
  celebration_details: string;
  associated_communities: string;
  month_or_season: string;
  associated_place_ids: string[];
  related_tradition_ids: string[];
  image_url: string;
  source_url: string;
  verification_status: string;
}

export interface ArtCraft {
  id: string;
  name: string;
  state: string;
  origin: string;
  craft_category: string;
  description: string;
  materials_used: string;
  production_technique: string;
  cultural_significance: string;
  artisan_name: string;
  artisan_location: string;
  gi_status: boolean;
  image_url: string;
  source_url: string;
  verification_status: string;
}

export interface PerformingArt {
  id: string;
  name: string;
  state: string;
  category: string;
  origin: string;
  description: string;
  performance_style: string;
  instruments: string[];
  cultural_significance: string;
  image_url: string;
  source_url: string;
  verification_status: string;
}

export interface CulturalExperience {
  id: string;
  name: string;
  state: string;
  city: string;
  category: string;
  description: string;
  cultural_significance: string;
  associated_place_id: string;
  duration: string;
  latitude: number;
  longitude: number;
  image_url: string;
  source_url: string;
  verification_status: string;
}

export interface CulturalStory {
  id: string;
  title: string;
  state: string;
  region: string;
  story_category: string;
  narrative: string;
  cultural_context?: string;
  cultural_significance?: string;
  associated_place_id: string;
  source_url: string;
  verification_status: string;
}

export interface RelatedHeritageResponse {
  primary_record_id: string;
  primary_record_type: string;
  primary_record_name: string;
  related_places: HeritagePlace[];
  related_festivals: Festival[];
  related_arts: ArtCraft[];
  related_performing_arts: PerformingArt[];
  related_experiences: CulturalExperience[];
  related_stories: CulturalStory[];
  source_references: string[];
}

export interface SearchResultItem {
  id: string;
  name: string;
  type: string;
  state: string;
  category: string;
  description: string;
  image_url: string;
  score: number;
  verification_status: string;
}

export interface SearchResponse {
  query: string;
  total_matches: number;
  grouped_results: {
    heritage: SearchResultItem[];
    festival: SearchResultItem[];
    art_craft: SearchResultItem[];
    performing_art: SearchResultItem[];
    experience: SearchResultItem[];
    story: SearchResultItem[];
    state_city: SearchResultItem[];
  };
  flat_results: SearchResultItem[];
}

export interface MapMarker {
  id: string;
  name: string;
  type: string;
  category: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  description: string;
  image_url: string;
  verification_status: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  retrieved_records?: any[];
  source_references?: string[];
  suggested_follow_ups?: string[];
}

export interface AIChatResponse {
  response: string;
  grounded_in_database: boolean;
  retrieved_records: Array<{
    id: string;
    name: string;
    type: string;
    state: string;
  }>;
  source_references: string[];
  suggested_follow_ups: string[];
  language_detected: string;
}

export interface ItineraryDay {
  day_number: number;
  theme: string;
  heritage_places: HeritagePlace[];
  cultural_experiences: CulturalExperience[];
  cultural_explanation: string;
  associated_traditions: string[];
}

export interface ItineraryResponse {
  destination: string;
  duration_days: number;
  itinerary_title: string;
  overview: string;
  days: ItineraryDay[];
  verified_map_coordinates: Coordinates[];
}
