import React, { useState, useEffect } from 'react';
import {
  Palette, Filter, Search, Award, CheckCircle2,
  Sparkles, Hammer, Scissors, Layers, ShieldCheck, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { ArtCraft } from '../types/cultural';
import { ArtCraftCard } from '../components/cards/ArtCraftCard';
import {
  TricolourRibbonWave, MonumentSkyline, StatsCounterBar
} from '../components/shared/TricolourBranding';

interface ArtsCraftsPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const ArtsCraftsPage: React.FC<ArtsCraftsPageProps> = ({ onExploreRelated }) => {
  const [arts, setArts] = useState<ArtCraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [onlyGI, setOnlyGI] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchArts = async () => {
      setLoading(true);
      try {
        const data = await api.getArtsCrafts();
        if (isMounted) setArts(data);
      } catch (err) {
        console.error('Failed to load arts & crafts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchArts();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    'All',
    'Painting',
    'Weaving',
    'Pottery',
    'Metallurgy',
    'Woodcraft',
  ];

  const statesList = [
    'All', 'Bihar', 'Rajasthan', 'Uttar Pradesh', 'Maharashtra',
    'West Bengal', 'Odisha', 'Assam', 'Karnataka', 'Tamil Nadu', 'Kerala'
  ];

  const filteredArts = arts.filter((a) => {
    if (onlyGI && !a.gi_status) return false;
    if (selectedCategory !== 'All' && !a.craft_category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (selectedState !== 'All' && a.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.craft_category.toLowerCase().includes(q) ||
      a.state.toLowerCase().includes(q) ||
      a.materials_used.toLowerCase().includes(q) ||
      a.artisan_name.toLowerCase().includes(q)
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
            <Palette className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>GI-TAGGED MASTER CRAFTS & LIVING GUILDS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-900 leading-tight">
            Traditional Arts, Crafts & Master Artisans
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            Explore India’s Geographical Indications (GI) certified crafts, generational artisan villages,
            and eco-conscious techniques passed down through centuries. From Mithila vegetable pigments to Bidriware silver inlays.
          </p>
        </div>

        <div className="pt-6">
          <TricolourRibbonWave />
        </div>
      </section>

      {/* 2. Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        {/* Category Pills & GI Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
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

          {/* GI Certified Toggle Button */}
          <button
            onClick={() => setOnlyGI(!onlyGI)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              onlyGI
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Show GI Certified Only</span>
          </button>
        </div>

        {/* State and Search Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-100">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-semibold text-stone-500 mr-1">Origin State:</span>
            {statesList.slice(0, 8).map((st) => (
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
              placeholder="Search craft, technique, material..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-stone-50 border border-stone-200 outline-none focus:border-[#E05A2B] font-medium"
            />
          </div>
        </div>
      </div>

      {/* 3. Grid of Arts & Crafts */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-[#E05A2B] border-t-transparent rounded-full animate-spin" />
          <span>Retrieving verified crafts from database...</span>
        </div>
      ) : filteredArts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArts.map((craft) => (
            <ArtCraftCard
              key={craft.id}
              art={craft}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('art_craft', craft.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
          <p className="font-semibold text-sm">No crafts found matching your filter criteria.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedState('All'); setOnlyGI(false); setSearchQuery(''); }}
            className="mt-2 text-xs font-bold text-[#E05A2B] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. GI Intellectual Property & Artisan Lineage Section */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>GEOGRAPHICAL INDICATIONS (GI) PROTECTION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            Why GI Certification Matters in VIRASAT
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            A Geographical Indication (GI) tag guarantees legal provenance, preventing cheap synthetic machine-made imitations and ensuring that economic benefits flow directly back to indigenous artisan clusters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-amber-800" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">100% Genuine Provenance</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every GI-tagged craft in VIRASAT links directly to its registered cluster under the Geographical Indications Registry of India.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-emerald-800" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">Natural Ecological Materials</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Preserves plant-based dyes, organic fibers, non-toxic wood lacquers, and hand-forged metallurgical recipes dating back millennia.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-800" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">Generational Guild Continuity</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Connects historical monuments to the exact living master guilds whose ancestors physically carved and decorated those sites.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Stats Bar */}
      <section>
        <StatsCounterBar
          item1={{ count: '450+', label: 'Registered Indian GI Crafts' }}
          item2={{ count: '28', label: 'Craft Origin States' }}
          item3={{ count: '100%', label: 'Non-Synthetic Verification' }}
          item4={{ count: 'Millions', label: 'Artisan Livelihoods' }}
        />
      </section>
    </div>
  );
};
