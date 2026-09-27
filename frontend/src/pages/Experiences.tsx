import React, { useState, useEffect } from 'react';
import { Navigation, Filter, Search } from 'lucide-react';
import { api } from '../services/api';
import { CulturalExperience } from '../types/cultural';
import { ExperienceCard } from '../components/cards/ExperienceCard';

interface ExperiencesPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const ExperiencesPage: React.FC<ExperiencesPageProps> = ({ onExploreRelated }) => {
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('All');

  useEffect(() => {
    let isMounted = true;
    const fetchExp = async () => {
      setLoading(true);
      try {
        const data = await api.getExperiences(
          selectedState !== 'All' ? { state: selectedState } : undefined
        );
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
  }, [selectedState]);

  const statesList = ['All', 'Uttar Pradesh', 'Karnataka', 'Maharashtra', 'Bihar', 'Rajasthan', 'Odisha'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5" />
            <span>Living Immersions & Artisan Encounters</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Cultural Experiences & Heritage Walks
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Participate in authentic cultural rituals and masterclasses: dawn boat glides along Varanasi’s ghats, Bagru mud-resist natural dyeing, Tungabhadra river coracle rides, and silent meditations under the Bodhi Tree.
          </p>
        </div>
      </div>

      {/* State Filter Chips */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-stone-500 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter by State:
        </span>
        {statesList.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedState(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedState === st
                ? 'bg-blue-800 text-white shadow-2xs'
                : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-blue-400'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Grid of Experiences */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Retrieving verified cultural experiences...</span>
        </div>
      ) : experiences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
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
          <p className="font-semibold text-sm">No cultural experiences found for this filter.</p>
        </div>
      )}
    </div>
  );
};
