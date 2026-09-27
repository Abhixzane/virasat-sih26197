import {
  StateCity, HeritagePlace, Festival, ArtCraft,
  PerformingArt, CulturalExperience, CulturalStory,
  RelatedHeritageResponse, SearchResponse, MapMarker,
  AIChatResponse, ItineraryResponse
} from '../types/cultural';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Network error');
    throw new Error(`API Request to ${endpoint} failed (${res.status}): ${errorText}`);
  }

  return res.json();
}

export const api = {
  // Health
  getHealth: () => fetchJSON<{ status: string; database_records_loaded: number }>('/health'),

  // States & Cities
  getStates: () => fetchJSON<StateCity[]>('/states'),
  getCities: (state?: string) => fetchJSON<StateCity[]>(`/cities${state ? `?state=${encodeURIComponent(state)}` : ''}`),

  // Heritage Places
  getHeritagePlaces: (params?: { state?: string; city?: string }) => {
    const query = new URLSearchParams();
    if (params?.state) query.append('state', params.state);
    if (params?.city) query.append('city', params.city);
    const qs = query.toString();
    return fetchJSON<HeritagePlace[]>(`/heritage${qs ? `?${qs}` : ''}`);
  },
  getHeritagePlaceById: (id: string) => fetchJSON<HeritagePlace>(`/heritage/${encodeURIComponent(id)}`),

  // Festivals
  getFestivals: (state?: string) =>
    fetchJSON<Festival[]>(`/festivals${state ? `?state=${encodeURIComponent(state)}` : ''}`),
  getFestivalById: (id: string) => fetchJSON<Festival>(`/festivals/${encodeURIComponent(id)}`),

  // Arts & Crafts
  getArtsCrafts: (state?: string) =>
    fetchJSON<ArtCraft[]>(`/arts-crafts${state ? `?state=${encodeURIComponent(state)}` : ''}`),
  getArtCraftById: (id: string) => fetchJSON<ArtCraft>(`/arts-crafts/${encodeURIComponent(id)}`),

  // Performing Arts
  getPerformingArts: (state?: string) =>
    fetchJSON<PerformingArt[]>(`/performing-arts${state ? `?state=${encodeURIComponent(state)}` : ''}`),
  getPerformingArtById: (id: string) => fetchJSON<PerformingArt>(`/performing-arts/${encodeURIComponent(id)}`),

  // Experiences
  getExperiences: (params?: { state?: string; city?: string }) => {
    const query = new URLSearchParams();
    if (params?.state) query.append('state', params.state);
    if (params?.city) query.append('city', params.city);
    const qs = query.toString();
    return fetchJSON<CulturalExperience[]>(`/experiences${qs ? `?${qs}` : ''}`);
  },
  getExperienceById: (id: string) => fetchJSON<CulturalExperience>(`/experiences/${encodeURIComponent(id)}`),

  // Stories
  getStories: (state?: string) =>
    fetchJSON<CulturalStory[]>(`/stories${state ? `?state=${encodeURIComponent(state)}` : ''}`),
  getStoryById: (id: string) => fetchJSON<CulturalStory>(`/stories/${encodeURIComponent(id)}`),

  // Universal Cultural Search
  search: (query: string, options?: { category?: string; state?: string; limit?: number; offset?: number }) => {
    const p = new URLSearchParams();
    if (query) p.append('q', query);
    if (options?.category) p.append('category', options.category);
    if (options?.state) p.append('state', options.state);
    if (options?.limit) p.append('limit', options.limit.toString());
    if (options?.offset) p.append('offset', options.offset.toString());
    return fetchJSON<SearchResponse>(`/search?${p.toString()}`);
  },

  // Connected Cultural Intelligence
  getRelatedHeritage: (recordType: string, recordId: string) =>
    fetchJSON<RelatedHeritageResponse>(`/related/${encodeURIComponent(recordType)}/${encodeURIComponent(recordId)}`),

  // Map Locations
  getMapLocations: (params?: { state?: string; category?: string }) => {
    const p = new URLSearchParams();
    if (params?.state) p.append('state', params.state);
    if (params?.category) p.append('category', params.category);
    const qs = p.toString();
    return fetchJSON<MapMarker[]>(`/map/locations${qs ? `?${qs}` : ''}`);
  },

  // AI Cultural Guide Chat
  chatWithAI: (payload: {
    message: string;
    preferred_language?: string;
    context_record_id?: string;
    context_record_type?: string;
  }) =>
    fetchJSON<AIChatResponse>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Cultural Itinerary Generator
  generateItinerary: (payload: {
    state_or_destination: string;
    days: number;
    cultural_interests?: string[];
    preferred_categories?: string[];
  }) =>
    fetchJSON<ItineraryResponse>('/itinerary/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Synchronization update
  updateRecord: (recordType: string, recordId: string, updates: Record<string, any>) =>
    fetchJSON<{ status: string; updated_record: any }>(`/sync/record/${encodeURIComponent(recordType)}/${encodeURIComponent(recordId)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
};
