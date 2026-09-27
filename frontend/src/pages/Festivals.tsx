import React, { useState, useEffect } from 'react';
import {
  Calendar, Filter, Search, Sparkles, Sun, Moon,
  Flower2, Wind, CloudRain, Snowflake, ArrowRight, Heart
} from 'lucide-react';
import { api } from '../services/api';
import { Festival } from '../types/cultural';
import { FestivalCard } from '../components/cards/FestivalCard';
import {
  TricolourRibbonWave, MonumentSkyline, StatsCounterBar
} from '../components/shared/TricolourBranding';

interface FestivalsPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const FestivalsPage: React.FC<FestivalsPageProps> = ({ onExploreRelated }) => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchFestivals = async () => {
      setLoading(true);
      try {
        const data = await api.getFestivals();
        if (isMounted) setFestivals(data);
      } catch (err) {
        console.error('Failed to load festivals:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchFestivals();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    'All',
    'Vedic Festival',
    'Harvest Festival',
    'Spiritual Festival',
    'Cultural Festival',
    'Tribal Heritage',
  ];

  const statesList = [
    'All', 'Bihar', 'West Bengal', 'Kerala', 'Uttar Pradesh',
    'Maharashtra', 'Karnataka', 'Odisha', 'Assam', 'Rajasthan', 'Nagaland', 'Ladakh'
  ];

  // Vedic 6 Ritus (Seasons)
  const seasonsData = [
    { name: 'Vasant (Spring)', months: 'Chaitra - Vaisakha (Mar-May)', icon: Flower2, fest: 'Holi, Bihu, Baisakhi', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { name: 'Grishma (Summer)', months: 'Jyeshtha - Ashadha (May-Jul)', icon: Sun, fest: 'Rath Yatra, Ganga Dussehra', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { name: 'Varsha (Monsoon)', months: 'Shravana - Bhadrapada (Jul-Sep)', icon: CloudRain, fest: 'Onam, Raksha Bandhan, Janmashtami', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { name: 'Sharad (Autumn)', months: 'Ashwin - Kartika (Sep-Nov)', icon: Wind, fest: 'Durga Puja, Navratri, Dussehra', color: 'bg-orange-50 text-orange-800 border-orange-200' },
    { name: 'Hemant (Pre-Winter)', months: 'Agrahayana - Pausha (Nov-Jan)', icon: Moon, fest: 'Diwali, Chhath Puja, Hornbill', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { name: 'Shishir (Winter)', months: 'Magha - Phalguna (Jan-Mar)', icon: Snowflake, fest: 'Makar Sankranti, Pongal, Kumbh Mela', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  ];

  const filteredFestivals = festivals.filter((f) => {
    if (selectedCategory !== 'All' && !f.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (selectedState !== 'All' && f.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.state.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.associated_communities.toLowerCase().includes(q)
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
            <Calendar className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>LIVING TRADITIONS & SACRED CELEBRATIONS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-900 leading-tight">
            Indian Festivals & Living Traditions
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            Experience India’s vibrant seasonal cycles, astronomical alignments, and living community rites.
            From Vedic solar worship on riverbanks to royal temple pageants, discover the rituals that preserve cultural wisdom.
          </p>
        </div>

        <div className="pt-6">
          <TricolourRibbonWave />
        </div>
      </section>

      {/* 2. Category & State Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#E05A2B]" /> Category:
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

        {/* State and Search Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-100">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-semibold text-stone-500 mr-1">State:</span>
            {statesList.slice(0, 7).map((st) => (
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
              placeholder="Search festivals or rituals..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-stone-50 border border-stone-200 outline-none focus:border-[#E05A2B] font-medium"
            />
          </div>
        </div>
      </div>

      {/* 3. Grid of Festivals */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-[#E05A2B] border-t-transparent rounded-full animate-spin" />
          <span>Retrieving verified festivals from database...</span>
        </div>
      ) : filteredFestivals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFestivals.map((fest) => (
            <FestivalCard
              key={fest.id}
              festival={fest}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('festival', fest.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
          <p className="font-semibold text-sm">No festivals found matching your criteria.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedState('All'); setSearchQuery(''); }}
            className="mt-2 text-xs font-bold text-[#E05A2B] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. Seasonal Cycle of India (The 6 Vedic Ritus) */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E05A2B] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASTRONOMICAL & AGRARIAN HARMONY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            The Living Cycle: India’s Six Vedic Seasons (Shad Ritu)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Unlike binary calendars, India's festivals are calibrated with the sun, moon, and agricultural rhythms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {seasonsData.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.name}
                className={`p-4 rounded-2xl border transition-all hover:shadow-xs flex items-start gap-3.5 ${s.color}`}
              >
                <div className="p-2 rounded-xl bg-white/80 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold font-serif">{s.name}</h3>
                  <div className="text-[11px] font-medium opacity-80">{s.months}</div>
                  <div className="text-xs font-semibold pt-1">
                    Festivals: <span className="font-normal">{s.fest}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Stats Bar */}
      <section>
        <StatsCounterBar
          item1={{ count: '100+', label: 'Annual Living Traditions' }}
          item2={{ count: '36', label: 'States & UT Calendars' }}
          item3={{ count: '6', label: 'Vedic Ritus (Seasons)' }}
          item4={{ count: '100%', label: 'Grounded Ritual Provenance' }}
        />
      </section>
    </div>
  );
};
