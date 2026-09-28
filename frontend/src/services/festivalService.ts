/**
 * VIRASAT Festival Service (Frontend)
 * Direct access to the 363-festival master database and festival endpoints.
 */

export interface MasterFestival {
  id: string;
  name: string;
  alternate_names: string[];
  category: string;
  religious_or_cultural_association: string;
  short_description: string;
  historical_background: string;
  origin_and_traditional_stories: string;
  why_celebrated: string;
  cultural_and_spiritual_significance: string;
  historical_significance: string;
  important_rituals: string[];
  how_people_celebrate: string;
  traditional_food_and_sweets: string[];
  traditional_clothing: string;
  music_dance_performances: string;
  important_symbols_and_decorations: string[];
  typical_duration: string;
  calendar_system: string;
  date_calculation_rule: string;
  usual_month: string;
  date_type: string;
  date_rule: string;
  date_2026: string;
  date_2027: string;
  date_source: string;
  date_last_verified: string;
  major_states: string[];
  major_cities: string[];
  famous_venues: string[];
  best_time_to_visit: string;
  recommended_duration_days: number;
  tourist_experience: string;
  local_transportation: string;
  accommodation_considerations: string;
  crowd_and_safety: string;
  visitor_etiquette: string;
  accessibility_considerations: string;
  official_website: string;
  sources: string[];
  last_verified_date: string;
  data_confidence_status: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const festivalService = {
  /**
   * Fetch all festivals with optional filters
   */
  async getFestivals(filters?: {
    state?: string;
    category?: string;
    month?: string;
    search?: string;
  }): Promise<MasterFestival[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.state) params.append('state', filters.state);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.month) params.append('month', filters.month);
      if (filters?.search) params.append('search', filters.search);

      const qs = params.toString();
      const res = await fetch(`${API_BASE_URL}/festivals${qs ? `?${qs}` : ''}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API fetch failed, falling back to static data if available', e);
    }
    return [];
  },

  /**
   * Fetch a single festival by ID or slug
   */
  async getFestivalById(id: string): Promise<MasterFestival | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/festivals/${encodeURIComponent(id)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error(`Failed to fetch festival ${id}:`, e);
    }
    return null;
  }
};
