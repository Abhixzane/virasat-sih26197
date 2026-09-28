import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, MapPin, Sparkles, Clock, ShieldCheck, ExternalLink, Compass } from 'lucide-react';
import { CulturalExperience } from '../../types/cultural';

interface ExperienceCardProps {
  experience: CulturalExperience;
  onExploreRelated?: (type: string, id: string) => void;
  onClick?: () => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  onExploreRelated,
  onClick,
}) => {
  const navigate = useNavigate();

  // Dynamic context-aware authentic local image fallback
  const getFallbackImage = () => {
    const cat = (experience.category || '').toLowerCase();
    if (cat.includes('craft') || cat.includes('artisan') || cat.includes('workshop')) {
      return '/craft-agra-marble.jpg';
    }
    if (cat.includes('spiritual') || cat.includes('dawn') || cat.includes('meditation')) {
      return '/festivals/ganga-aarti.jpg';
    }
    return '/hero/monument-4.jpg';
  };

  const mapsQuery = `${experience.name}, ${experience.city}, ${experience.state}`;

  return (
    <div
      onClick={onClick || (() => navigate(`/experiences/${experience.id}`))}
      className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-lg hover:border-amber-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden bg-stone-100">
        <img
          src={experience.image_url}
          alt={experience.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getFallbackImage();
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-amber-950 shadow-xs border border-amber-200/60">
          <Navigation className="w-3 h-3 text-[#E05A2B]" />
          <span>{experience.category}</span>
        </div>

        {/* Verified Protocol Stamp */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-900/85 backdrop-blur-xs text-[10px] font-semibold text-emerald-100 shadow-xs">
          <ShieldCheck className="w-3 h-3 text-emerald-300" />
          <span>Field Verified</span>
        </div>

        {/* Location & Duration info on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-[#FF6600] shrink-0" />
            <span className="font-medium">{experience.city}, {experience.state}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs text-[11px] text-stone-200">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>{experience.duration}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold font-serif text-stone-900 group-hover:text-[#E05A2B] transition-colors line-clamp-1">
            {experience.name}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mt-2">
            {experience.description}
          </p>

          <div className="mt-3 text-[11px] text-stone-700 bg-[#FFFDF9] p-2.5 rounded-xl border border-amber-200/70 space-y-0.5">
            <span className="font-bold text-amber-900 block">Curator Field Note:</span>
            <p className="text-stone-600 line-clamp-2 italic">{experience.cultural_significance}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExploreRelated?.('experience', experience.id);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-200 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Traditions</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/cultural-map?city=${encodeURIComponent(experience.city)}&state=${encodeURIComponent(experience.state)}`);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 px-2.5 py-1.5 rounded-lg border border-stone-200 transition-colors"
              title="Locate on Pan-India Cultural Map"
            >
              <Compass className="w-3 h-3 text-stone-500" />
              <span>Map</span>
            </button>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-[#E05A2B] hover:bg-[#c9491d] px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors"
              title="Open directions in Google Maps"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Directions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

