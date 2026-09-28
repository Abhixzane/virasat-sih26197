import React, { useState, useEffect, useRef } from 'react';
import {
  Palette, Search, Award, CheckCircle2,
  Scissors, Layers, LayoutGrid, MapPin, ChevronDown
} from 'lucide-react';
import { api } from '../services/api';
import { ArtCraft } from '../types/cultural';
import { ArtCraftCard } from '../components/cards/ArtCraftCard';
import { StatsCounterBar } from '../components/shared/TricolourBranding';

interface ArtsCraftsPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const ArtsCraftsPage: React.FC<ArtsCraftsPageProps> = ({ onExploreRelated }) => {
  const [arts, setArts] = useState<ArtCraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [moreStatesOpen, setMoreStatesOpen] = useState(false);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close More States dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setMoreStatesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Category definitions matching reference image
  const categories = [
    { key: 'All', label: 'All', emoji: '' },
    { key: 'Painting', label: 'Painting', emoji: '🖌️' },
    { key: 'Weaving', label: 'Weaving', emoji: '🧶' },
    { key: 'Pottery', label: 'Pottery', emoji: '🏺' },
    { key: 'Metalwork', label: 'Metalwork', emoji: '🏆' },
    { key: 'Woodcraft', label: 'Woodcraft', emoji: '🪵' },
    { key: 'Stone Craft', label: 'Stone Craft', emoji: '🏛️' },
    { key: 'Textile', label: 'Textile', emoji: '🧣' },
    { key: 'Jewellery', label: 'Jewellery', emoji: '💎' },
    { key: 'Other', label: 'Other', emoji: '•••' },
  ];

  // States list from reference image
  const primaryStates = [
    'All', 'Bihar', 'Rajasthan', 'Uttar Pradesh',
    'Maharashtra', 'West Bengal', 'Odisha', 'Assam'
  ];

  const additionalStates = [
    'Jammu and Kashmir', 'Karnataka', 'Tamil Nadu', 'Kerala',
    'Meghalaya', 'Nagaland', 'Arunachal Pradesh', 'Chhattisgarh',
    'Himachal Pradesh', 'Uttarakhand', 'Gujarat', 'Goa', 'Delhi'
  ];

  const filteredArts = arts.filter((a) => {
    // Category filter
    if (selectedCategory !== 'All') {
      const cat = (a.craft_category || '').toLowerCase();
      const name = (a.name || '').toLowerCase();
      const combined = `${cat} ${name}`;

      if (selectedCategory === 'Painting' && !combined.includes('paint') && !combined.includes('pattachitra') && !combined.includes('aipan') && !combined.includes('warli') && !combined.includes('kalamkari') && !combined.includes('mural')) {
        return false;
      }
      if (selectedCategory === 'Weaving' && !combined.includes('weav') && !combined.includes('silk') && !combined.includes('brocade') && !combined.includes('zari') && !combined.includes('shawl') && !combined.includes('ryndia') && !combined.includes('muga')) {
        return false;
      }
      if (selectedCategory === 'Pottery' && !combined.includes('potter') && !combined.includes('ceramic') && !combined.includes('clay') && !combined.includes('terracotta') && !combined.includes('earthenware')) {
        return false;
      }
      if (selectedCategory === 'Metalwork' && !combined.includes('metal') && !combined.includes('brass') && !combined.includes('bronze') && !combined.includes('dokra') && !combined.includes('bidriware') && !combined.includes('silver') && !combined.includes('kannadi')) {
        return false;
      }
      if (selectedCategory === 'Woodcraft' && !combined.includes('wood') && !combined.includes('carv') && !combined.includes('toy') && !combined.includes('lacquer') && !combined.includes('dapa')) {
        return false;
      }
      if (selectedCategory === 'Stone Craft' && !combined.includes('stone') && !combined.includes('marble') && !combined.includes('inlay') && !combined.includes('pietra') && !combined.includes('lapidary')) {
        return false;
      }
      if (selectedCategory === 'Textile' && !combined.includes('textile') && !combined.includes('embroid') && !combined.includes('chikan') && !combined.includes('zardozi') && !combined.includes('bandhani') && !combined.includes('kashmiri')) {
        return false;
      }
      if (selectedCategory === 'Jewellery' && !combined.includes('jewel') && !combined.includes('filigree') && !combined.includes('bead') && !combined.includes('wancho') && !combined.includes('kundan')) {
        return false;
      }
    }

    // State filter
    if (selectedState !== 'All' && a.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = a.name?.toLowerCase().includes(q);
      const matchCategory = a.craft_category?.toLowerCase().includes(q);
      const matchState = a.state?.toLowerCase().includes(q);
      const matchMaterials = a.materials_used?.toLowerCase().includes(q);
      const matchArtisan = a.artisan_name?.toLowerCase().includes(q);
      const matchOrigin = a.origin?.toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchState && !matchMaterials && !matchArtisan && !matchOrigin) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner Matching Reference Image Exactly */}
      <section className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-amber-200/70 shadow-xs min-h-[220px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[220px]">
          {/* Left Column: Heading, Subtitle & Orange Underline Bar */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-3 z-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C85A17]">
              <Palette className="w-4 h-4 text-[#C85A17] shrink-0" />
              <span>GI-TAGGED MASTER CRAFTS & LIVING GUILDS</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-serif font-extrabold text-[#0B1E36] tracking-tight leading-tight">
              Traditional Arts, Crafts & Master Artisans
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
              Explore India's GI certified crafts, traditional techniques, artisan communities and timeless creations passed down through generations.
            </p>

            {/* Orange Underline Accent Bar */}
            <div className="w-12 h-1 bg-[#FF6600] rounded-full mt-2" />
          </div>

          {/* Right Column: Master Crafts Artwork (Elephant, Vase, Nataraja, Brocade, Mandala) */}
          <div className="lg:col-span-5 relative min-h-[190px] lg:min-h-full overflow-hidden flex items-end justify-end">
            {/* Smooth gradient fade into left ivory background */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FFFDF9] to-transparent z-10 pointer-events-none hidden sm:block" />

            <img
              src="/crafts-hero-art@2x.jpg"
              alt="Indian Master Crafts & Artisan Traditions"
              className="w-full h-full object-cover object-right select-none"
            />
          </div>
        </div>
      </section>

      {/* 2. Dual-Row Filter Bar Matching Reference Image Exactly */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3.5">
        {/* Row 1: Craft Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Label Badge */}
          <div className="flex items-center gap-2 text-xs font-bold text-stone-800 shrink-0 mr-1 select-none">
            <div className="w-6 h-6 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF6600]">
              <LayoutGrid className="w-3.5 h-3.5" />
            </div>
            <span>Craft Category</span>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-1 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#FF6600] text-white font-semibold shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/80 font-medium'
                  }`}
                >
                  {cat.emoji && <span className="text-xs">{cat.emoji}</span>}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Origin State & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
          {/* Origin State Label + State Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800 shrink-0 mr-1 select-none">
              <div className="w-6 h-6 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF6600]">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span>Origin State</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {primaryStates.map((st) => {
                const active = selectedState === st;
                return (
                  <button
                    key={st}
                    onClick={() => setSelectedState(st)}
                    className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                      active
                        ? 'bg-[#FF6600] text-white font-semibold shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/80 font-medium'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}

              {/* "More ▾" Dropdown for remaining states */}
              <div className="relative" ref={moreDropdownRef}>
                <button
                  onClick={() => setMoreStatesOpen(!moreStatesOpen)}
                  className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer flex items-center gap-1 ${
                    additionalStates.includes(selectedState)
                      ? 'bg-[#FF6600] text-white font-semibold shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/80 font-medium'
                  }`}
                >
                  <span>{additionalStates.includes(selectedState) ? selectedState : 'More'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${moreStatesOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreStatesOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn text-xs max-h-60 overflow-y-auto">
                    {additionalStates.map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setSelectedState(st);
                          setMoreStatesOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 transition-colors cursor-pointer ${
                          selectedState === st
                            ? 'bg-[#FFF2E5] text-[#FF6600] font-bold'
                            : 'text-stone-700 hover:bg-stone-50 font-medium'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Box on the Right */}
          <div className="relative w-full sm:w-64 lg:w-72 ml-auto">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search craft, technique, material..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-[#F9FAFB] hover:bg-stone-100/60 focus:bg-white border border-stone-200 focus:border-[#FF6600] outline-none text-stone-800 placeholder-stone-400 transition-all shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* 3. 3-Column Grid of Arts & Crafts Matching Reference Images */}
      {loading ? (
        <div className="py-24 text-center text-stone-400 text-sm flex items-center justify-center gap-2 bg-white rounded-3xl border border-stone-200">
          <div className="w-5 h-5 border-2 border-[#FF6600] border-t-transparent rounded-full animate-spin" />
          <span>Retrieving verified master crafts from database...</span>
        </div>
      ) : filteredArts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="py-16 text-center text-stone-500 bg-white rounded-3xl border border-stone-200">
          <p className="font-semibold text-sm">No crafts found matching your filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedState('All');
              setSearchQuery('');
            }}
            className="mt-2 text-xs font-bold text-[#FF6600] hover:underline cursor-pointer"
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

      {/* 5. Bottom Stats Bar */}
      <section className="pt-2">
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
