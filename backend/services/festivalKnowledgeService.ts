/**
 * VIRASAT Festival Knowledge Service (TypeScript)
 * Interface and retrieval service for 363 authentic Indian festivals.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface FestivalRecord {
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
  date_type: 'FIXED' | 'LUNAR' | 'LUNISOLAR' | 'SOLAR' | 'SEASONAL' | 'ORGANIZER_ANNOUNCED' | 'COMMUNITY_SPECIFIC';
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

export class FestivalKnowledgeService {
  private festivals: FestivalRecord[] = [];
  private byId: Map<string, FestivalRecord> = new Map();
  private byState: Map<string, FestivalRecord[]> = new Map();
  private byCategory: Map<string, FestivalRecord[]> = new Map();

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    try {
      const possiblePaths = [
        path.resolve(__dirname, '../data/festivals/india_festivals_master.json'),
        path.resolve(__dirname, '../../data/festivals/india_festivals_master.json'),
        path.resolve(process.cwd(), 'data/festivals/india_festivals_master.json'),
        path.resolve(process.cwd(), 'backend/data/festivals/india_festivals_master.json')
      ];

      let rawData = '';
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          rawData = fs.readFileSync(p, 'utf-8');
          break;
        }
      }

      if (!rawData) {
        console.warn('[FestivalKnowledgeService] Master JSON not found.');
        return;
      }

      const parsed = JSON.parse(rawData);
      this.festivals = Array.isArray(parsed) ? parsed : (parsed.festivals || []);

      for (const f of this.festivals) {
        this.byId.set(f.id, f);

        const cat = f.category || 'OTHER';
        if (!this.byCategory.has(cat)) {
          this.byCategory.set(cat, []);
        }
        this.byCategory.get(cat)!.push(f);

        for (const st of f.major_states || []) {
          const s = st.trim();
          if (!this.byState.has(s)) {
            this.byState.set(s, []);
          }
          this.byState.get(s)!.push(f);
        }
      }
    } catch (err) {
      console.error('[FestivalKnowledgeService] Error loading data:', err);
    }
  }

  public getAllFestivals(): FestivalRecord[] {
    return this.festivals;
  }

  public getFestivalById(id: string): FestivalRecord | undefined {
    return this.byId.get(id);
  }

  public getFestivalsByState(state: string): FestivalRecord[] {
    const sLower = state.toLowerCase().trim();
    const res: FestivalRecord[] = [];
    for (const [stName, list] of this.byState.entries()) {
      if (stName.toLowerCase().includes(sLower)) {
        res.push(...list);
      }
    }
    const seen = new Set<string>();
    return res.filter(f => {
      if (seen.has(f.id)) return false;
      seen.add(f.id);
      return true;
    });
  }

  public getFestivalsByCategory(category: string): FestivalRecord[] {
    return this.byCategory.get(category) || [];
  }

  public getStats() {
    return {
      total: this.festivals.length,
      categoriesCount: this.byCategory.size,
      statesCount: this.byState.size
    };
  }
}

export const festivalKnowledgeService = new FestivalKnowledgeService();
