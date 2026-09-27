import React, { useState, useEffect } from 'react';
import { Music, Filter, Search } from 'lucide-react';
import { api } from '../services/api';
import { PerformingArt } from '../types/cultural';
import { PerformingArtCard } from '../components/cards/PerformingArtCard';

interface PerformingArtsPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const PerformingArtsPage: React.FC<PerformingArtsPageProps> = ({ onExploreRelated }) => {
  const [arts, setArts] = useState<PerformingArt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchPerf = async () => {
      setLoading(true);
      try {
        const data = await api.getPerformingArts(
          selectedState !== 'All' ? selectedState : undefined
        );
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
  }, [selectedState]);

  const filteredArts = arts.filter((pa) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      pa.name.toLowerCase().includes(q) ||
      pa.category.toLowerCase().includes(q) ||
      pa.state.toLowerCase().includes(q) ||
      pa.performance_style.toLowerCase().includes(q)
    );
  });

  const statesList = ['All', 'Kerala', 'Rajasthan', 'Maharashtra', 'Bihar', 'Tamil Nadu', 'Odisha', 'Assam'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Music className="w-3.5 h-3.5" />
            <span>Classical & Folk Traditions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Folk & Classical Performing Arts
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Experience the living theatrical storytelling of India: stylized Kathakali dance-dramas of Kerala, hypnotic desert Kalbelia pirouettes of Rajasthan, soulful Bhojpuri-Maithili oral geet, and the ancient Tribhanga sculptures-in-motion of Odissi.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> State:
          </span>
          {statesList.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedState === st
                  ? 'bg-purple-800 text-white shadow-2xs'
                  : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-purple-400'
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
            placeholder="Search performance styles or instruments..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200 outline-none focus:border-purple-600 font-medium"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <span>Retrieving performing arts traditions...</span>
        </div>
      ) : filteredArts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <p className="font-semibold text-sm">No performing arts found matching the current filter.</p>
          <button
            onClick={() => { setSelectedState('All'); setSearchQuery(''); }}
            className="mt-2 text-xs font-bold text-purple-800 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
