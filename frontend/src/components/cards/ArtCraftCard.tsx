import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Sparkles, ExternalLink, Award } from 'lucide-react';
import { ArtCraft } from '../../types/cultural';

interface ArtCraftCardProps {
  art: ArtCraft;
  onExploreRelated?: (type: string, id: string) => void;
  onClick?: () => void;
}

export const ArtCraftCard: React.FC<ArtCraftCardProps> = ({
  art,
  onExploreRelated,
  onClick,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={onClick || (() => navigate(`/arts-crafts/${art.id}`))}
      className="group bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* 1. Visual Card Header with Photo & Badges */}
      <div className="relative h-56 overflow-hidden bg-stone-100">
        <img
          src={art.image_url}
          alt={art.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800';
          }}
        />
        {/* Scrim overlay for location readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

        {/* Top-Left Category Badge with exact teal vector icon */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-semibold text-stone-800 shadow-2xs border border-stone-200/50">
          <Sparkles className="w-3.5 h-3.5 text-teal-700 shrink-0" />
          <span className="truncate max-w-[180px]">{art.craft_category}</span>
        </div>

        {/* Top-Right GI Tagged Badge */}
        {art.gi_status && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/85 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/40 shadow-xs">
            <Award className="w-3 h-3 text-amber-400" />
            <span>GI Tagged</span>
          </div>
        )}

        {/* Bottom-Left Origin Geolocation Pin */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center text-white text-xs drop-shadow-md font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{art.origin || 'Heritage Cluster'}, {art.state}</span>
          </div>
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900 group-hover:text-[#FF6600] transition-colors line-clamp-1 leading-snug">
            {art.name}
          </h3>

          <div className="text-xs text-stone-500 font-medium mt-1">
            <span className="font-bold text-stone-800">Artisan Guild:</span>{' '}
            <span className="text-stone-700">{art.artisan_name || 'Traditional Master Guild'}</span>
          </div>

          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mt-2">
            {art.description}
          </p>

          <div className="mt-3 text-[11px] text-stone-600 bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60 leading-relaxed">
            <span className="font-bold text-stone-800">Materials:</span>{' '}
            <span className="text-stone-600">
              {art.materials_used || 'Natural plant dyes, native timber, non-toxic mineral pigments'}
            </span>
          </div>
        </div>

        {/* 3. Action Buttons Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExploreRelated?.('art_craft', art.id);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition-all cursor-pointer group-hover:shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Learn More →</span>
          </button>

          <a
            href={art.source_url || 'https://search.ipindia.gov.in/GIRPublic/'}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-stone-400 hover:text-[#FF6600] transition-colors p-1"
            title="Official Craft Registry Source"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
