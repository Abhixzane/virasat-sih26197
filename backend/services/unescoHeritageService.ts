/**
 * VIRASAT UNESCO World Heritage Service (TypeScript)
 * Access and search across all 42 officially inscribed World Heritage properties in India.
 */

import * as fs from 'fs';
import * as path from 'path';

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
  major_attractions: string[];
  visitor_experience: string;
  best_time_to_visit: string;
  recommended_visit_duration: string;
  nearest_railway_station: string;
  nearest_airport: string;
  latitude: number;
  longitude: number;
  official_unesco_url: string;
  data_verification_status: string;
}

export class UnescoHeritageService {
  private properties: UnescoProperty[] = [];
  private byId: Map<string, UnescoProperty> = new Map();

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    try {
      const candidates = [
        path.resolve(__dirname, '../data/heritage/unesco_world_heritage.json'),
        path.resolve(__dirname, '../../data/heritage/unesco_world_heritage.json'),
        path.resolve(process.cwd(), 'data/heritage/unesco_world_heritage.json'),
        path.resolve(process.cwd(), 'backend/data/heritage/unesco_world_heritage.json')
      ];

      let raw = '';
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          raw = fs.readFileSync(p, 'utf-8');
          break;
        }
      }

      if (!raw) return;
      const parsed = JSON.parse(raw);
      this.properties = parsed.properties || parsed;

      for (const prop of this.properties) {
        this.byId.set(prop.id, prop);
      }
    } catch (err) {
      console.error('[UnescoHeritageService] Error loading data:', err);
    }
  }

  public getAllProperties(): UnescoProperty[] {
    return this.properties;
  }

  public getPropertyById(id: string): UnescoProperty | undefined {
    return this.byId.get(id);
  }

  public getPropertiesByCategory(category: string): UnescoProperty[] {
    const cLower = category.toLowerCase().trim();
    return this.properties.filter(p => p.category.toLowerCase() === cLower);
  }

  public getPropertiesByState(state: string): UnescoProperty[] {
    const sLower = state.toLowerCase().trim();
    return this.properties.filter(p => p.state.toLowerCase().includes(sLower));
  }

  public searchProperties(query: string): UnescoProperty[] {
    const qLower = query.toLowerCase().trim();
    return this.properties.filter(p =>
      p.official_unesco_name.toLowerCase().includes(qLower) ||
      p.state.toLowerCase().includes(qLower) ||
      (p.alternate_names || []).some(a => a.toLowerCase().includes(qLower)) ||
      (p.major_attractions || []).some(m => m.toLowerCase().includes(qLower))
    );
  }
}

export const unescoHeritageService = new UnescoHeritageService();
