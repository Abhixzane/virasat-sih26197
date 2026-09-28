import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Compass } from 'lucide-react';
import { api } from '../services/api';
import { MapMarker } from '../types/cultural';
import { CulturalMapView } from '../components/map/CulturalMapView';
import { StatsCounterBar } from '../components/shared/TricolourBranding';
import { INDIA_ALL_STATES_AND_UTS } from '../data/indiaCitiesMaster';

interface CulturalMapPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const CulturalMapPage: React.FC<CulturalMapPageProps> = ({ onExploreRelated }) => {
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get('destination') || searchParams.get('city') || '';
  const initialMode = searchParams.get('mode') || '';
  const initialLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
  const initialLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined;
  const initialName = searchParams.get('name') || '';

  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('');

  // Auto-set state if initialDestination is a recognized state
  useEffect(() => {
    if (initialDestination) {
      const match = popularStates.find(st => st.toLowerCase() === initialDestination.toLowerCase());
      if (match && match !== 'All') {
        setSelectedState(match);
      }
    }
  }, [initialDestination]);

  useEffect(() => {
    let isMounted = true;
    const fetchMarkers = async () => {
      try {
        const data = await api.getMapLocations();
        if (isMounted) setMarkers(data);
      } catch (err) {
        console.error('Failed to load map markers:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchMarkers();
    return () => {
      isMounted = false;
    };
  }, []);

  const popularStates = [
    'All', 'Uttar Pradesh', 'Karnataka', 'Rajasthan',
    'Maharashtra', 'Tamil Nadu', 'Kerala', 'Odisha', 'Bihar', 'Delhi'
  ];

  return (
    <div className="space-y-5 pb-16">
      {/* 1. Exact Header Banner from Reference Image */}
      <section className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-amber-200/70 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[170px]">
          {/* Left Column: Geographic Intelligence Titles & Description */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-2 z-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A17]">
              <BookOpen className="w-4 h-4 text-[#C85A17] shrink-0" />
              <span>INTERACTIVE GEOGRAPHIC INTELLIGENCE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-extrabold text-[#0B1E36] tracking-tight leading-tight">
              Pan-India Cultural Heritage Map
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
              Every pin corresponds to verified geographic coordinates recorded by archaeological registries.
              Explore monuments and living artisan clusters across all 36 Indian States and Union Territories.
            </p>
          </div>

          {/* Right Column: Real-time Archaeological Photograph with Soft Light-Theme Fade */}
          <div className="lg:col-span-5 relative min-h-[175px] lg:min-h-full overflow-hidden flex items-end justify-end group">
            {/* Multi-stage light theme fade gradient scrim */}
            <div className="absolute inset-y-0 left-0 w-36 sm:w-48 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF9]/80 via-transparent to-[#FFFDF9]/30 z-10 pointer-events-none" />

            <img
              src="/hero/monument-1.jpg"
              alt="Authentic Archaeological Heritage — UNESCO World Heritage Registry"
              className="w-full h-full object-cover object-center select-none brightness-[0.98] contrast-[1.02] group-hover:scale-105 transition-transform duration-700"
            />

            {/* Real Photography Tag */}
            <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-stone-200/80 shadow-xs flex items-center gap-1.5 text-[10px] font-semibold text-stone-700 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real Archaeological Photography</span>
            </div>

            {/* Curled Bharat Tricolour Ribbon Wave at bottom-right */}
            <div className="absolute bottom-0 right-0 w-full pointer-events-none z-10">
              <svg viewBox="0 0 500 36" fill="none" preserveAspectRatio="none" className="w-full h-8 opacity-90">
                <path d="M0,36 Q250,6 500,14 L500,21 Q250,13 0,36 Z" fill="#FF6600" />
                <path d="M0,36 Q250,13 500,21 L500,28 Q250,20 0,36 Z" fill="#FFFFFF" fillOpacity="0.9" />
                <path d="M0,36 Q250,20 500,28 L500,36 Q250,28 0,36 Z" fill="#138808" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "Fly to State" Quick State Zoom Filter Bar */}
      <div className="bg-white px-4 py-2.5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 mr-1 select-none">
            <div className="w-6 h-6 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF6600]">
              <Compass className="w-3.5 h-3.5 text-[#FF6600]" />
            </div>
            <span className="text-xs font-bold text-stone-800">Fly to State:</span>
          </div>

          {popularStates.map((st) => {
            const active = (st === 'All' && !selectedState) || selectedState === st;
            return (
              <button
                key={st}
                onClick={() => setSelectedState(st === 'All' ? '' : st)}
                className={`px-3.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                  active
                    ? 'bg-[#FF6600] text-white font-semibold shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/80 font-medium'
                }`}
              >
                {st}
              </button>
            );
          })}

          {/* Complete 36 States & UTs selector */}
          <select
            value={selectedState || 'All'}
            onChange={(e) => setSelectedState(e.target.value === 'All' ? '' : e.target.value)}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200/80 border border-stone-300 text-stone-800 outline-none cursor-pointer"
            title="Select from all 28 States and 8 Union Territories"
          >
            <option value="All">More States / UTs (All 36)...</option>
            {INDIA_ALL_STATES_AND_UTS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-stone-600 font-medium ml-auto select-none">
          Showing <span className="font-bold text-[#FF6600]">{markers.length}</span> Verified Coordinates
        </div>
      </div>

      {/* 3. Map Viewport & Discovery Cards Component */}
      {loading ? (
        <div className="py-24 text-center text-stone-400 text-sm flex items-center justify-center gap-2 bg-white rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-5 h-5 border-2 border-[#FF6600] border-t-transparent rounded-full animate-spin" />
          <span>Rendering archaeological coordinates on Leaflet canvas...</span>
        </div>
      ) : (
        <CulturalMapView
          markers={markers}
          onSelectMarker={onExploreRelated}
          selectedState={selectedState}
          onSelectState={(st) => setSelectedState(st)}
          initialDestination={initialDestination}
          initialMode={initialMode}
          initialTargetPoint={initialLat && initialLng ? { lat: initialLat, lng: initialLng, name: initialName } : undefined}
        />
      )}

      {/* 4. Bottom Stats Intelligence Bar */}
      <section className="pt-2">
        <StatsCounterBar
          item1={{ count: `${markers.length}+`, label: 'Verified Map Pins' }}
          item2={{ count: '36', label: 'Covered States & UTs' }}
          item3={{ count: '100%', label: 'Strict Coordinate Accuracy' }}
          item4={{ count: 'Real-Time', label: 'Cluster Layers' }}
        />
      </section>
    </div>
  );
};
