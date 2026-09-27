import React, { useState, useEffect } from 'react';
import {
  Music, Filter, Search, Sparkles, Smile, Frown,
  Zap, Flame, Shield, Skull, HeartHandshake, Eye, Compass
} from 'lucide-react';
import { api } from '../services/api';
import { PerformingArt } from '../types/cultural';
import { PerformingArtCard } from '../components/cards/PerformingArtCard';
import {
  TricolourRibbonWave, MonumentSkyline, StatsCounterBar
} from '../components/shared/TricolourBranding';

interface PerformingArtsPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const PerformingArtsPage: React.FC<PerformingArtsPageProps> = ({ onExploreRelated }) => {
  const [arts, setArts] = useState<PerformingArt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRasa, setActiveRasa] = useState<string>('Shringara');

  useEffect(() => {
    let isMounted = true;
    const fetchPerf = async () => {
      setLoading(true);
      try {
        const data = await api.getPerformingArts();
        if (isMounted) setArts(data);
      } catch (err) {
        console.error('Failed to load performing arts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPerf();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    'All',
    'Classical Dance',
    'Folk Theatre',
    'Temple Theatre',
    'Martial Art',
  ];

  const statesList = [
    'All', 'Kerala', 'Tamil Nadu', 'Odisha', 'Karnataka',
    'Rajasthan', 'Maharashtra', 'Assam', 'Manipur', 'Andhra Pradesh'
  ];

  // The 9 Classical Rasas (Natya Shastra)
  const navarasas = [
    { name: 'Shringara', emotion: 'Love & Beauty', color: 'Light Green', desc: 'The universal creative emotion expressed through devotion, romance, and aesthetic grace.', icon: HeartHandshake },
    { name: 'Hasya', emotion: 'Joy & Humour', color: 'White', desc: 'Comic delight and innocent merriment depicted through playful eyes and satire.', icon: Smile },
    { name: 'Karuna', emotion: 'Compassion & Grief', color: 'Grey', desc: 'Deep empathy for suffering, pathos, and transcendental sympathy.', icon: Frown },
    { name: 'Raudra', emotion: 'Fury & Righteous Anger', color: 'Red', desc: 'Dynamic wrath provoked by injustice, embodied by Lord Shiva in the Rudra Tandava.', icon: Flame },
    { name: 'Veera', emotion: 'Heroism & Valour', color: 'Saffron', desc: 'Courage, determination, and chivalrous duty in battle and spiritual discipline.', icon: Shield },
    { name: 'Bhayanaka', emotion: 'Terror & Fear', color: 'Black', desc: 'Trembling awe before the cosmic vastness or mortal peril.', icon: Zap },
    { name: 'Bibhatsa', emotion: 'Disgust & Aversion', color: 'Blue', desc: 'Repulsion toward falsehood, decay, and spiritual stagnation.', icon: Skull },
    { name: 'Adbhuta', emotion: 'Wonder & Awe', color: 'Yellow', desc: 'Childlike astonishment at divine miracles, temple marvels, and cosmic architecture.', icon: Eye },
    { name: 'Shanta', emotion: 'Peace & Serenity', color: 'Jasmine White', desc: 'Tranquil meditative stillness beyond worldly turbulence, the ultimate goal of Natya.', icon: Compass },
  ];

  const filteredArts = arts.filter((pa) => {
    if (selectedCategory !== 'All' && !pa.category.toLowerCase().includes(selectedCategory.toLowerCase()) && !pa.performance_style.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (selectedState !== 'All' && pa.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      pa.name.toLowerCase().includes(q) ||
      pa.category.toLowerCase().includes(q) ||
      pa.state.toLowerCase().includes(q) ||
      pa.performance_style.toLowerCase().includes(q) ||
      pa.origin.toLowerCase().includes(q)
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
            <Music className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>CLASSICAL DANCES, SANSKRIT THEATRE & MARTIAL ARTS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-900 leading-tight">
            Indian Performing Arts & Living Theatre
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            From the 2,000-year-old Natya Shastra Sanskrit codices to coastal night-long Yakshagana theatre
            and explosive Kalarippayattu martial choreography, experience India's expressive heritage.
          </p>
        </div>

        <div className="pt-6">
          <TricolourRibbonWave />
        </div>
      </section>

      {/* 2. Category & State Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#E05A2B]" /> Style:
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
            <span className="text-xs font-semibold text-stone-500 mr-1">Region:</span>
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
              placeholder="Search dance, mudra, instruments..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-stone-50 border border-stone-200 outline-none focus:border-[#E05A2B] font-medium"
            />
          </div>
        </div>
      </div>

      {/* 3. Grid of Performing Arts */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-[#E05A2B] border-t-transparent rounded-full animate-spin" />
          <span>Retrieving verified performing arts from database...</span>
        </div>
      ) : filteredArts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArts.map((art) => (
            <PerformingArtCard
              key={art.id}
              art={art}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('performing_art', art.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
          <p className="font-semibold text-sm">No performing arts found matching your search.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedState('All'); setSearchQuery(''); }}
            className="mt-2 text-xs font-bold text-[#E05A2B] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. Navarasa Explorer (The 9 Classical Emotions) */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E05A2B] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NATYA SHASTRA AESTHETICS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            The Navarasa Explorer: Nine Classical Aesthetic Sentiments
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Codified by Sage Bharata, Indian theatre and dance transform raw human emotion into transcendental aesthetic bliss (Rasa).
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2.5">
          {navarasas.map((r) => {
            const Icon = r.icon;
            const isSelected = activeRasa === r.name;
            return (
              <button
                key={r.name}
                onClick={() => setActiveRasa(r.name)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#FFF8EE] border-[#E05A2B] shadow-xs scale-105'
                    : 'bg-stone-50/60 border-stone-200/80 hover:bg-white hover:border-amber-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-[#E05A2B] text-white' : 'bg-white text-stone-600 border border-stone-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-stone-900 font-serif">{r.name}</div>
                <div className="text-[10px] text-stone-500 leading-tight">{r.emotion}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Rasa Detail Box */}
        {(() => {
          const current = navarasas.find((r) => r.name === activeRasa);
          if (!current) return null;
          return (
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                  {current.name} Rasa ({current.emotion})
                </span>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed">{current.desc}</p>
              </div>
              <span className="text-[11px] font-semibold text-stone-500 bg-white px-2.5 py-1 rounded-md border border-stone-200 shrink-0">
                Natya Shastra Codex
              </span>
            </div>
          );
        })()}
      </section>

      {/* 5. Stats Bar */}
      <section>
        <StatsCounterBar
          item1={{ count: '8', label: 'Recognized Classical Dances' }}
          item2={{ count: '300+', label: 'Living Folk Dance Styles' }}
          item3={{ count: '9', label: 'Aesthetic Navarasas' }}
          item4={{ count: 'UNESCO', label: 'Intangible World Heritage' }}
        />
      </section>
    </div>
  );
};
