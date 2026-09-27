import React, { useState, useEffect } from 'react';
import { BookOpen, Filter } from 'lucide-react';
import { api } from '../services/api';
import { CulturalStory } from '../types/cultural';
import { StoryCard } from '../components/cards/StoryCard';

interface StoriesPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const StoriesPage: React.FC<StoriesPageProps> = ({ onExploreRelated }) => {
  const [stories, setStories] = useState<CulturalStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('All');

  useEffect(() => {
    let isMounted = true;
    const fetchStories = async () => {
      setLoading(true);
      try {
        const data = await api.getStories(
          selectedState !== 'All' ? selectedState : undefined
        );
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
  }, [selectedState]);

  const statesList = ['All', 'Bihar', 'Karnataka', 'Uttar Pradesh', 'Maharashtra', 'Odisha'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Oral Traditions, Epics & Folk Legends</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Cultural Stories & Regional Folklore
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Uncover the human stories breathing soul into India’s stones. Read about the twelve-year-old architect of Konark, Tilak’s civic mobilization through Ganeshotsav, and the solar vows of Karna along the Ganga.
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
                ? 'bg-rose-800 text-white shadow-2xs'
                : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-rose-400'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Grid of Stories */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
          <span>Retrieving living folklore from archives...</span>
        </div>
      ) : stories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('story', story.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
          <p className="font-semibold text-sm">No stories found for this filter.</p>
        </div>
      )}
    </div>
  );
};
