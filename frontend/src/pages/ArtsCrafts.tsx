import React, { useState, useEffect } from 'react';
import { Palette, Filter, Search, Award } from 'lucide-react';
import { api } from '../services/api';
import { ArtCraft } from '../types/cultural';
import { ArtCraftCard } from '../components/cards/ArtCraftCard';

interface ArtsCraftsPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const ArtsCraftsPage: React.FC<ArtsCraftsPageProps> = ({ onExploreRelated }) => {
  const [arts, setArts] = useState<ArtCraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [onlyGI, setOnlyGI] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchArts = async () => {
      setLoading(true);
      try {
        const data = await api.getArtsCrafts(
          selectedState !== 'All' ? selectedState : undefined
        );
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
  }, [selectedState]);

  const filteredArts = arts.filter((a) => {
    if (onlyGI && !a.gi_status) return false;
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

  const statesList = ['All', 'Bihar', 'Rajasthan', 'Uttar Pradesh', 'Maharashtra', 'West Bengal', 'Odisha', 'Assam'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" />
            <span>Master Crafts & Geographical Indications</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Traditional Arts, Crafts & Artisans
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Witness the living hands shaping India’s heritage. From Varanasi pit-loom Kadhwa silk brocades and Agra Pietra Dura marble lapidary to Madhubani natural pigment paintings and Sualkuchi wild Muga silks.
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
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-emerald-400'
              }`}
            >
              {st}
            </button>
          ))}
          <button
            onClick={() => setOnlyGI(!onlyGI)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold ml-2 transition-all ${
              onlyGI
                ? 'bg-amber-800 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-900 border border-amber-300'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>GI Tagged Only</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crafts, materials, guilds..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200 outline-none focus:border-emerald-600 font-medium"
          />
        </div>
      </div>

      {/* Grid of Crafts */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>Retrieving verified artisan traditions...</span>
        </div>
      ) : filteredArts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredArts.map((art) => (
            <ArtCraftCard
              key={art.id}
              art={art}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('art_craft', art.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
          <p className="font-semibold text-sm">No traditional crafts found matching the current filter.</p>
          <button
            onClick={() => { setSelectedState('All'); setOnlyGI(false); setSearchQuery(''); }}
            className="mt-2 text-xs font-bold text-emerald-800 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
