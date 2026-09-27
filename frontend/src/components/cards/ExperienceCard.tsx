import React from 'react';
import { Navigation, MapPin, Sparkles, Clock, ShieldCheck } from 'lucide-react';
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
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-[#EFE8DF] overflow-hidden shadow-heritage hover:shadow-heritage-hover transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden bg-stone-100">
        <img
          src={experience.image_url}
          alt={experience.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-blue-900 shadow-xs">
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>{experience.category}</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-medium">{experience.city}, {experience.state}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs text-[11px]">
            <Clock className="w-3 h-3 text-stone-300" />
            <span>{experience.duration}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-stone-900 group-hover:text-blue-900 transition-colors line-clamp-1 font-serif">
            {experience.name}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mt-2">
            {experience.description}
          </p>

          <div className="mt-3 text-[11px] text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-200/60">
            <span className="font-semibold text-stone-700">Significance:</span> {experience.cultural_significance}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExploreRelated?.('experience', experience.id);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-900 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg border border-indigo-200 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>Connected Intelligence</span>
          </button>
        </div>
      </div>
    </div>
  );
};
