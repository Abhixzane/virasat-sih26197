import React, { useState, useEffect } from 'react';
import {
  BookOpen, Filter, Search, Sparkles, Volume2, Play,
  Pause, Bookmark, ArrowRight, Quote, Heart
} from 'lucide-react';
import { api } from '../services/api';
import { CulturalStory } from '../types/cultural';
import { StoryCard } from '../components/cards/StoryCard';
import {
  TricolourRibbonWave, MonumentSkyline, StatsCounterBar
} from '../components/shared/TricolourBranding';

interface StoriesPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const StoriesPage: React.FC<StoriesPageProps> = ({ onExploreRelated }) => {
  const [stories, setStories] = useState<CulturalStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingStoryId, setPlayingStoryId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStories = async () => {
      setLoading(true);
      try {
        const data = await api.getStories();
        if (isMounted) setStories(data);
      } catch (err) {
        console.error('Failed to load cultural stories:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStories();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    'All',
    'Architectural',
    'Spiritual',
    'Folklore',
    'Freedom Struggle',
  ];

  const statesList = ['All', 'Bihar', 'Karnataka', 'Uttar Pradesh', 'Maharashtra', 'Odisha'];

  const togglePlay = (id: string) => {
    setPlayingStoryId((prev) => (prev === id ? null : id));
  };

  const filteredStories = stories.filter((st) => {
    if (selectedCategory !== 'All' && !st.story_category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (selectedState !== 'All' && st.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      st.title.toLowerCase().includes(q) ||
      st.story_category.toLowerCase().includes(q) ||
      st.narrative.toLowerCase().includes(q) ||
      st.state.toLowerCase().includes(q)
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
            <BookOpen className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>ORAL HISTORIES, EPICS & ARCHITECTURAL LORE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-900 leading-tight">
            Cultural Stories & Oral Folklore
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            Monuments are not merely stone; they are living repositories of human narratives.
            Discover the boy architect who saved Konark, the solar vows of Draupadi, and Tilak's civic mobilization through Ganeshotsav.
          </p>
        </div>

        <div className="pt-6">
          <TricolourRibbonWave />
        </div>
      </section>

      {/* 2. Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#E05A2B]" /> Theme:
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
              placeholder="Search folklore, heroes, legends..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-stone-50 border border-stone-200 outline-none focus:border-[#E05A2B] font-medium"
            />
          </div>
        </div>
      </div>

      {/* 3. Grid of Stories */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-[#E05A2B] border-t-transparent rounded-full animate-spin" />
          <span>Retrieving verified oral histories from database...</span>
        </div>
      ) : filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((st) => (
            <StoryCard
              key={st.id}
              story={st}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('story', st.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
          <p className="font-semibold text-sm">No stories found matching your filter criteria.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedState('All'); setSearchQuery(''); }}
            className="mt-2 text-xs font-bold text-[#E05A2B] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. The Oral Tradition Safeguard */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-[#E05A2B]" />
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            India's Oral Heritage: The Living Library (Shruti & Smriti)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
          For thousands of years before the printing press, India preserved astronomical alignments, philosophical treaties, architectural formulas, and moral epics through oral mnemonic chanting. VIRASAT digitally preserves these narratives, linking every oral legend back to its physical archaeological origin.
        </p>
      </section>

      {/* 5. Stats Bar */}
      <section>
        <StatsCounterBar
          item1={{ count: 'Millions', label: 'Oral Folk Narratives' }}
          item2={{ count: '3,000+', label: 'Years of Oral Transmission' }}
          item3={{ count: '100%', label: 'ASI Verified Monument Links' }}
          item4={{ count: 'Zero', label: 'Fabricated Myths' }}
        />
      </section>
    </div>
  );
};
