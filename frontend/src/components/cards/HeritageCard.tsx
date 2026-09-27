import React from 'react';
import { Landmark, MapPin, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
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
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-[#EFE8DF] overflow-hidden shadow-heritage hover:shadow-heritage-hover transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image with Category Badge & Verification */}
      <div className="relative h-52 overflow-hidden bg-stone-100">
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-amber-900 shadow-xs">
          <Landmark className="w-3.5 h-3.5 text-amber-700" />
          <span>{place.category}</span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-[10px] font-semibold text-emerald-300 border border-emerald-500/40">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>{place.verification_status}</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium">{place.city}, {place.state}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1 font-serif">
            {place.name}
          </h3>

          <div className="text-[11px] font-medium text-stone-500 mt-1 mb-2">
            <span className="font-semibold text-stone-700">{place.architectural_style}</span> • {place.historical_period}
          </div>

          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExploreRelated?.('heritage', place.id);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-900 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg border border-indigo-200 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>Connected Intelligence</span>
          </button>

          {place.source_url && (
            <a
              href={place.source_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-stone-400 hover:text-stone-700 transition-colors"
              title="Official Heritage Source"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
