/**
 * VIRASAT Festival Date Service (TypeScript)
 * Handles festival date forecasting and month-based filtering.
 */

import { festivalKnowledgeService, FestivalRecord } from './festivalKnowledgeService';

export class FestivalDateService {
  public getFestivalsByMonth(month: string): FestivalRecord[] {
    const mLower = month.toLowerCase().trim();
    return festivalKnowledgeService
      .getAllFestivals()
      .filter(f => f.usual_month.toLowerCase().includes(mLower));
  }

  public getUpcomingFestivals(referenceDateStr?: string, limit: number = 10): FestivalRecord[] {
    const ref = referenceDateStr ? new Date(referenceDateStr) : new Date('2026-09-28');
    const all = festivalKnowledgeService.getAllFestivals();

    const future: { days: number; festival: FestivalRecord }[] = [];

    for (const f of all) {
      if (!f.date_2026) continue;
      const startStr = f.date_2026.split(' to ')[0].trim();
      const d = new Date(startStr);
      if (!isNaN(d.getTime()) && d.getTime() >= ref.getTime()) {
        const diffDays = Math.round((d.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
        future.push({ days: diffDays, festival: f });
      }
    }

    future.sort((a, b) => a.days - b.days);
    return future.slice(0, limit).map(item => item.festival);
  }
}

export const festivalDateService = new FestivalDateService();
