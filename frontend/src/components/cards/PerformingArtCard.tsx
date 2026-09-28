import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, MapPin, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { PerformingArt } from '../../types/cultural';

interface PerformingArtCardProps {
  art: PerformingArt;
  onExploreRelated?: (type: string, id: string) => void;
  onClick?: () => void;
}

export const PerformingArtCard: React.FC<PerformingArtCardProps> = ({
  art,
  onExploreRelated,
  onClick,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={onClick || (() => navigate(`/performing-arts/${art.id}`))}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative h-52 overflow-hidden bg-stone-100">
        <img
          src={art.image_url}
          alt={art.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-amber-900 shadow-xs">
          <Music className="w-3.5 h-3.5 text-[#E05A2B]" />
          <span>{art.category}</span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-[10px] font-semibold text-emerald-300 border border-emerald-500/40">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>{art.verification_status}</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-[#E05A2B] shrink-0" />
            <span className="font-medium">{art.origin}, {art.state}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#E05A2B] transition-colors line-clamp-1 font-serif">
            {art.name}
          </h3>

          <div className="text-[11px] font-medium text-stone-500 mt-1 mb-2">
            <span className="font-semibold text-stone-700">Style:</span> {art.performance_style}
          </div>

          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
            {art.description}
          </p>

          {art.instruments && art.instruments.length > 0 && (
            <div className="mt-3 text-[11px] text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-200/60">
              <span className="font-semibold text-stone-700">Instruments:</span> {art.instruments.join(', ')}
            </div>
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExploreRelated?.('performing_art', art.id);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>Connected Traditions</span>
            <span>→</span>
          </button>

          {art.source_url && (
            <a
              href={art.source_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-stone-400 hover:text-stone-700 transition-colors"
              title="Official Art Source"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
