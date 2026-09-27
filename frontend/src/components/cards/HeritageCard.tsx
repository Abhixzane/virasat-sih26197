import React, { useState } from 'react';
import { MapPin, Sparkles, Bookmark, Check } from 'lucide-react';
import { HeritagePlace } from '../../types/cultural';

interface HeritageCardProps {
  place: HeritagePlace;
  onExploreRelated?: (type: string, id: string) => void;
  onClick?: () => void;
}

export const HeritageCard: React.FC<HeritageCardProps> = ({
  place,
  onExploreRelated,
  onClick,
}) => {
  const [bookmarked, setBookmarked] = useState(false);

  // Dynamic Category badge styles
  const getBadgeStyle = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('unesco')) return 'bg-amber-600 text-white';
    if (c.includes('fort') || c.includes('palace')) return 'bg-blue-600 text-white';
    if (c.includes('temple')) return 'bg-teal-700 text-white';
    if (c.includes('spiritual') || c.includes('sacred') || c.includes('ghat')) return 'bg-orange-600 text-white';
    if (c.includes('archaeological')) return 'bg-amber-700 text-white';
    return 'bg-amber-600 text-white';
  };

  const getCategoryLabel = (place: HeritagePlace) => {
    if (place.historical_significance?.toLowerCase().includes('unesco') || place.name.toLowerCase().includes('unesco')) {
      return 'UNESCO HERITAGE';
    }
    const c = place.category.toUpperCase();
    if (c.includes('FORT') || c.includes('PALACE')) return 'HISTORIC FORT';
    if (c.includes('TEMPLE')) return 'ANCIENT TEMPLE';
    if (c.includes('SACRED') || c.includes('GHAT')) return 'SPIRITUAL SITE';
    if (c.includes('ARCHAEOLOGICAL')) return 'ARCHAEOLOGICAL SITE';
    return 'HERITAGE MONUMENT';
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image container */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1548013146-72479768bada?w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Top-Left Category Pill */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${getBadgeStyle(
            place.category
          )}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          <span>{getCategoryLabel(place)}</span>
        </div>

        {/* Top-Right Verified Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-800 text-white text-[11px] font-semibold shadow-xs">
          <Check className="w-3 h-3 stroke-[3]" />
          <span>Verified</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#E05A2B] shrink-0" />
            <span className="truncate">
              {place.city}, {place.state}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#E05A2B] transition-colors font-serif leading-snug line-clamp-1">
            {place.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {place.description || place.historical_significance}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExploreRelated?.('heritage', place.id);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Connected Intelligence</span>
            <span>→</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(!bookmarked);
            }}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 transition-colors"
            title={bookmarked ? 'Saved' : 'Bookmark for Itinerary'}
          >
            <Bookmark
              className={`w-4 h-4 ${
                bookmarked ? 'fill-amber-600 text-amber-600' : 'stroke-[1.75]'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
