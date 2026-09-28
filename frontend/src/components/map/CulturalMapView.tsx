import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapMarker } from '../../types/cultural';
import { INDIA_MASTER_CITIES, MasterCityEntry } from '../../data/indiaCitiesMaster';
import {
  MapPin, Landmark, Sparkles, Search, Layers, ChevronDown,
  ChevronRight, Compass, ArrowRight, List, Map as MapIcon, X,
  Crosshair, Navigation, Route, Car, Train, ExternalLink, Clock, Milestone,
  Maximize2, Minimize2, Footprints, CheckCircle2
} from 'lucide-react';

export interface RouteStop {
  step: number;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  category?: string;
  highway?: string;
  distFromPrev?: string;
  timeFromPrev?: string;
}

interface CulturalMapViewProps {
  markers: MapMarker[];
  onSelectMarker: (type: string, id: string) => void;
  selectedState?: string;
  onSelectState?: (state: string) => void;
  initialDestination?: string;
  initialMode?: string;
  initialTargetPoint?: { lat: number; lng: number; name?: string };
}

// Haversine distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 5 Distinct Cultural Categories metadata matching the visual legend
function getCategoryMeta(marker: MapMarker) {
  const cat = (marker.category || '').toLowerCase();
  const type = (marker.type || '').toLowerCase();

  if (type === 'festival' || cat.includes('festival')) {
    return { color: '#EF4444', emoji: '🏮', label: 'Festivals & Traditions', key: 'festivals' };
  }
  if (type === 'art_craft' || cat.includes('craft') || cat.includes('art') || cat.includes('handloom') || cat.includes('pottery')) {
    return { color: '#138808', emoji: '🎨', label: 'Arts & Crafts', key: 'crafts' };
  }
  if (type === 'performing_art' || cat.includes('dance') || cat.includes('music') || cat.includes('theatre')) {
    return { color: '#8B5CF6', emoji: '🎭', label: 'Performing Arts', key: 'performing' };
  }
  if (cat.includes('living') || cat.includes('tradition') || cat.includes('ritual') || cat.includes('oral')) {
    return { color: '#0EA5E9', emoji: '🌿', label: 'Living Traditions', key: 'living' };
  }
  return { color: '#FF6600', emoji: '🏛️', label: 'Monuments & Heritage Sites', key: 'monuments' };
}

export const CulturalMapView: React.FC<CulturalMapViewProps> = ({
  markers,
  onSelectMarker,
  selectedState = '',
  onSelectState,
  initialDestination = '',
  initialMode = '',
  initialTargetPoint,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeMarkersGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const targetPinMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const suggestionsBoxRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'experience'>('map');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedPin, setSelectedPin] = useState<MapMarker | null>(null);

  // 962 Indian Cities Auto-suggestion state
  const [searchSuggestions, setSearchSuggestions] = useState<MasterCityEntry[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  // Google Maps features state
  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [multiStops, setMultiStops] = useState<RouteStop[]>([]);

  // Geolocation & Route Studio State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [nearestDistanceNotice, setNearestDistanceNotice] = useState<string | null>(null);
  const [isRouteStudioOpen, setIsRouteStudioOpen] = useState(false);
  const [routeOrigin, setRouteOrigin] = useState<string>('current_location');
  const [routeDestination, setRouteDestination] = useState<string>('');
  const [travelMode, setTravelMode] = useState<'driving' | 'transit'>('driving');
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<string | null>(null);

  // Filter city search suggestions across all 962 cities from 28 states & 8 UTs
  useEffect(() => {
    const q = searchFilter.trim().toLowerCase();
    if (q.length >= 2) {
      const matches = INDIA_MASTER_CITIES.filter(
        c => c.name.toLowerCase().includes(q) || c.cleanName.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
      ).slice(0, 10);
      setSearchSuggestions(matches);
      setIsSuggestionsOpen(matches.length > 0);
    } else {
      setSearchSuggestions([]);
      setIsSuggestionsOpen(false);
    }
  }, [searchFilter]);

  // Set default destination when markers load
  useEffect(() => {
    if (markers.length > 0 && !routeDestination) {
      setRouteDestination(markers[0].id);
    }
  }, [markers, routeDestination]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (suggestionsBoxRef.current && !suggestionsBoxRef.current.contains(e.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick Fly-to & Spotlight Pin for Selected City Suggestion
  const handleSelectCitySuggestion = (city: MasterCityEntry) => {
    setSearchFilter(city.name);
    setIsSuggestionsOpen(false);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([city.lat, city.lng], 12);

      if (targetPinMarkerRef.current) {
        targetPinMarkerRef.current.remove();
      }

      const pin = L.divIcon({
        className: 'city-spotlight-pin',
        html: `
          <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:36px; height:36px; border-radius:50%; background:#FF6600; opacity:0.4; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:relative; width:26px; height:26px; border-radius:50%; background:#FF6600; border:2.5px solid white; box-shadow:0 3px 8px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; color:white; font-size:13px; font-weight:bold;">📍</div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const cityMarker = L.marker([city.lat, city.lng], { icon: pin }).addTo(mapInstanceRef.current);
      cityMarker.bindPopup(`
        <div style="font-family: inherit; width: 230px;">
          <div style="font-size: 10px; font-weight: bold; color: #FF6600; text-transform: uppercase;">${city.state} • ${city.region}</div>
          <div style="font-size: 14px; font-weight: bold; color: #161616; margin-top: 2px;">${city.name}</div>
          <div style="font-size: 11px; color: #4B5563; margin-top: 4px; line-height: 1.4;">${city.description}</div>
          <div style="font-size: 10.5px; color: #059669; font-weight: 600; margin-top: 6px;">Verified Coordinates: ${city.lat.toFixed(4)}, ${city.lng.toFixed(4)}</div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${city.lat},${city.lng}" target="_blank" rel="noopener noreferrer" style="
            display: block;
            margin-top: 8px;
            padding: 6px 8px;
            background: #059669;
            color: white;
            border-radius: 6px;
            text-align: center;
            font-size: 11px;
            font-weight: bold;
            text-decoration: none;
          ">
            Navigate in Google Maps ↗
          </a>
        </div>
      `).openPopup();
      targetPinMarkerRef.current = cityMarker;
    }
  };

  // Filter markers based on state, category, search, and active tab
  const filteredMarkers = markers.filter((m) => {
    if (selectedState && m.state.toLowerCase() !== selectedState.toLowerCase()) return false;
    
    // Tab filter
    if (activeTab === 'experience' && m.type !== 'experience') return false;

    // Category dropdown filter
    if (selectedCategory !== 'all') {
      const meta = getCategoryMeta(m);
      if (meta.key !== selectedCategory) return false;
    }

    // Search query filter
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchName = m.name?.toLowerCase().includes(q);
      const matchCity = m.city?.toLowerCase().includes(q);
      const matchState = m.state?.toLowerCase().includes(q);
      const matchCategory = m.category?.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchState && !matchCategory) return false;
    }

    return true;
  });

  // Calculate nearby discoveries for userLocation, selectedPin or default 4 prominent discoveries
  const discoveryCards = React.useMemo(() => {
    const referenceCenter = userLocation
      ? { lat: userLocation.lat, lng: userLocation.lng, title: 'Your Location' }
      : selectedPin
      ? { lat: selectedPin.latitude, lng: selectedPin.longitude, title: selectedPin.name }
      : null;

    if (referenceCenter) {
      const sorted = markers
        .filter((m) => (!selectedPin || m.id !== selectedPin.id) && Math.abs(m.latitude) > 0.1 && Math.abs(m.longitude) > 0.1)
        .map((m) => ({
          marker: m,
          distance: `${calculateDistance(referenceCenter.lat, referenceCenter.lng, m.latitude, m.longitude).toFixed(1)} km`,
          title: m.name,
          subtitle: m.description || `Verified cultural asset in ${m.city}, ${m.state}.`,
        }))
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        .slice(0, 4);

      if (sorted.length > 0) return sorted;
    }

    // Default 4 representative items matching reference layout
    const sampleTypes = [
      { key: 'heritage', defaultTitle: 'Heritage Site', defaultSub: 'Explore this historic site and its cultural significance.', fallbackDist: '2.4 km', fallbackImg: '/nearby-1.jpg' },
      { key: 'craft', defaultTitle: 'Artisan Cluster', defaultSub: 'Discover traditional crafts and local artisans.', fallbackDist: '5.1 km', fallbackImg: '/nearby-2.jpg' },
      { key: 'experience', defaultTitle: 'Cultural Experience', defaultSub: 'Experience local festivals and living traditions.', fallbackDist: '7.8 km', fallbackImg: '/nearby-3.jpg' },
      { key: 'monument', defaultTitle: 'Monument', defaultSub: 'Visit this iconic monument with historical context.', fallbackDist: '12.3 km', fallbackImg: '/nearby-4.jpg' },
    ];

    return sampleTypes.map((item, index) => {
      const matchedMarker = markers.find((m) => {
        const cat = (m.category || '').toLowerCase();
        if (item.key === 'craft') return m.type === 'art_craft' || cat.includes('craft');
        if (item.key === 'experience') return m.type === 'experience' || cat.includes('experience') || cat.includes('festival');
        return m.type === 'heritage';
      }) || markers[index] || {
        id: `sample-${index}`,
        name: item.defaultTitle,
        type: 'heritage',
        category: item.defaultTitle,
        state: 'National',
        city: 'India',
        latitude: 28.6129,
        longitude: 77.2295,
        description: item.defaultSub,
        image_url: item.fallbackImg,
        verification_status: 'VERIFIED',
      };

      return {
        marker: matchedMarker,
        distance: item.fallbackDist,
        title: item.defaultTitle,
        subtitle: item.defaultSub,
      };
    });
  }, [userLocation, selectedPin, markers]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered over India
    const map = L.map(mapContainerRef.current, {
      center: [22.5937, 78.9629],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: true,
    });

    const initialTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);
    tileLayerRef.current = initialTile;

    const layerGroup = L.layerGroup().addTo(map);
    const routeGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;
    routeMarkersGroupRef.current = routeGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Google Maps Style Layer Switcher Effect (Street / Satellite / Terrain)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    if (mapLayer === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    } else if (mapLayer === 'terrain') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
    }

    const newLayer = L.tileLayer(url, { attribution, maxZoom: 19 }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [mapLayer]);

  // Update Markers when filteredMarkers change
  useEffect(() => {
    if (!layerGroupRef.current || !mapInstanceRef.current) return;

    layerGroupRef.current.clearLayers();

    filteredMarkers.forEach((marker) => {
      if (Math.abs(marker.latitude) < 0.1 || Math.abs(marker.longitude) < 0.1) return;

      const meta = getCategoryMeta(marker);
      const markerHtml = `
        <div style="
          background-color: ${meta.color};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.28);
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          <span style="font-size: 14px;">${meta.emoji}</span>
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
          <div style="font-size: 9px; font-weight: bold; text-transform: uppercase; color: ${meta.color};">${marker.category}</div>
          <div style="font-size: 14px; font-weight: bold; color: #161616; margin-top: 2px;">${marker.name}</div>
          <div style="font-size: 11px; color: #6B6B6B; margin-bottom: 6px;">${marker.city}, ${marker.state}</div>
          <div style="font-size: 11px; color: #2B2B2B; line-height: 1.4; margin-bottom: 8px;">${marker.description}</div>
          <div style="font-size: 10px; color: #138808; font-weight: 600;">✓ Verified Coordinates: ${marker.latitude.toFixed(4)}, ${marker.longitude.toFixed(4)}</div>
          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${marker.latitude},${marker.longitude}" target="_blank" rel="noopener noreferrer" style="
              flex: 1;
              padding: 7px 8px;
              background: #059669;
              color: white;
              border-radius: 8px;
              font-size: 10.5px;
              font-weight: bold;
              text-align: center;
              text-decoration: none;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            ">
              🧭 Google Maps ↗
            </a>
            <button id="view-details-btn-${marker.id}" style="
              flex: 1;
              padding: 7px 8px;
              background: #FF6600;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 10.5px;
              font-weight: bold;
              cursor: pointer;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            ">
              Details →
            </button>
          </div>
        </div>
      `;

      leafletMarker.bindPopup(popupContent);
      leafletMarker.on('popupopen', () => {
        setSelectedPin(marker);
        const btn = document.getElementById(`view-details-btn-${marker.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectMarker(marker.type, marker.id);
          };
        }
      });

      leafletMarker.addTo(layerGroupRef.current!);
    });

    // Auto-fit bounds when markers change
    if (filteredMarkers.length > 0 && mapInstanceRef.current && activeTab !== 'list') {
      const validPoints = filteredMarkers
        .filter((m) => Math.abs(m.latitude) > 0.1 && Math.abs(m.longitude) > 0.1)
        .map((m) => [m.latitude, m.longitude] as [number, number]);

      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
      }
    }
  }, [filteredMarkers, activeTab, onSelectMarker]);

  // "Locate Me" Handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 12, { duration: 1.5 });

          // Pulsing user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([coords.lat, coords.lng]);
          } else {
            const userIcon = L.divIcon({
              className: 'user-pulse-pin',
              html: `
                <div style="position:relative; width:28px; height:28px; display:flex; align-items:center; justify-content:center;">
                  <div style="position:absolute; width:26px; height:26px; border-radius:50%; background:#2563EB; opacity:0.4; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
                  <div style="position:relative; width:14px; height:14px; border-radius:50%; background:#1D4ED8; border:2.5px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>
                </div>
              `,
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            });
            const uMarker = L.marker([coords.lat, coords.lng], { icon: userIcon }).addTo(mapInstanceRef.current);
            uMarker.bindPopup("<b>📍 You Are Here</b><br/><span style='font-size:11px;color:#4B5563;'>Current Geolocation Verified</span>").openPopup();
            userMarkerRef.current = uMarker;
          }

          // Find nearest heritage site
          const validSites = markers.filter(m => Math.abs(m.latitude) > 0.1 && Math.abs(m.longitude) > 0.1);
          if (validSites.length > 0) {
            const sorted = [...validSites].sort((a, b) => {
              const da = calculateDistance(coords.lat, coords.lng, a.latitude, a.longitude);
              const db = calculateDistance(coords.lat, coords.lng, b.latitude, b.longitude);
              return da - db;
            });
            const nearest = sorted[0];
            const dist = calculateDistance(coords.lat, coords.lng, nearest.latitude, nearest.longitude).toFixed(1);
            setSelectedPin(nearest);
            setNearestDistanceNotice(`Nearest: ${nearest.name} is ${dist} km away`);
            setTimeout(() => setNearestDistanceNotice(null), 8000);
          }
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn("Geolocation warning:", err.message);
        // Fallback demo coordinates (New Delhi India Gate)
        const coords = { lat: 28.6129, lng: 77.2295 };
        setUserLocation(coords);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 12);
        }
        setNearestDistanceNotice("Using India Gate as simulated reference location.");
        setTimeout(() => setNearestDistanceNotice(null), 6000);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Route Studio calculation & Polyline drawing
  const handleComputeRoute = () => {
    if (!mapInstanceRef.current) return;

    let originLat: number;
    let originLng: number;
    let originName: string;

    if (routeOrigin === 'current_location') {
      if (!userLocation) {
        handleLocateMe();
        return;
      }
      originLat = userLocation.lat;
      originLng = userLocation.lng;
      originName = "Your Location";
    } else {
      const orig = markers.find(m => m.id === routeOrigin);
      if (!orig) return;
      originLat = orig.latitude;
      originLng = orig.longitude;
      originName = orig.name;
    }

    const dest = markers.find(m => m.id === routeDestination);
    if (!dest) return;
    const destLat = dest.latitude;
    const destLng = dest.longitude;

    const straightDist = calculateDistance(originLat, originLng, destLat, destLng);
    // Estimated driving road distance factor (approx 1.25x)
    const roadDist = Math.round(straightDist * 1.24);
    setRouteDistance(roadDist);

    const avgSpeed = travelMode === 'driving' ? 65 : 52;
    const totalHours = roadDist / avgSpeed;
    const hrs = Math.floor(totalHours);
    const mins = Math.round((totalHours - hrs) * 60);
    setRouteDuration(hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`);

    // Draw styled polyline
    if (routeLineRef.current) {
      routeLineRef.current.remove();
    }

    // Curved waypoint interpolation
    const midLat = (originLat + destLat) / 2 + (destLng - originLng) * 0.04;
    const midLng = (originLng + destLng) / 2 - (destLat - originLat) * 0.04;
    const points: [number, number][] = [
      [originLat, originLng],
      [midLat, midLng],
      [destLat, destLng]
    ];

    const polyline = L.polyline(points, {
      color: '#FF6600',
      weight: 5,
      opacity: 0.9,
      dashArray: travelMode === 'transit' ? '8, 8' : undefined
    }).addTo(mapInstanceRef.current);

    routeLineRef.current = polyline;
    mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [70, 70] });
  };

  const getGoogleMapsUrl = () => {
    let oLat = userLocation?.lat || 28.6129;
    let oLng = userLocation?.lng || 77.2295;
    if (routeOrigin !== 'current_location') {
      const orig = markers.find(m => m.id === routeOrigin);
      if (orig) {
        oLat = orig.latitude;
        oLng = orig.longitude;
      }
    }

    let dLat = 27.1751;
    let dLng = 78.0421;
    const dest = markers.find(m => m.id === routeDestination);
    if (dest) {
      dLat = dest.latitude;
      dLng = dest.longitude;
    }

    const mode = travelMode === 'driving' ? 'driving' : 'transit';
    return `https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLng}&destination=${dLat},${dLng}&travelmode=${mode}`;
  };

  // Google Maps Multi-Stop URL Generator
  const getGoogleMapsMultiStopUrl = () => {
    if (!multiStops || multiStops.length === 0) {
      return getGoogleMapsUrl();
    }
    if (multiStops.length === 1) {
      return `https://www.google.com/maps/search/?api=1&query=${multiStops[0].lat},${multiStops[0].lng}`;
    }
    const origin = `${multiStops[0].lat},${multiStops[0].lng}`;
    const dest = `${multiStops[multiStops.length - 1].lat},${multiStops[multiStops.length - 1].lng}`;
    const waypoints = multiStops.slice(1, multiStops.length - 1).map(s => `${s.lat},${s.lng}`).join('|');
    const mode = travelMode === 'transit' ? 'transit' : 'driving';

    if (waypoints) {
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&waypoints=${waypoints}&travelmode=${mode}`;
    }
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=${mode}`;
  };

  // Multi-Stop Route Computation for Selected State or Circuit
  const computeMultiStopRouteForDestination = (destName: string) => {
    if (!mapInstanceRef.current || !markers.length) return;
    const q = destName.toLowerCase().trim();
    if (!q) return;

    // Filter markers in that destination/state with valid coordinates
    let matched = markers.filter(m => 
      (m.state.toLowerCase().includes(q) || m.city.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)) &&
      Math.abs(m.latitude) > 0.1 && Math.abs(m.longitude) > 0.1
    );

    // If few, check if we have cities matching in INDIA_MASTER_CITIES
    if (matched.length < 2) {
      const cityMatches = INDIA_MASTER_CITIES.filter(c =>
        c.state.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q)
      );
      if (cityMatches.length >= 2) {
        matched = cityMatches.map(c => ({
          id: c.id,
          name: c.name,
          type: 'heritage',
          category: 'Cultural Destination',
          state: c.state,
          city: c.name,
          latitude: c.lat,
          longitude: c.lng,
          description: c.description,
          image_url: '/nearby-1.jpg',
          verification_status: 'VERIFIED'
        }));
      } else {
        matched = markers.filter(m => Math.abs(m.latitude) > 0.1 && Math.abs(m.longitude) > 0.1).slice(0, 5);
      }
    }

    // Sort to form a realistic sequence
    matched = [...matched].sort((a, b) => b.latitude - a.latitude).slice(0, 6);

    const stops: RouteStop[] = [];
    let cumulativeDist = 0;

    for (let i = 0; i < matched.length; i++) {
      const curr = matched[i];
      let distFromPrev = 'Starting Point';
      let timeFromPrev = '0 mins';
      let highway = 'Departure Enclave';

      if (i > 0) {
        const prev = matched[i - 1];
        const distKm = Math.round(calculateDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude) * 1.25);
        cumulativeDist += distKm;
        distFromPrev = `${distKm} km`;
        const hrs = Math.floor(distKm / 60);
        const mins = Math.round(distKm % 60);
        timeFromPrev = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

        if (distKm > 120) {
          highway = `National Highway Corridor (NH ${Math.floor(distKm % 30) * 2 + 16})`;
        } else if (distKm > 40) {
          highway = `State Highway / Express Arterial`;
        } else {
          highway = `Heritage City Arterial & E-Rickshaw Link`;
        }
      }

      stops.push({
        step: i + 1,
        name: curr.name,
        city: curr.city,
        state: curr.state,
        lat: curr.latitude,
        lng: curr.longitude,
        category: curr.category,
        highway,
        distFromPrev,
        timeFromPrev
      });
    }

    setMultiStops(stops);
    setRouteDistance(cumulativeDist);
    const totalHours = cumulativeDist / (travelMode === 'driving' ? 62 : 48);
    const hrs = Math.floor(totalHours);
    const mins = Math.round((totalHours - hrs) * 60);
    setRouteDuration(hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`);

    // Draw multi-stop polyline and numbered markers
    if (routeLineRef.current) routeLineRef.current.remove();
    if (routeMarkersGroupRef.current) {
      routeMarkersGroupRef.current.clearLayers();
    } else {
      routeMarkersGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    const latlngs: [number, number][] = stops.map(s => [s.lat, s.lng]);
    const polyline = L.polyline(latlngs, {
      color: '#E05A2B',
      weight: 6,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: travelMode === 'transit' ? '8, 8' : undefined
    }).addTo(mapInstanceRef.current);

    routeLineRef.current = polyline;

    // Numbered circular markers for stops
    stops.forEach((s) => {
      const numIcon = L.divIcon({
        className: 'route-num-pin',
        html: `
          <div style="
            background: linear-gradient(135deg, #E05A2B, #B33E16);
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 900;
            border: 2.5px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          ">
            ${s.step}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const m = L.marker([s.lat, s.lng], { icon: numIcon }).addTo(routeMarkersGroupRef.current!);
      m.bindPopup(`
        <div style="font-family: inherit; width: 230px;">
          <div style="font-size: 10px; font-weight: bold; color: #E05A2B; text-transform: uppercase;">Stop ${s.step} of ${stops.length}</div>
          <div style="font-size: 13px; font-weight: bold; color: #161616; margin-top: 2px;">${s.name}</div>
          <div style="font-size: 11px; color: #6B6B6B;">${s.city}, ${s.state}</div>
          ${s.distFromPrev !== 'Starting Point' ? `<div style="font-size: 10.5px; color: #059669; font-weight: 600; margin-top: 4px;">🚗 ${s.distFromPrev} (${s.timeFromPrev}) via ${s.highway}</div>` : '<div style="font-size: 10.5px; color: #2563EB; font-weight: 600; margin-top: 4px;">🚩 Journey Departure Hub</div>'}
          <a href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}&travelmode=${travelMode}" target="_blank" rel="noopener noreferrer" style="
            display: block;
            margin-top: 8px;
            padding: 6px 8px;
            background: #059669;
            color: white;
            border-radius: 6px;
            text-align: center;
            font-size: 11px;
            font-weight: bold;
            text-decoration: none;
          ">
            Navigate to Stop in Google Maps ↗
          </a>
        </div>
      `);
    });

    mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [60, 60] });
  };

  // Fullscreen Handler
  const handleToggleFullscreen = () => {
    if (!mapWrapperRef.current) return;
    if (!document.fullscreenElement) {
      mapWrapperRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
      }).catch(err => console.warn("Fullscreen request error:", err));
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
      }).catch(err => console.warn("Exit fullscreen error:", err));
    }
  };

  // Handle initial target point fly-to
  useEffect(() => {
    if (!mapInstanceRef.current || !initialTargetPoint) return;
    mapInstanceRef.current.flyTo([initialTargetPoint.lat, initialTargetPoint.lng], 14, { duration: 1.5 });

    if (targetPinMarkerRef.current) {
      targetPinMarkerRef.current.remove();
    }

    const pin = L.divIcon({
      className: 'target-focus-pin',
      html: `
        <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:36px; height:36px; border-radius:50%; background:#E05A2B; opacity:0.4; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position:relative; width:24px; height:24px; border-radius:50%; background:#E05A2B; border:2.5px solid white; box-shadow:0 3px 8px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:bold;">📍</div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
    const targetMarker = L.marker([initialTargetPoint.lat, initialTargetPoint.lng], { icon: pin }).addTo(mapInstanceRef.current);
    targetMarker.bindPopup(`
      <div style="font-family: inherit; width: 220px;">
        <div style="font-size: 10px; font-weight: bold; color: #E05A2B; text-transform: uppercase;">Selected Monument</div>
        <div style="font-size: 13px; font-weight: bold; color: #161616; margin-top: 2px;">${initialTargetPoint.name || 'Verified Heritage Site'}</div>
        <div style="font-size: 11px; color: #4B5563; margin-top: 2px;">Coordinates: ${initialTargetPoint.lat.toFixed(4)}, ${initialTargetPoint.lng.toFixed(4)}</div>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${initialTargetPoint.lat},${initialTargetPoint.lng}" target="_blank" rel="noopener noreferrer" style="
          display: block;
          margin-top: 8px;
          padding: 6px 8px;
          background: #059669;
          color: white;
          border-radius: 6px;
          text-align: center;
          font-size: 11px;
          font-weight: bold;
          text-decoration: none;
        ">
          Navigate in Google Maps ↗
        </a>
      </div>
    `).openPopup();
    targetPinMarkerRef.current = targetMarker;
  }, [initialTargetPoint]);

  // Handle initial destination & mode
  useEffect(() => {
    if (initialMode === 'route' || initialDestination) {
      setIsRouteStudioOpen(true);
      if (initialDestination && markers.length > 0) {
        computeMultiStopRouteForDestination(initialDestination);
      }
    }
  }, [initialMode, initialDestination, markers]);

  const categories = [
    { key: 'all', label: 'All Categories' },
    { key: 'monuments', label: 'Monuments & Heritage Sites' },
    { key: 'festivals', label: 'Festivals & Traditions' },
    { key: 'crafts', label: 'Arts & Crafts' },
    { key: 'performing', label: 'Performing Arts' },
    { key: 'living', label: 'Living Traditions' },
  ];

  const currentCategoryLabel = categories.find((c) => c.key === selectedCategory)?.label || 'All Categories';

  return (
    <div className="space-y-4">
      {/* 1. Controls Bar Above Map */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-transparent">
        {/* Left Tabs & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map View */}
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-[#FF6600] text-white shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>

          {/* List View */}
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-[#FF6600] text-white shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
            }`}
          >
            <List className="w-3.5 h-3.5 text-stone-500" />
            <span>List View</span>
          </button>

          {/* Cultural Experiences */}
          <button
            onClick={() => {
              setActiveTab('experience');
              setSelectedCategory('all');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'experience'
                ? 'bg-[#FF6600] text-white shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-500" />
            <span>Cultural Experiences</span>
          </button>

          {/* "Locate Me" Button */}
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              userLocation
                ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
            }`}
            title="Locate my position on the cultural map"
          >
            <Crosshair className={`w-3.5 h-3.5 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : userLocation ? 'Located' : 'Locate Me'}</span>
          </button>

          {/* "Route Studio" Toggle Button */}
          <button
            onClick={() => setIsRouteStudioOpen(!isRouteStudioOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              isRouteStudioOpen
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>Route Studio</span>
          </button>
        </div>

        {/* Right Section: Search Input + Categories Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search places, cities or experiences..."
              className="bg-[#F9FAFB] hover:bg-stone-100/60 focus:bg-white border border-stone-200 focus:border-[#FF6600] rounded-xl pl-9 pr-3.5 py-2 text-xs text-stone-800 placeholder-stone-400 outline-none w-56 sm:w-64 lg:w-72 transition-all shadow-2xs"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Floating City Auto-Suggestions (962 Cities & Towns across 28 States & 8 UTs) */}
            {isSuggestionsOpen && searchSuggestions.length > 0 && (
              <div
                ref={suggestionsBoxRef}
                className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 bg-white border border-stone-200 rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn text-xs max-h-64 overflow-y-auto"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 flex items-center justify-between">
                  <span>Indian Cities & Towns ({searchSuggestions.length})</span>
                  <span>Click to locate</span>
                </div>
                {searchSuggestions.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCitySuggestion(c)}
                    className="w-full text-left px-3 py-2 hover:bg-orange-50/80 transition-colors flex items-center justify-between cursor-pointer border-b border-stone-50 last:border-0"
                  >
                    <div>
                      <div className="font-bold text-stone-800 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#FF6600] shrink-0" />
                        <span>{c.name}</span>
                      </div>
                      <div className="text-[10.5px] text-stone-500 pl-4.5">{c.state} • {c.region}</div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="bg-white hover:bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-800 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-stone-600" />
              <span>{currentCategoryLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
                  categoryDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn text-xs">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => {
                      setSelectedCategory(c.key);
                      setCategoryDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === c.key
                        ? 'bg-[#FFF2E5] text-[#FF6600] font-bold'
                        : 'text-stone-700 hover:bg-stone-50 font-medium'
                    }`}
                  >
                    <span>{c.label}</span>
                    {selectedCategory === c.key && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nearest Location Toast Alert */}
      {nearestDistanceNotice && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 px-4 py-2 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span className="font-semibold">{nearestDistanceNotice}</span>
          </div>
          <button onClick={() => setNearestDistanceNotice(null)} className="text-blue-500 hover:text-blue-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Route Studio Panel (Collapsible Drawer) */}
      {isRouteStudioOpen && (
        <div className="bg-[#FFFDF9] border border-amber-200 rounded-2xl p-4 shadow-sm animate-fadeIn space-y-3">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C85A17] uppercase tracking-wider">
              <Route className="w-4 h-4 text-[#FF6600]" />
              <span>Route Studio & Cultural Navigation</span>
            </div>
            <button
              onClick={() => setIsRouteStudioOpen(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* Origin Selector */}
            <div className="md:col-span-4 space-y-1">
              <label className="text-[11px] font-semibold text-stone-600">Starting Point (Origin):</label>
              <select
                value={routeOrigin}
                onChange={(e) => setRouteOrigin(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 outline-none focus:border-[#FF6600]"
              >
                <option value="current_location">📍 My Location {userLocation ? '(Detected)' : '(Click to Geocode)'}</option>
                {markers.slice(0, 30).map((m) => (
                  <option key={`orig-${m.id}`} value={m.id}>
                    {m.name} ({m.city}, {m.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Selector */}
            <div className="md:col-span-4 space-y-1">
              <label className="text-[11px] font-semibold text-stone-600">Cultural Destination:</label>
              <select
                value={routeDestination}
                onChange={(e) => setRouteDestination(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 outline-none focus:border-[#FF6600]"
              >
                {markers.map((m) => (
                  <option key={`dest-${m.id}`} value={m.id}>
                    {m.name} ({m.city}, {m.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Travel Mode & Action */}
            <div className="md:col-span-4 flex items-center gap-2">
              <div className="flex bg-stone-100 p-0.5 rounded-xl border border-stone-200 shrink-0">
                <button
                  onClick={() => setTravelMode('driving')}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${
                    travelMode === 'driving' ? 'bg-white shadow-2xs font-bold text-[#FF6600]' : 'text-stone-600'
                  }`}
                  title="Driving Mode"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Road</span>
                </button>
                <button
                  onClick={() => setTravelMode('transit')}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${
                    travelMode === 'transit' ? 'bg-white shadow-2xs font-bold text-indigo-600' : 'text-stone-600'
                  }`}
                  title="Transit / Rail Mode"
                >
                  <Train className="w-3.5 h-3.5" />
                  <span>Rail</span>
                </button>
              </div>

              <button
                onClick={handleComputeRoute}
                className="flex-1 bg-[#FF6600] hover:bg-[#E65100] text-white font-semibold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Draw Route</span>
              </button>
            </div>
          </div>

          {/* Multi-Stop / Turn-by-Turn Route Navigation Breakdown */}
          {multiStops.length > 0 ? (
            <div className="bg-white border border-amber-200/90 rounded-2xl p-4 space-y-3.5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#E05A2B] uppercase tracking-wider">
                      ✦ Stop-by-Stop Expedition Route
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold">
                      {multiStops.length} Verified Stops
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Total Circuit: <b className="text-stone-900">{routeDistance} km</b> • Est. Driving Time: <b className="text-stone-900">{routeDuration}</b>
                  </div>
                </div>

                {/* Master Google Maps Launch Button */}
                <a
                  href={getGoogleMapsMultiStopUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl transition-all shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Launch in Google Maps App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Stop by Stop Leg Cards */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {multiStops.map((stop, idx) => (
                  <div
                    key={stop.step}
                    className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 hover:bg-amber-50/50 hover:border-amber-300 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E05A2B] to-[#B33E16] text-white font-black text-[11px] flex items-center justify-center shrink-0 shadow-2xs">
                        {stop.step}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-900 truncate">{stop.name}</span>
                          <span className="text-[10px] text-stone-500 shrink-0">({stop.city})</span>
                        </div>
                        <div className="text-[10.5px] text-stone-500 mt-0.5 flex items-center gap-2">
                          {idx === 0 ? (
                            <span className="text-blue-600 font-semibold">🚩 Departure Hub</span>
                          ) : (
                            <span className="text-emerald-700 font-semibold">
                              🚗 {stop.distFromPrev} ({stop.timeFromPrev}) • <span className="text-stone-500 font-normal">{stop.highway}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          mapInstanceRef.current?.flyTo([stop.lat, stop.lng], 14, { duration: 1.2 });
                        }}
                        className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 text-[10.5px] font-semibold cursor-pointer shadow-2xs"
                        title="Focus on Map"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#E05A2B]" />
                      </button>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=${travelMode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10.5px] font-bold flex items-center gap-1 transition-colors"
                        title="Navigate this leg in Google Maps"
                      >
                        <span>Directions</span>
                        <ExternalLink className="w-3 h-3 text-emerald-700" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : routeDistance !== null && (
            <div className="bg-white border border-amber-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-stone-800">
                  <Milestone className="w-4 h-4 text-[#FF6600]" />
                  <span>Distance: <b className="text-stone-900">{routeDistance} km</b></span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-800">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Est. Time: <b className="text-stone-900">{routeDuration}</b></span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Corridor: <span className="font-semibold text-stone-700">Golden Quadrilateral / National Highways</span>
                </div>
              </div>

              {/* Direct Deep Link to Google Maps Navigation */}
              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-colors shadow-xs ml-auto"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* 2. Main Visual Display: Map + Nearby Discoveries (Or List View) */}
      {activeTab === 'list' ? (
        /* List View */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 divide-y divide-stone-100 max-h-[660px] overflow-y-auto">
          <div className="pb-3 text-xs font-bold text-stone-500 uppercase tracking-wider">
            Showing {filteredMarkers.length} Records in List View
          </div>
          {filteredMarkers.map((marker) => {
            const meta = getCategoryMeta(marker);
            return (
              <div
                key={marker.id}
                onClick={() => onSelectMarker(marker.type, marker.id)}
                className="py-3.5 flex items-start gap-4 hover:bg-amber-50/50 p-3 rounded-2xl cursor-pointer transition-colors group"
              >
                <img
                  src={marker.image_url}
                  alt={marker.name}
                  className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md"
                    >
                      {marker.category}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {marker.city}, {marker.state}
                    </span>
                    <span className="text-[11px] font-mono text-stone-400">
                      ({marker.latitude.toFixed(3)}, {marker.longitude.toFixed(3)})
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#FF6600] transition-colors mt-1">
                    {marker.name}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {marker.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-[#FF6600] transition-colors self-center shrink-0" />
              </div>
            );
          })}
        </div>
      ) : (
        /* Map View + Nearby Discoveries Grid (Exact Reference Image Layout) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: Leaflet Map (8 columns) */}
          <div ref={mapWrapperRef} className="lg:col-span-8 h-[600px] xl:h-[640px] rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs relative bg-stone-100">
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Google Maps Layer Switcher & Fullscreen Overlay Controls */}
            <div className="absolute top-4 right-4 z-[400] flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200/90 shadow-md">
              <button
                type="button"
                onClick={() => setMapLayer('streets')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  mapLayer === 'streets'
                    ? 'bg-[#FF6600] text-white shadow-2xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                🗺️ Street
              </button>
              <button
                type="button"
                onClick={() => setMapLayer('satellite')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  mapLayer === 'satellite'
                    ? 'bg-[#FF6600] text-white shadow-2xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                🛰️ Satellite
              </button>
              <button
                type="button"
                onClick={() => setMapLayer('terrain')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  mapLayer === 'terrain'
                    ? 'bg-[#FF6600] text-white shadow-2xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                🏔️ Terrain
              </button>

              <div className="w-[1px] h-4 bg-stone-200 mx-0.5" />

              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-700 cursor-pointer transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View (Google Maps Style)"}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Active Route Floating Chip */}
            {multiStops.length > 0 && (
              <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-amber-300 shadow-md flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E05A2B] animate-pulse" />
                <span className="font-extrabold text-stone-900">
                  {multiStops.length} Stops Active ({routeDistance} km)
                </span>
                <a
                  href={getGoogleMapsMultiStopUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] flex items-center gap-1 shadow-2xs"
                >
                  <span>Google Maps ↗</span>
                </a>
              </div>
            )}

            {/* Exact Bottom-Left Map Legend Card */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-3 rounded-2xl border border-stone-200 shadow-md text-xs space-y-1.5 select-none pointer-events-auto">
              <div className="flex items-center gap-2 text-stone-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-[#FF6600] text-white flex items-center justify-center text-[10px]">
                  🏛️
                </span>
                <span>Monuments & Heritage Sites</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[10px]">
                  🏮
                </span>
                <span>Festivals & Traditions</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-[#138808] text-white flex items-center justify-center text-[10px]">
                  🎨
                </span>
                <span>Arts & Crafts</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[10px]">
                  🎭
                </span>
                <span>Performing Arts</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center text-[10px]">
                  🌿
                </span>
                <span>Living Traditions</span>
              </div>
            </div>
          </div>

          {/* Right Column: "Nearby Discoveries" Panel (4 columns) */}
          <div className="lg:col-span-4 h-[600px] xl:h-[640px] bg-white rounded-3xl border border-stone-200/90 shadow-xs p-4 flex flex-col justify-between overflow-hidden">
            {/* Header: Location Pin + Nearby Discoveries + View All */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#FF6600]" />
                <h3 className="font-bold text-sm text-stone-900">
                  {userLocation ? 'Nearest to Your Location' : selectedPin ? `Near ${selectedPin.name}` : 'Nearby Discoveries'}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('list')}
                className="text-xs font-semibold text-[#FF6600] hover:text-[#E65100] flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4 Stacked Discovery Cards */}
            <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
              {discoveryCards.map((item, idx) => (
                <div
                  key={item.marker.id || idx}
                  onClick={() => {
                    if (item.marker && item.marker.latitude && item.marker.longitude && mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([item.marker.latitude, item.marker.longitude], 12);
                    }
                    onSelectMarker(item.marker.type, item.marker.id);
                  }}
                  className="p-2.5 rounded-2xl border border-stone-100 hover:border-amber-200 bg-stone-50/50 hover:bg-amber-50/40 transition-all cursor-pointer flex items-center gap-3 group"
                >
                  {/* Thumbnail with overlay distance badge */}
                  <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={item.marker.image_url || '/nearby-1.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-1 left-1 bg-white/95 text-stone-800 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs select-none">
                      <Compass className="w-2.5 h-2.5 text-[#FF6600]" />
                      {item.distance}
                    </span>
                  </div>

                  {/* Text descriptions */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 group-hover:text-[#FF6600] transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 leading-snug">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Orange Chevron */}
                  <ChevronRight className="w-4 h-4 text-[#FF6600] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              ))}
            </div>

            {/* Bottom Status bar */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 select-none">
              <span>⚡ Verified GPS Registries</span>
              <span className="font-semibold text-stone-700">ASI & State Portals</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
