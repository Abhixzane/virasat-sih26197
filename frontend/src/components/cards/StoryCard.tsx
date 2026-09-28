import React from 'react';
import { BookOpen, MapPin, Sparkles } from 'lucide-react';
import { CulturalStory } from '../../types/cultural';

interface StoryCardProps {
  story: CulturalStory;
  onExploreRelated?: (type: string, id: string) => void;
  onClick?: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onExploreRelated,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-[#EFE8DF] overflow-hidden shadow-heritage hover:shadow-heritage-hover transition-all duration-300 flex flex-col p-6 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-[11px] font-bold text-rose-800 border border-rose-200">
          <BookOpen className="w-3.5 h-3.5 text-rose-600" />
          <span>{story.story_category}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>{story.state} ({story.region})</span>
        </div>
      </div>

      <h3 className="text-base font-bold text-stone-900 group-hover:text-[#FF6600] transition-colors mb-2 line-clamp-1">
        {story.title}
      </h3>

      <p className="text-xs text-stone-600 line-clamp-4 leading-relaxed italic border-l-2 border-amber-300 pl-3 mb-4">
        &ldquo;{story.narrative}&rdquo;
      </p>

      {story.cultural_significance && (
        <div className="text-[11px] text-stone-500 mb-4 bg-stone-50 p-2 rounded-lg">
          <span className="font-semibold text-stone-700">Cultural Meaning:</span> {story.cultural_significance}
        </div>
      )}

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExploreRelated?.('story', story.id);
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-900 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg border border-indigo-200 transition-colors"
        >
          <Sparkles className="w-3 h-3 text-indigo-600" />
          <span>Connected Heritage</span>
        </button>
      </div>
    </div>
  );
};
