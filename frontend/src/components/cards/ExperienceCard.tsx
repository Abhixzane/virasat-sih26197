import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  return (
    <div
      onClick={onClick || (() => navigate(`/experiences/${experience.id}`))}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
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

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-emerald-900 shadow-xs">
          <Navigation className="w-3.5 h-3.5 text-emerald-700" />
          <span>{experience.category}</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-[#E05A2B] shrink-0" />
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
          <h3 className="text-base font-bold text-stone-900 group-hover:text-[#E05A2B] transition-colors line-clamp-1 font-serif">
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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Connected Traditions</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
