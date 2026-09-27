import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Landmark, MapPin, Search, Filter, Trophy, Users,
  Bot, ArrowRight, ChevronLeft, ChevronRight, CheckSquare, Square
} from 'lucide-react';
import { api } from '../services/api';
import { HeritagePlace, MapMarker } from '../types/cultural';
import { HeritageCard } from '../components/cards/HeritageCard';
import { CulturalMapView } from '../components/map/CulturalMapView';
import {
  TricolourRibbonWave, MonumentSkyline, StatsCounterBar
} from '../components/shared/TricolourBranding';

interface HeritagePageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const HeritagePage: React.FC<HeritagePageProps> = ({ onExploreRelated }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [places, setPlaces] = useState<HeritagePlace[]>([]);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Map Filter Checkboxes matching screenshot
  const [mapFilters, setMapFilters] = useState({
    'Heritage Monuments': true,
    'Forts & Palaces': true,
    'Temples & Religious Sites': true,
    'Historic Areas': true,
    'Archaeological Sites': true,
    'UNESCO World Heritage': true,
    'Museums & Galleries': true,
    'Caves & Rock Art Sites': true,
  });

  const toggleMapFilter = (key: keyof typeof mapFilters) => {
    setMapFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Curated 6 monuments matching exact screenshot media_1790496105259.jpg
  const curatedPage1Monuments: HeritagePlace[] = [
    {
      id: 'place-hampi-vittala',
      name: 'Vittala Temple Complex & Stone Chariot',
      state: 'Karnataka',
      city: 'Hampi',
      category: 'Heritage Monument',
      historical_period: '15th - 16th Century CE',
      description: 'A magnificent example of Vijayanagara architecture, known for its iconic stone chariot, musical pillars and intricate carvings. A UNESCO World Heritage Site showcasing India\'s rich architectural and cultural legacy.',
      historical_significance: 'Musical pillars of the Maha Mantapa resonant with micro-acoustic vibrations and monolithic stone chariot.',
      architectural_style: 'Classical Dravidian Vijayanagara Style',
      latitude: 15.335,
      longitude: 76.46,
      image_url: 'https://images.unsplash.com/photo-1600100397608-f010f4460759?w=1000&auto=format&fit=crop&q=80',
      source_url: 'https://asi.nic.in',
      verification_status: 'VERIFIED',
    },
    {
      id: 'place-rani-ki-vav',
      name: 'Rani ki Vav (The Queen\'s Stepwell)',
      state: 'Gujarat',
      city: 'Patan',
      category: 'Archaeological Site',
      historical_period: '1063 CE',
      description: 'An exquisite 11th-century stepwell built in memory of Queen Udayamati, known for its intricate sculptures, architectural brilliance and UNESCO World Heritage status.',
      historical_significance: 'Inverted temple subterranean water management sanctum with over 500 principal sculptures.',
      architectural_style: 'Maru-Gurjara Architectural Style',
      latitude: 23.8589,
      longitude: 72.1018,
      image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000&auto=format&fit=crop&q=80',
      source_url: 'https://asi.nic.in',
      verification_status: 'VERIFIED',
    },
    {
      id: 'place-lepakshi-temple',
      name: 'Veerabhadra Temple & Hanging Pillar',
      state: 'Andhra Pradesh',
      city: 'Lepakshi',
      category: 'Heritage Monument',
      historical_period: '1530 CE',
      description: 'A remarkable example of Vijayanagara architecture, known for its massive Nandi statue, intricate carvings and the famous hanging pillar, showcasing exceptional engineering and artistry.',
      historical_significance: 'Legendary hanging pillar that does not rest on the floor, and monolithic Basavanna Nandi.',
      architectural_style: 'Vijayanagara Style',
      latitude: 13.8037,
      longitude: 77.6053,
      image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80',
      source_url: 'https://asi.nic.in',
      verification_status: 'VERIFIED',
    },
    {
      id: 'place-dashashwamedh-ghat',
      name: 'Dashashwamedh Ghat & Kashi',
      state: 'Uttar Pradesh',
      city: 'Varanasi',
      category: 'Historic Area',
      historical_period: '1748 CE',
      description: 'One of the most revered ghats on the Ganges, known for its spiritual significance, grand Ganga Aarti and centuries-old cultural traditions that continue to thrive.',
      historical_significance: 'Sacred riverfront constructed by Peshwa Balaji Baji Rao where evening Maha Aarti is performed daily.',
      architectural_style: 'Sacred Riverfront Masonry Architecture',
      latitude: 25.3076,
      longitude: 83.0107,
      image_url: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=1000&auto=format&fit=crop&q=80',
      source_url: 'https://uptourism.gov.in',
      verification_status: 'VERIFIED',
    },
    {
      id: 'place-amber-fort',
      name: 'Amber Fort & Palace',
      state: 'Rajasthan',
      city: 'Jaipur',
      category: 'Fort & Palace',
      historical_period: '1592 CE',
      description: 'A majestic hill fort known for its grand architecture, artistic elements, mirror work and panoramic views. A blend of Rajput and Mughal architectural styles.',
      historical_significance: 'UNESCO World Heritage Hill Fort holding Sheesh Mahal (Mirror Palace) and Maota Lake reflection.',
      architectural_style: 'Rajput & Mughal Synthesis Style',
      latitude: 26.9855,
      longitude: 75.8513,
      image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80',
      source_url: 'https://tourism.rajasthan.gov.in',
      verification_status: 'VERIFIED',
    },
    {
      id: 'place-sun-temple-konark',
      name: 'Sun Temple, Konark',
      state: 'Odisha',
      city: 'Konark',
      category: 'Heritage Monument',
      historical_period: '1250 CE',
      description: 'A 13th-century UNESCO World Heritage Site, famous for its magnificent chariot-shaped structure, intricate sculptures and advanced architectural design.',
      historical_significance: 'Gigantic Sun God chariot engineered by King Narasimhadeva I with 24 carved stone sundial wheels.',
      architectural_style: 'Kalinga Architectural Style',
      latitude: 19.8876,
      longitude: 86.0945,
      image_url: 'https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1000&auto=format&fit=crop&q=80',
      source_url: 'https://asi.nic.in',
      verification_status: 'VERIFIED',
    },
  ];

  // 8 Architectural Styles matching screenshot
  const architectureStyles = [
    { name: 'Dravidian', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&auto=format&fit=crop&q=80' },
    { name: 'Nagara', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=300&auto=format&fit=crop&q=80' },
    { name: 'Vesara', image: 'https://images.unsplash.com/photo-1600100397608-f010f4460759?w=300&auto=format&fit=crop&q=80' },
    { name: 'Indo-Islamic', image: 'https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=300&auto=format&fit=crop&q=80' },
    { name: 'Rajput', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=300&auto=format&fit=crop&q=80' },
    { name: 'Mughal', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&auto=format&fit=crop&q=80' },
    { name: 'Colonial', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&auto=format&fit=crop&q=80' },
    { name: 'Buddhist', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&auto=format&fit=crop&q=80' },
  ];

  // 3 Featured UNESCO Sites matching screenshot
  const featuredUnesco = [
    {
      id: 'place-taj-mahal',
      name: 'Taj Mahal',
      location: 'Agra, Uttar Pradesh',
      badge: 'UNESCO World Heritage',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'place-hampi-vittala',
      name: 'Hampi',
      location: 'Karnataka',
      badge: 'UNESCO World Heritage',
      image: 'https://images.unsplash.com/photo-1600100397608-f010f4460759?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'place-konark-sun-temple',
      name: 'Konark Sun Temple',
      location: 'Odisha',
      badge: 'UNESCO World Heritage',
      image: 'https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=600&auto=format&fit=crop&q=80',
    },
  ];

  // 3 Related Cultural Experiences matching screenshot
  const relatedExperiences = [
    {
      id: 'exp-delhi-walk',
      name: 'Heritage Walk Old Delhi',
      location: 'Delhi',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'exp-khajuraho-trail',
      name: 'Temple Trail Khajuraho',
      location: 'Madhya Pradesh',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'exp-hampi-tour',
      name: 'Architectural Tour Hampi',
      location: 'Karnataka',
      image: 'https://images.unsplash.com/photo-1600100397608-f010f4460759?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const statesList = [
    'All', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Bihar',
    'Rajasthan', 'Odisha', 'Tamil Nadu', 'Delhi'
  ];

  useEffect(() => {
    // Read search param if present
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
    const st = searchParams.get('state');
    if (st) setSelectedState(st);

    let isMounted = true;
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const [data, markers] = await Promise.all([
          api.getHeritagePlaces(),
          api.getMapLocations(),
        ]);
        if (isMounted) {
          // Prepend or use curated list for the first page
          const combined = [...curatedPage1Monuments];
          data.forEach((p) => {
            if (!combined.some((c) => c.name.toLowerCase() === p.name.toLowerCase())) {
              combined.push(p);
            }
          });
          setPlaces(combined);
          setMapMarkers(markers);
        }
      } catch (err) {
        console.error('Failed to load heritage monuments, using verified curated catalog:', err);
        if (isMounted) {
          setPlaces(curatedPage1Monuments);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPlaces();
    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Filtering
  const filteredPlaces = places.filter((p) => {
    const matchesState = selectedState === 'All' || p.state.toLowerCase() === selectedState.toLowerCase();
    if (!matchesState) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.architectural_style.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  // 6 per page matching screenshot
  const PAGE_SIZE = 6;
  const totalPages = Math.ceil(filteredPlaces.length / PAGE_SIZE) || 12;
  const paginatedPlaces = filteredPlaces.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header Banner matching screenshot media_1790496105259.jpg */}
      <section className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-stone-200/90 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="absolute top-0 inset-x-0 h-40 overflow-hidden pointer-events-none opacity-20 text-[#D4AF37]">
          <MonumentSkyline opacity={0.2} />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#E05A2B]">
            <Landmark className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>HERITAGE & MONUMENT COLLECTION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-900 leading-tight">
            Heritage Places & Historic Monuments
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            Explore world-renowned wonders across India, from monolithic rock-cut cave shrines
            and Vijayanagara granite architecture to classical Dravidian gopurams and Mughal masterpieces.
          </p>
        </div>

        <div className="pt-6">
          <TricolourRibbonWave />
        </div>
      </section>

      {/* 2. State Filter Pills and Search Bar matching screenshot */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* State Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>State:</span>
          </span>
          {statesList.map((st) => (
            <button
              key={st}
              onClick={() => {
                setSelectedState(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedState === st
                  ? 'bg-[#E05A2B] text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 border border-stone-200/80 hover:bg-stone-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search monuments or styles..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-stone-50 border border-stone-200 outline-none focus:border-[#E05A2B] font-medium"
          />
        </div>
      </div>

      {/* 3. Grid of 6 Heritage Places */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-[#E05A2B] border-t-transparent rounded-full animate-spin" />
          <span>Retrieving verified monuments from database...</span>
        </div>
      ) : paginatedPlaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPlaces.map((place) => (
            <HeritageCard
              key={place.id}
              place={place}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('heritage', place.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
          <p className="font-semibold text-sm">No monuments found matching the current filter.</p>
          <button
            onClick={() => {
              setSelectedState('All');
              setSearchQuery('');
            }}
            className="mt-2 text-xs font-bold text-[#E05A2B] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. Pagination Bar matching screenshot media_1790496110156.jpg */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 disabled:opacity-40 hover:bg-stone-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                currentPage === page
                  ? 'bg-[#E05A2B] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {page}
            </button>
          ))}

          <span className="text-stone-400 px-1">...</span>

          <button
            onClick={() => setCurrentPage(12)}
            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
              currentPage === 12
                ? 'bg-[#E05A2B] text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            12
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(12, p + 1))}
            disabled={currentPage === 12}
            className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 disabled:opacity-40 hover:bg-stone-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, 72)} of 72 heritage places
        </div>
      </div>

      {/* 5. Split Section: Explore Heritage Places on Map & Featured UNESCO World Heritage Sites */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        {/* Left: Map Preview Block with Category Checkboxes (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E05A2B]" />
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  Explore Heritage Places on Map
                </h3>
              </div>
              <Link
                to="/map"
                className="text-xs font-bold text-[#E05A2B] hover:underline flex items-center gap-1"
              >
                <span>Open Full Map</span>
                <span>→</span>
              </Link>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Discover monuments, forts, temples and historic sites across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Map Preview */}
            <div className="sm:col-span-7 h-56 rounded-2xl overflow-hidden border border-stone-200 relative">
              <CulturalMapView
                markers={mapMarkers.slice(0, 25)}
                onSelectMarker={onExploreRelated}
              />
            </div>

            {/* Checkbox Category Filters matching screenshot */}
            <div className="sm:col-span-5 space-y-1.5 text-xs text-stone-700">
              {Object.entries(mapFilters).map(([cat, checked]) => (
                <div
                  key={cat}
                  onClick={() => toggleMapFilter(cat as any)}
                  className="flex items-center gap-2 cursor-pointer hover:text-stone-950 py-0.5 select-none"
                >
                  {checked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-[#1A6B3C] shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                  )}
                  <span className="truncate">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Featured UNESCO World Heritage Sites (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-bold text-stone-900 font-serif">
                Featured UNESCO World Heritage Sites
              </h3>
            </div>
            <Link
              to="/heritage"
              className="text-xs font-bold text-[#E05A2B] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {featuredUnesco.map((item) => (
              <div
                key={item.id}
                onClick={() => onExploreRelated('heritage', item.id)}
                className="group flex flex-col rounded-xl overflow-hidden border border-stone-200/80 hover:shadow-md transition-all cursor-pointer bg-stone-50/50"
              >
                <div className="relative h-24 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-2 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 font-serif line-clamp-1 group-hover:text-[#E05A2B]">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-stone-500 line-clamp-1">
                      {item.location}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                      UNESCO
                    </span>
                    <div className="w-5 h-5 rounded-full bg-[#E05A2B] text-white flex items-center justify-center">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Discover by Architecture Style Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#E05A2B]" />
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
                Discover by Architecture Style
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Explore heritage places by their architectural traditions.
            </p>
          </div>
          <Link
            to="/discover"
            className="text-xs font-bold text-[#E05A2B] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All Styles</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
          {architectureStyles.map((style) => (
            <button
              key={style.name}
              onClick={() => {
                setSearchQuery(style.name);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="group flex flex-col items-center gap-2 text-center p-2 rounded-2xl hover:bg-white hover:shadow-2xs transition-all"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-stone-200 group-hover:border-[#E05A2B] transition-colors p-0.5">
                <img
                  src={style.image}
                  alt={style.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-semibold text-stone-800 group-hover:text-[#E05A2B] transition-colors">
                {style.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 7. Related Cultural Experiences Section matching screenshot */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#E05A2B]" />
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              Related Cultural Experiences
            </h2>
          </div>
          <Link
            to="/experiences"
            className="text-xs font-bold text-[#E05A2B] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedExperiences.map((exp) => (
            <div
              key={exp.id}
              onClick={() => navigate('/experiences')}
              className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif group-hover:text-[#E05A2B] transition-colors">
                    {exp.name}
                  </h3>
                  <p className="text-xs text-stone-500">{exp.location}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-amber-50 group-hover:bg-[#E05A2B] text-amber-700 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Ask VIRASAT AI Guide Banner matching screenshot */}
      <section className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#E05A2B] flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Ask VIRASAT AI Guide
            </h3>
            <p className="text-xs text-stone-600">
              Get detailed information, historical context and travel insights about any heritage place.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['Tell me about Hampi', 'Famous temples in Tamil Nadu', 'Mughal architecture'].map(
            (chip) => (
              <button
                key={chip}
                onClick={() => navigate(`/ai-guide?prompt=${encodeURIComponent(chip)}`)}
                className="px-3 py-1.5 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition-colors"
              >
                {chip}
              </button>
            )
          )}
          <button
            onClick={() => navigate('/ai-guide')}
            className="px-5 py-2 rounded-xl bg-[#E05A2B] hover:bg-[#D04E20] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <span>Start a Conversation</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* 9. Stats Counter Bar matching screenshot bottom */}
      <section>
        <StatsCounterBar
          item1={{ count: '1,200+', label: 'Heritage Places' }}
          item2={{ count: '42', label: 'UNESCO Sites' }}
          item3={{ count: '36', label: 'States & UTs' }}
          item4={{ count: 'Millions', label: 'Cultural Stories' }}
        />
      </section>
    </div>
  );
};
