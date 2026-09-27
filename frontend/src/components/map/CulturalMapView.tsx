import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapMarker } from '../../types/cultural';
import { MapPin, Landmark, Navigation, Filter, List, Map as MapIcon, ShieldCheck, ArrowRight } from 'lucide-react';

interface CulturalMapViewProps {
  markers: MapMarker[];
  onSelectMarker: (type: string, id: string) => void;
  selectedState?: string;
  onSelectState?: (state: string) => void;
}

export const CulturalMapView: React.FC<CulturalMapViewProps> = ({
  markers,
  onSelectMarker,
  selectedState = '',
  onSelectState,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchFilter, setSearchFilter] = useState('');

  // Filter markers
  const filteredMarkers = markers.filter((m) => {
    if (selectedState && m.state.toLowerCase() !== selectedState.toLowerCase()) return false;
    if (activeCategory === 'heritage' && m.type !== 'heritage') return false;
    if (activeCategory === 'experience' && m.type !== 'experience') return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.state.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered over India
    const map = L.map(mapContainerRef.current, {
      center: [21.7679, 78.8718],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when filteredMarkers change
  useEffect(() => {
    if (!layerGroupRef.current || !mapInstanceRef.current) return;

    layerGroupRef.current.clearLayers();

    filteredMarkers.forEach((marker) => {
      if (Math.abs(marker.latitude) < 0.1 || Math.abs(marker.longitude) < 0.1) return;

      const isHeritage = marker.type === 'heritage';
      const markerHtml = `
        <div style="
          background-color: ${isHeritage ? '#9A3412' : '#1D4ED8'};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          cursor: pointer;
        ">
          <span style="font-size: 14px;">${isHeritage ? '🏛️' : '✨'}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-cultural-pin',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const leafletMarker = L.marker([marker.latitude, marker.longitude], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.style.width = '240px';
      popupContent.innerHTML = `
        <div style="font-family: inherit;">
          <img src="${marker.image_url}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-size: 9px; font-weight: bold; text-transform: uppercase; color: ${isHeritage ? '#9A3412' : '#1D4ED8'};">${marker.category}</div>
          <div style="font-size: 14px; font-weight: bold; color: #1C1917; margin-top: 2px;">${marker.name}</div>
          <div style="font-size: 11px; color: #78716C; margin-bottom: 6px;">${marker.city}, ${marker.state}</div>
          <div style="font-size: 11px; color: #44403C; line-height: 1.4; margin-bottom: 8px;">${marker.description}</div>
          <div style="font-size: 10px; color: #047857; font-weight: 600;">✓ ${marker.verification_status} Coordinates: ${marker.latitude.toFixed(4)}, ${marker.longitude.toFixed(4)}</div>
          <button id="view-details-btn-${marker.id}" style="
            width: 100%;
            margin-top: 8px;
            padding: 6px 10px;
            background: #9A3412;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
          ">
            Explore Heritage Connections →
          </button>
        </div>
      `;

      leafletMarker.bindPopup(popupContent);
      leafletMarker.on('popupopen', () => {
        const btn = document.getElementById(`view-details-btn-${marker.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectMarker(marker.type, marker.id);
          };
        }
      });

      leafletMarker.addTo(layerGroupRef.current!);
    });

    // Fit bounds if markers exist and viewMode is map
    if (filteredMarkers.length > 0 && mapInstanceRef.current && viewMode === 'map') {
      const validPoints = filteredMarkers
        .filter((m) => Math.abs(m.latitude) > 0.1 && Math.abs(m.longitude) > 0.1)
        .map((m) => [m.latitude, m.longitude] as [number, number]);

      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
      }
    }
  }, [filteredMarkers, viewMode, onSelectMarker]);

  return (
    <div className="flex flex-col bg-white rounded-3xl border border-stone-200 shadow-heritage overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filters */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-amber-800 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
            }`}
          >
            All Verified ({markers.length})
          </button>
          <button
            onClick={() => setActiveCategory('heritage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === 'heritage'
                ? 'bg-amber-800 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Monuments</span>
          </button>
          <button
            onClick={() => setActiveCategory('experience')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === 'experience'
                ? 'bg-amber-800 text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Cultural Walks</span>
          </button>
        </div>

        {/* Search & Toggle Mode */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter map by name or city..."
            className="text-xs px-3 py-1.5 rounded-xl bg-white border border-stone-200 outline-none focus:border-amber-600 w-44 sm:w-56"
          />

          <div className="flex items-center bg-stone-200 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'map' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List ({filteredMarkers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map or List View Container */}
      <div className="relative w-full h-[580px] bg-stone-100">
        {viewMode === 'map' ? (
          <div ref={mapContainerRef} className="w-full h-full" />
        ) : (
          <div className="w-full h-full overflow-y-auto p-6 divide-y divide-stone-100">
            {filteredMarkers.map((marker) => (
              <div
                key={marker.id}
                onClick={() => onSelectMarker(marker.type, marker.id)}
                className="py-3 flex items-start gap-4 hover:bg-amber-50/50 p-3 rounded-xl cursor-pointer transition-colors"
              >
                <img
                  src={marker.image_url}
                  alt={marker.name}
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-800 uppercase bg-amber-50 px-2 py-0.5 rounded">
                      {marker.category}
                    </span>
                    <span className="text-xs text-stone-500">
                      {marker.city}, {marker.state}
                    </span>
                    <span className="text-[11px] font-mono text-stone-400">
                      ({marker.latitude.toFixed(3)}, {marker.longitude.toFixed(3)})
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 mt-1">{marker.name}</h4>
                  <p className="text-xs text-stone-600 mt-0.5 line-clamp-2">{marker.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 self-center shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
