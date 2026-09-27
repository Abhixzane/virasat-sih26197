import React, { useState, useEffect } from 'react';
import { Landmark, MapPin, Search, Filter } from 'lucide-react';
import { api } from '../services/api';
import { HeritagePlace } from '../types/cultural';
import { HeritageCard } from '../components/cards/HeritageCard';

interface HeritagePageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const HeritagePage: React.FC<HeritagePageProps> = ({ onExploreRelated }) => {
  const [places, setPlaces] = useState<HeritagePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const data = await api.getHeritagePlaces(
          selectedState !== 'All' ? { state: selectedState } : undefined
        );
        if (isMounted) setPlaces(data);
      } catch (err) {
        console.error('Failed to load heritage monuments:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPlaces();
    return () => {
      isMounted = false;
    };
  }, [selectedState]);

  const filteredPlaces = places.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.architectural_style.toLowerCase().includes(q)
    );
  });

  const statesList = [
    'All', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Bihar',
    'Rajasthan', 'Odisha', 'Tamil Nadu', 'Delhi'
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5" />
            <span>Archaeological Survey of India & UNESCO Heritage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Heritage Places & Historic Monuments
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Explore verified architectural wonders across India, from monolithic rock-cut cave shrines and Vijayanagara granite engineering to classical Dravidian gopurams and Mughal marble masterpieces.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* State Filter Chips */}
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
                  ? 'bg-amber-800 text-white shadow-2xs'
                  : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-amber-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search monuments or styles..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200 outline-none focus:border-amber-600 font-medium"
          />
        </div>
      </div>

      {/* Grid of Heritage Places */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span>Retrieving verified monuments from database...</span>
        </div>
      ) : filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <HeritageCard
              key={place.id}
              place={place}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('heritage', place.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
          <p className="font-semibold text-sm">No monuments found matching the current filter.</p>
          <button
            onClick={() => { setSelectedState('All'); setSearchQuery(''); }}
            className="mt-2 text-xs font-bold text-amber-800 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
