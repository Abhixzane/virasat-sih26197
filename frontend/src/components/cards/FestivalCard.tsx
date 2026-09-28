import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bookmark } from 'lucide-react';
import { Festival } from '../../types/cultural';

interface FestivalCardProps {
  festival: Festival;
  onExploreRelated?: (type: string, id: string) => void;
  onClick?: () => void;
}

export const FestivalCard: React.FC<FestivalCardProps> = ({
  festival,
  onExploreRelated,
  onClick,
}) => {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);

  // Dynamic Category badge styles matching screenshot
  const getFestivalBadge = (name: string, cat: string) => {
    const n = name.toLowerCase();
    if (n.includes('chhath')) return { label: 'Vedic Festival', style: 'bg-emerald-800 text-white' };
    if (n.includes('durga')) return { label: 'Cultural Festival', style: 'bg-rose-900 text-white' };
    if (n.includes('onam')) return { label: 'Harvest Festival', style: 'bg-amber-600 text-white' };
    if (n.includes('kumbh')) return { label: 'Spiritual Festival', style: 'bg-orange-600 text-white' };
    return { label: cat || 'Cultural Festival', style: 'bg-amber-700 text-white' };
  };

  const badge = getFestivalBadge(festival.name, festival.category);

  return (
    <div
      onClick={onClick || (() => navigate(`/festivals/${festival.id}`))}
      className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image container */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
        <img
          src={festival.image_url}
          alt={festival.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Top-Left Category Pill */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${badge.style}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#E05A2B] shrink-0" />
            <span className="truncate">{festival.state}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-stone-900 group-hover:text-[#FF6600] transition-colors leading-snug line-clamp-1">
            {festival.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {festival.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#FF6600] group-hover:underline flex items-center gap-1">
            <span>View Celebrations</span>
            <span>→</span>
          </span>

          <div className="flex items-center gap-2">
            {onExploreRelated && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExploreRelated('festival', festival.id);
                }}
                className="text-[11px] font-medium text-stone-400 hover:text-[#FF6600] transition-colors"
                title="View Connected Traditions"
              >
                Connected
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setBookmarked(!bookmarked);
              }}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 transition-colors"
              title={bookmarked ? 'Saved' : 'Save Festival'}
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${
                  bookmarked ? 'fill-amber-600 text-amber-600' : 'stroke-[1.75]'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
