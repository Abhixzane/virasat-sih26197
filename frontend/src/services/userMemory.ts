import { UserMemory } from '../types/cultural';

const STORAGE_KEY = 'virasat_user_memory';

const DEFAULT_MEMORY: UserMemory = {
  home_city: '',
  preferred_language: 'en',
  budget_tier: 'Moderate',
  budget_amount_inr: 10000,
  travel_style: 'Cultural Explorer',
  interests: ['Ancient Monuments', 'Heritage Crafts', 'Traditional Food'],
  dietary_pref: 'Flexible',
  consent_personalized: true
};

export const userMemoryService = {
  getUserMemory(): UserMemory {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_MEMORY;
      return { ...DEFAULT_MEMORY, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_MEMORY;
    }
  },

  saveUserMemory(updates: Partial<UserMemory>): UserMemory {
    try {
      const current = this.getUserMemory();
      const updated = { ...current, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_MEMORY;
    }
  },

  clearUserMemory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  hasMemory(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const mem = JSON.parse(raw);
      return Boolean(mem.home_city || mem.budget_tier !== 'Moderate' || (mem.interests && mem.interests.length > 0));
    } catch {
      return false;
    }
  }
};
