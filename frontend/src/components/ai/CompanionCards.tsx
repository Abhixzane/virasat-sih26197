import React, { useState } from 'react';
import { 
  Navigation, Train, Plane, Bus, Car, MapPin, 
  Calendar, ArrowRight, ExternalLink, ShieldCheck, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { RouteCardData, PlaceCardData, UIAction } from '../../types/cultural';

interface RouteCardProps {
  data: RouteCardData;
  onNavigateAction?: (path: string, params?: Record<string, any>) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ data, onNavigateAction }) => {
  const [expanded, setExpanded] = useState(false);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'train':
        return <Train className="w-4 h-4 text-amber-600" />;
      case 'flight':
        return <Plane className="w-4 h-4 text-sky-600" />;
      case 'bus':
        return <Bus className="w-4 h-4 text-emerald-600" />;
      case 'drive':
      default:
        return <Car className="w-4 h-4 text-orange-600" />;
    }
  };

  return (
    <div className="my-3 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 text-white p-4 border border-amber-500/30 shadow-lg text-xs">
      {/* Header: Origin -> Destination */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold font-serif text-amber-300 flex items-center gap-1.5">
              <span>{data.origin}</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              <span>{data.destination}</span>
            </div>
            <div className="text-[11px] text-stone-400">
              Approx. <strong className="text-white">{data.distance_km} km</strong> • Highway: {data.highway_route || 'National Highway'}
            </div>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-[10px] border border-amber-500/30">
          ~{data.driving_time_formatted} drive
        </span>
      </div>

      {/* Transit Modes */}
      <div className="space-y-2 mb-3">
        {data.modes.map((mode, i) => (
          <div
            key={i}
            className={`p-2.5 rounded-xl border transition-all ${
              mode.is_recommended
                ? 'bg-amber-950/40 border-amber-500/50 text-stone-200'
                : 'bg-stone-900/80 border-stone-800 text-stone-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-stone-800">
                  {getModeIcon(mode.mode)}
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span>{mode.title}</span>
                    {mode.is_recommended && (
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500 text-stone-950 font-bold">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    Est. Duration: <strong className="text-stone-200">{mode.duration_formatted}</strong>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] font-bold text-amber-300">
                  {mode.estimated_fare_inr}
                </div>
              </div>
            </div>

            <div className="mt-1 text-[10px] text-stone-400 leading-normal pl-7">
              {mode.operational_details}
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Travel Tips */}
      {data.travel_tips && data.travel_tips.length > 0 && (
        <div className="border-t border-stone-800 pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-[10px] font-semibold text-stone-400 hover:text-amber-300 transition-colors"
          >
            <span>Travel Tips & Highway Guidance ({data.travel_tips.length})</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {expanded && (
            <ul className="mt-2 space-y-1 text-[10px] text-stone-300 list-disc list-inside bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
              {data.travel_tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-2 text-[9px] text-stone-500 italic flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-stone-500 shrink-0" />
        <span>{data.disclaimer}</span>
      </div>

      {/* Action Button */}
      {onNavigateAction && (
        <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-end gap-2">
          <button
            onClick={() => onNavigateAction('/cultural-map', { destination: data.destination })}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] flex items-center gap-1 transition-all"
          >
            <MapPin className="w-3 h-3" />
            <span>View {data.destination} on Cultural Map</span>
          </button>
        </div>
      )}
    </div>
  );
};

interface PlaceCardProps {
  place: PlaceCardData;
  onExplore?: (place: PlaceCardData) => void;
  onNavigateAction?: (path: string, params?: Record<string, any>) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onExplore, onNavigateAction }) => {
  return (
    <div className="my-2 rounded-xl bg-white border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row text-xs">
      {/* Thumbnail */}
      <div className="sm:w-28 h-24 sm:h-auto bg-stone-100 relative shrink-0 overflow-hidden">
        <img
          src={place.image_url || '/placeholder.jpg'}
          alt={place.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-semibold text-white uppercase tracking-wider">
          {place.type}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h4 className="font-bold font-serif text-stone-900 text-xs sm:text-sm leading-tight">
              {place.name}
            </h4>
          </div>
          <div className="text-[10px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5 shrink-0" />
            <span>{place.district ? `${place.district}, ` : ''}{place.state}</span>
          </div>
          <p className="text-stone-600 text-[11px] line-clamp-2 mt-1 leading-normal">
            {place.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-100">
          {onNavigateAction && (
            <button
              onClick={() => onNavigateAction('/cultural-map', { lat: place.latitude, lng: place.longitude, id: place.id })}
              className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-[10px] flex items-center gap-1 transition-colors"
            >
              <MapPin className="w-3 h-3 text-[#E05A2B]" />
              <span>Locate on Map</span>
            </button>
          )}

          {onNavigateAction && (
            <button
              onClick={() => onNavigateAction('/itinerary', { destination: place.state, days: 3 })}
              className="px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium text-[10px] flex items-center gap-1 transition-colors ml-auto"
            >
              <Calendar className="w-3 h-3 text-amber-600" />
              <span>Add to Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ItineraryPreviewProps {
  itinerary: any;
  onOpenItinerary?: (itinerary: any) => void;
}

export const ItineraryPreviewCard: React.FC<ItineraryPreviewProps> = ({ itinerary, onOpenItinerary }) => {
  const [expanded, setExpanded] = useState(false);
  const days = itinerary?.days || [];

  return (
    <div className="my-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3.5 shadow-xs text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#E05A2B] text-white flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold font-serif text-stone-900 text-xs sm:text-sm">
              {itinerary?.itinerary_title || `${itinerary?.destination} Heritage Plan`}
            </h4>
            <div className="text-[10px] text-stone-500">
              {itinerary?.duration_days || days.length} Days • Geospatially sequenced
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-stone-500 hover:text-stone-800 text-[10px] font-semibold flex items-center gap-1"
        >
          <span>{expanded ? 'Collapse' : 'View Days'}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      <p className="text-stone-700 text-[11px] line-clamp-2 leading-relaxed mb-2.5">
        {itinerary?.overview}
      </p>

      {/* Days Accordion */}
      {expanded && (
        <div className="space-y-2 mt-2 pt-2 border-t border-amber-200/60">
          {days.map((d: any, idx: number) => (
            <div key={idx} className="bg-white p-2.5 rounded-xl border border-stone-200">
              <div className="font-bold text-stone-800 text-[11px] text-amber-900">
                Day {d.day_number}: {d.theme}
              </div>
              <div className="text-[10px] text-stone-600 mt-1">
                {d.cultural_explanation}
              </div>
              {d.heritage_places && d.heritage_places.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {d.heritage_places.map((hp: any, hIdx: number) => (
                    <span key={hIdx} className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 text-[9px] font-medium">
                      🏛️ {hp.name.split(',')[0]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {onOpenItinerary && (
        <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex justify-end">
          <button
            onClick={() => onOpenItinerary(itinerary)}
            className="px-3 py-1.5 rounded-lg bg-[#E05A2B] hover:bg-[#c94b20] text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3 h-3" />
            <span>Open in Itinerary Synthesizer</span>
          </button>
        </div>
      )}
    </div>
  );
};

interface ActionButtonsProps {
  actions: UIAction[];
  onActionClick: (action: UIAction) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ actions, onActionClick }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {actions.map((act, i) => (
        <button
          key={i}
          onClick={() => onActionClick(act)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-[10px] shadow-xs transition-transform active:scale-95"
        >
          <ExternalLink className="w-3 h-3 text-amber-400" />
          <span>{act.label}</span>
        </button>
      ))}
    </div>
  );
};
