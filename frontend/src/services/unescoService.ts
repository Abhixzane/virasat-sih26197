/**
 * VIRASAT UNESCO World Heritage Service (Frontend)
 * Direct access to all 42 UNESCO World Heritage properties in India.
 */

export interface UnescoProperty {
  id: string;
  official_unesco_name: string;
  alternate_names: string[];
  category: 'Cultural' | 'Natural' | 'Mixed';
  state: string;
  district: string;
  city_or_nearest_settlement: string;
  inscription_year: number;
  unesco_criteria: string[];
  historical_background: string;
  architectural_or_ecological_significance: string;
  cultural_importance: string;
  historical_events_stories?: string;
  major_attractions: string[];
  visitor_experience: string;
  best_time_to_visit: string;
  recommended_visit_duration: string;
  nearest_railway_station: string;
  nearest_airport: string;
  nearby_cities?: string[];
  nearby_heritage_destinations?: string[];
  nearby_hotels_areas?: string[];
  local_cuisine?: string[];
  transportation_information?: string;
  latitude: number;
  longitude: number;
  official_unesco_url: string;
  official_tourism_url?: string;
  data_verification_status: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const unescoService = {
  /**
   * Fetch all 42 UNESCO World Heritage properties with optional category or state filters
   */
  async getProperties(filters?: {
    category?: string;
    state?: string;
    search?: string;
  }): Promise<UnescoProperty[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.state) params.append('state', filters.state);
      if (filters?.search) params.append('search', filters.search);

      const qs = params.toString();
      const res = await fetch(`${API_BASE_URL}/heritage/unesco${qs ? `?${qs}` : ''}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API fetch failed, falling back to static data if available', e);
    }
    return [];
  },

  /**
   * Fetch a single UNESCO property by ID
   */
  async getPropertyById(id: string): Promise<UnescoProperty | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/heritage/unesco/${encodeURIComponent(id)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error(`Failed to fetch UNESCO property ${id}:`, e);
    }
    return null;
  }
};
