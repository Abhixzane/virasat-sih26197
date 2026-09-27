import React, { useState, useEffect } from 'react';
import {
  Navigation, Filter, Search, Sparkles, Clock, MapPin,
  Compass, ArrowRight, ShieldCheck, Footprints, HeartHandshake
} from 'lucide-react';
import { api } from '../services/api';
import { CulturalExperience } from '../types/cultural';
import { ExperienceCard } from '../components/cards/ExperienceCard';
import {
  TricolourRibbonWave, MonumentSkyline, StatsCounterBar
} from '../components/shared/TricolourBranding';

interface ExperiencesPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const ExperiencesPage: React.FC<ExperiencesPageProps> = ({ onExploreRelated }) => {
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchExp = async () => {
      setLoading(true);
      try {
        const data = await api.getExperiences();
        if (isMounted) setExperiences(data);
      } catch (err) {
        console.error('Failed to load cultural experiences:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchExp();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    'All',
    'Artisan Masterclass',
    'Historical Landscape',
    'Spiritual Contemplation',
    'Village Immersion',
  ];

  const statesList = [
    'All', 'Uttar Pradesh', 'Karnataka', 'Maharashtra', 'Bihar', 'Rajasthan', 'Odisha', 'Kerala'
  ];

  const filteredExperiences = experiences.filter((exp) => {
    if (selectedCategory !== 'All' && !exp.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (selectedState !== 'All' && exp.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      exp.name.toLowerCase().includes(q) ||
      exp.city.toLowerCase().includes(q) ||
      exp.category.toLowerCase().includes(q) ||
      exp.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-stone-200/90 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="absolute top-0 inset-x-0 h-40 overflow-hidden pointer-events-none opacity-20 text-[#D4AF37]">
          <MonumentSkyline opacity={0.2} />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#E05A2B]">
            <Navigation className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>LIVING IMMERSIONS & HERITAGE WALKS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-900 leading-tight">
            Authentic Cultural Experiences & Artisan Encounters
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            Step beyond standard sightseeing. Engage directly with living artisan guilds, row ancient coracles
            beneath boulder ruins, and attend dawn rituals accompanied by generation-old oral histories.
          </p>
        </div>

        <div className="pt-6">
          <TricolourRibbonWave />
        </div>
      </section>

      {/* 2. Category & State Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#E05A2B]" /> Format:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#E05A2B] text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 border border-stone-200/80 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-100">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-semibold text-stone-500 mr-1">Region:</span>
            {statesList.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all ${
                  selectedState === st
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-stone-50 border border-stone-200 outline-none focus:border-[#E05A2B] font-medium"
            />
          </div>
        </div>
      </div>

      {/* 3. Grid of Experiences */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-[#E05A2B] border-t-transparent rounded-full animate-spin" />
          <span>Retrieving verified cultural experiences from database...</span>
        </div>
      ) : filteredExperiences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('experience', exp.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
          <p className="font-semibold text-sm">No experiences found matching your filters.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedState('All'); setSearchQuery(''); }}
            className="mt-2 text-xs font-bold text-[#E05A2B] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. Responsible Cultural Travel Protocol */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E05A2B] uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>ETHICAL & COMMUNITY-LED TOURISM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            The VIRASAT Living Heritage Protocol
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            To prevent over-tourism and cultural commodification, all VIRASAT immersion experiences adhere to four non-negotiable community principles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <div className="text-xs font-bold text-stone-900 font-serif">1. Direct Artisan Benefit</div>
            <p className="text-xs text-stone-600">No middle-men markups; travelers engage directly with registered master craftsmen cooperatives.</p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <div className="text-xs font-bold text-stone-900 font-serif">2. Sacred Sanctity Reverence</div>
            <p className="text-xs text-stone-600">Adherence to traditional attire, photography etiquette, and silence during live Vedic rituals.</p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <div className="text-xs font-bold text-stone-900 font-serif">3. Zero Ecological Footprint</div>
            <p className="text-xs text-stone-600">Plastic-free river trails, natural reed coracles, and preservation of delicate temple masonry.</p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <div className="text-xs font-bold text-stone-900 font-serif">4. Grounded Historical Context</div>
            <p className="text-xs text-stone-600">Walks guided by licensed ASI historians and generational family elders with verified knowledge.</p>
          </div>
        </div>
      </section>

      {/* 5. Stats Bar */}
      <section>
        <StatsCounterBar
          item1={{ count: '200+', label: 'Verified Living Experiences' }}
          item2={{ count: '100%', label: 'Community-Led Guilds' }}
          item3={{ count: 'Zero', label: 'Synthetic Tourism Claims' }}
          item4={{ count: 'ASI / State', label: 'Archival Provenance' }}
        />
      </section>
    </div>
  );
};
