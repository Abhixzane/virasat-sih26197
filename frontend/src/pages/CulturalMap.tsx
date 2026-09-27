import React, { useState, useEffect } from 'react';
import { Map, ShieldCheck, Filter } from 'lucide-react';
import { api } from '../services/api';
import { MapMarker } from '../types/cultural';
import { CulturalMapView } from '../components/map/CulturalMapView';

interface CulturalMapPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const CulturalMapPage: React.FC<CulturalMapPageProps> = ({ onExploreRelated }) => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Map className="w-3.5 h-3.5" />
            <span>Interactive Geographic Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Pan-India Cultural Heritage Map
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Every pin corresponds to authentic verified geographic coordinates recorded by archaeological registries. Explore monuments and artisan experiences across all 36 Indian States and Union Territories.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-1.5 shrink-0">
          <div className="text-amber-300 font-bold uppercase text-[10px]">Verification Metrics</div>
          <div className="text-white font-medium">{markers.length} Grounded Coordinates</div>
          <div className="text-stone-300 text-[11px]">Strict AMASR Act & ASI Bounds</div>
        </div>
      </div>

      {/* Map View */}
      {loading ? (
        <div className="py-24 text-center text-stone-400 text-sm flex items-center justify-center gap-2 bg-white rounded-3xl border border-stone-200">
          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span>Rendering spatial geometry and verified cultural coordinates...</span>
        </div>
      ) : (
        <CulturalMapView
          markers={markers}
          onSelectMarker={(type, id) => onExploreRelated(type, id)}
        />
      )}
    </div>
  );
};
