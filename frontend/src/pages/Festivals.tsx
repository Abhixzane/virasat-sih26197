import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Search } from 'lucide-react';
import { api } from '../services/api';
import { Festival } from '../types/cultural';
import { FestivalCard } from '../components/cards/FestivalCard';

interface FestivalsPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const FestivalsPage: React.FC<FestivalsPageProps> = ({ onExploreRelated }) => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchFestivals = async () => {
      setLoading(true);
      try {
        const data = await api.getFestivals(
          selectedState !== 'All' ? selectedState : undefined
        );
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
  }, [selectedState]);

  const filteredFestivals = festivals.filter((f) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.state.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q)
    );
  });

  const statesList = ['All', 'Bihar', 'West Bengal', 'Maharashtra', 'Kerala', 'Rajasthan', 'Uttar Pradesh', 'Odisha', 'Assam'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-950 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Living Celebrations & Sacred Rites</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Festivals & Living Traditions
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Discover India’s festive calendar rooted in astronomical cycles, Vedic seasons, agrarian harvests, and sacred homecoming epics. Grounded in community archives and state documentation.
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
                  ? 'bg-orange-800 text-white shadow-2xs'
                  : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-orange-400'
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
            placeholder="Search festivals or traditions..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200 outline-none focus:border-orange-600 font-medium"
          />
        </div>
      </div>

      {/* Grid of Festivals */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
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
          <p className="font-semibold text-sm">No festivals found matching the current filter.</p>
          <button
            onClick={() => { setSelectedState('All'); setSearchQuery(''); }}
            className="mt-2 text-xs font-bold text-orange-800 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
