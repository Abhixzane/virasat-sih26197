/**
 * VIRASAT Festival Search Service (TypeScript)
 * Fast in-memory multi-attribute search and scoring for 363 festivals.
 */

import { festivalKnowledgeService, FestivalRecord } from './festivalKnowledgeService';

export interface SearchOptions {
  query?: string;
  state?: string;
  category?: string;
  month?: string;
  date_type?: string;
  limit?: number;
}

export class FestivalSearchService {
  public search(options: SearchOptions): FestivalRecord[] {
    const { query, state, category, month, date_type, limit = 25 } = options;
    const all = festivalKnowledgeService.getAllFestivals();

    const qClean = query?.toLowerCase().trim() || '';
    const stateClean = state?.toLowerCase().trim() || '';
    const catClean = category?.toUpperCase().replace(/\s+/g, '_') || '';
    const monthClean = month?.toLowerCase().trim() || '';
    const dtypeClean = date_type?.toUpperCase().trim() || '';

    const scored: { score: number; festival: FestivalRecord }[] = [];

    for (const f of all) {
      if (stateClean) {
        const matches = (f.major_states || []).some(s => s.toLowerCase().includes(stateClean));
        if (!matches) continue;
      }

      if (catClean && f.category.toUpperCase() !== catClean) {
        continue;
      }

      if (monthClean && !f.usual_month.toLowerCase().includes(monthClean)) {
        continue;
      }

      if (dtypeClean && f.date_type.toUpperCase() !== dtypeClean) {
        continue;
      }

      if (!qClean) {
        scored.push({ score: 1, festival: f });
        continue;
      }

      let score = 0;
      const name = f.name.toLowerCase();
      const alts = (f.alternate_names || []).map(a => a.toLowerCase());
      const cities = (f.major_cities || []).map(c => c.toLowerCase());
      const desc = f.short_description.toLowerCase();

      if (name === qClean) score += 100;
      else if (name.startsWith(qClean)) score += 50;
      else if (name.includes(qClean)) score += 30;

      for (const a of alts) {
        if (a === qClean) score += 80;
        else if (a.includes(qClean)) score += 25;
      }

      for (const c of cities) {
        if (c.includes(qClean)) score += 20;
      }

      if (desc.includes(qClean)) score += 10;

      if (score > 0) {
        scored.push({ score, festival: f });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.festival);
  }
}

export const festivalSearchService = new FestivalSearchService();
