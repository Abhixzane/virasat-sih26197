import React, { useState, useEffect } from 'react';
import { Map, ShieldCheck, Filter, Compass, Landmark, Navigation } from 'lucide-react';
import { api } from '../services/api';
import { MapMarker } from '../types/cultural';
import { CulturalMapView } from '../components/map/CulturalMapView';
import {
  TricolourRibbonWave, MonumentSkyline, StatsCounterBar
} from '../components/shared/TricolourBranding';

interface CulturalMapPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const CulturalMapPage: React.FC<CulturalMapPageProps> = ({ onExploreRelated }) => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('');

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
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-stone-200/90 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="absolute top-0 inset-x-0 h-40 overflow-hidden pointer-events-none opacity-20 text-[#D4AF37]">
          <MonumentSkyline opacity={0.2} />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#E05A2B]">
            <Map className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>INTERACTIVE GEOGRAPHIC INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-900 leading-tight">
            Pan-India Cultural Heritage Map
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            Every pin corresponds to verified geographic coordinates recorded by archaeological registries.
            Explore monuments and living artisan clusters across all 36 Indian States and Union Territories.
          </p>
        </div>

        <div className="pt-6">
          <TricolourRibbonWave />
        </div>
      </section>

      {/* 2. Quick State Zoom Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#E05A2B]" /> Fly to State:
          </span>
          {popularStates.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st === 'All' ? '' : st)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                (st === 'All' && !selectedState) || selectedState === st
                  ? 'bg-[#E05A2B] text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 border border-stone-200/80 hover:bg-stone-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Showing <span className="font-bold text-stone-900">{markers.length}</span> Verified Coordinates
        </div>
      </div>

      {/* 3. Fullscreen Map View */}
      {loading ? (
        <div className="py-24 text-center text-stone-400 text-sm flex items-center justify-center gap-2 bg-white rounded-3xl border border-stone-200">
          <div className="w-5 h-5 border-2 border-[#E05A2B] border-t-transparent rounded-full animate-spin" />
          <span>Rendering archaeological coordinates on Leaflet canvas...</span>
        </div>
      ) : (
        <div className="h-[650px] rounded-3xl overflow-hidden border border-stone-200 shadow-md relative">
          <CulturalMapView
            markers={markers}
            onSelectMarker={onExploreRelated}
            selectedState={selectedState}
            onSelectState={(st) => setSelectedState(st)}
          />
        </div>
      )}

      {/* 4. Stats Bar */}
      <section>
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
