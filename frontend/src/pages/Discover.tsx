import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, MapPin, LayoutGrid, SlidersHorizontal, RotateCcw,
  ChevronRight, ChevronDown, Heart, Landmark, Calendar,
  Palette, Music, BookOpen
} from 'lucide-react';
import { api } from '../services/api';

interface DiscoverPageProps {
  onExploreRelated: (type: string, id: string) => void;
  onOpenAIChat?: (prompt: string) => void;
}

interface DiscoveryItem {
  id: string;
  title: string;
  location: string;
  state: string;
  categoryName: string;
  description: string;
  image_url: string;
  type: string;
  source_url?: string;
}

// 4 Exact Featured Heritage Destinations shown in reference screenshot media_1790605292743.png
const initialPopularDiscoveries: DiscoveryItem[] = [
  {
    id: 'place-taj-mahal',
    title: 'Taj Mahal',
    location: 'Agra, Uttar Pradesh',
    state: 'Uttar Pradesh',
    categoryName: 'Heritage Places',
    description: 'An eternal symbol of love and Mughal artistry.',
    image_url: '/hero/monument-1.jpg',
    type: 'heritage',
    source_url: 'https://asi.nic.in',
  },
  {
    id: 'place-red-fort-delhi',
    title: 'Red Fort',
    location: 'Delhi, Delhi',
    state: 'Delhi',
    categoryName: 'Heritage Places',
    description: 'Iconic fortress of the Mughal Empire.',
    image_url: 'https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=800&auto=format&fit=crop&q=80',
    type: 'heritage',
    source_url: 'https://asi.nic.in',
  },
  {
    id: 'place-konark-sun-temple',
    title: 'Konark Sun Temple',
    location: 'Konark, Odisha',
    state: 'Odisha',
    categoryName: 'Heritage Places',
    description: 'A masterpiece of Kalinga architecture.',
    image_url: '/hero/monument-7.jpg',
    type: 'heritage',
    source_url: 'https://asi.nic.in',
  },
  {
    id: 'place-kashi-vishwanath',
    title: 'Varanasi Ghats',
    location: 'Varanasi, Uttar Pradesh',
    state: 'Uttar Pradesh',
    categoryName: 'Heritage Places',
    description: 'A spiritual city on the banks of the Ganga.',
    image_url: '/hero/monument-3.jpg',
    type: 'heritage',
    source_url: 'https://uptourism.gov.in',
  },
];

// 6 Exact Explore by Interest Categories shown in reference screenshot media_1790605292743.png
const interestCategories = [
  {
    key: 'heritage',
    title: 'Heritage Places',
    icon: Landmark,
    badgeBg: 'bg-[#FF6600]',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=300&auto=format&fit=crop&q=80',
  },
  {
    key: 'festival',
    title: 'Festivals & Traditions',
    icon: Calendar,
    badgeBg: 'bg-[#F43F5E]',
    image: '/festivals/rath-yatra.jpg',
  },
  {
    key: 'art_craft',
    title: 'Arts & Crafts',
    icon: Palette,
    badgeBg: 'bg-[#8B5CF6]',
    image: '/craft-jaipur-pottery.jpg',
  },
  {
    key: 'performing_art',
    title: 'Performing Arts',
    icon: Music,
    badgeBg: 'bg-[#3B82F6]',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=300&auto=format&fit=crop&q=80',
  },
  {
    key: 'experience',
    title: 'Cultural Experiences',
    icon: MapPin,
    badgeBg: 'bg-[#10B981]',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&auto=format&fit=crop&q=80',
  },
  {
    key: 'story',
    title: 'Cultural Stories',
    icon: BookOpen,
    badgeBg: 'bg-[#F59E0B]',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
  },
];

// Comprehensive Indian States & UT list for the State dropdown
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 
  'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 
  'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

/**
 * Architectural Monuments Skyline Silhouette SVG
 * Matches the warm golden skyline illustrated on the right side of the Discover banner in the reference screenshot
 */
const DiscoverSkyline: React.FC = () => (
  <svg
    viewBox="0 0 720 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-auto select-none pointer-events-none opacity-40"
  >
    <defs>
      <linearGradient id="skylineGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#DFB370" stopOpacity="0.85" />
        <stop offset="60%" stopColor="#D4A152" stopOpacity="0.60" />
        <stop offset="100%" stopColor="#C99039" stopOpacity="0.30" />
      </linearGradient>
    </defs>

    {/* Flying birds in sky */}
    <path d="M420 38 Q426 31 432 38 Q438 31 444 38" stroke="#C99039" strokeWidth="1.5" fill="none" opacity="0.6" />
    <path d="M480 22 Q485 16 490 22 Q495 16 500 22" stroke="#C99039" strokeWidth="1.5" fill="none" opacity="0.6" />
    <path d="M540 48 Q544 43 548 48 Q552 43 556 48" stroke="#C99039" strokeWidth="1.2" fill="none" opacity="0.5" />

    {/* Left Minaret */}
    <g fill="url(#skylineGoldGrad)">
      <rect x="40" y="55" width="10" height="150" rx="1.5" />
      <rect x="37" y="50" width="16" height="5" rx="1" />
      <polygon points="45,32 40,50 50,50" />
      <circle cx="45" cy="30" r="2.5" />
      <rect x="36" y="90" width="18" height="3" />
      <rect x="36" y="130" width="18" height="3" />
    </g>

    {/* Taj Mahal Central Dome & Gateway */}
    <g fill="url(#skylineGoldGrad)">
      {/* Main Dome */}
      <path d="M100 120 C100 60, 170 60, 170 120 Z" />
      <path d="M135 35 L135 65" stroke="#C99039" strokeWidth="2.5" />
      <circle cx="135" cy="33" r="3" />
      {/* Side small domes */}
      <path d="M82 120 C82 90, 102 90, 102 120 Z" />
      <path d="M168 120 C168 90, 188 90, 188 120 Z" />
      {/* Taj Base building & Arch */}
      <rect x="75" y="120" width="120" height="85" />
      <path d="M115 205 L115 145 Q135 130 155 145 L155 205 Z" fill="#FFFFFF" fillOpacity="0.8" />
    </g>

    {/* Sanchi Stupa Dome */}
    <g fill="url(#skylineGoldGrad)">
      <path d="M225 205 C225 110, 325 110, 325 205 Z" />
      <rect x="265" y="95" width="20" height="15" rx="2" />
      <line x1="275" y1="75" x2="275" y2="95" stroke="#C99039" strokeWidth="3" />
      <ellipse cx="275" cy="80" rx="14" ry="3.5" />
      <ellipse cx="275" cy="86" rx="10" ry="2.5" />
    </g>

    {/* Hindu Temple Shikhara / Gopuram */}
    <g fill="url(#skylineGoldGrad)">
      <polygon points="380,205 395,65 445,65 460,205" />
      {/* Kalash on top */}
      <rect x="410" y="55" width="20" height="10" rx="2" />
      <circle cx="420" cy="48" r="5" />
      <line x1="420" y1="36" x2="420" y2="44" stroke="#C99039" strokeWidth="2.5" />
      {/* Tier lines */}
      <line x1="392" y1="95" x2="448" y2="95" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" />
      <line x1="388" y1="125" x2="452" y2="125" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" />
      <line x1="384" y1="155" x2="456" y2="155" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" />
      {/* Temple Arch entrance */}
      <path d="M410 205 L410 170 Q420 158 430 170 L430 205 Z" fill="#FFFFFF" fillOpacity="0.8" />
    </g>

    {/* Konark Chariot Wheel & Arch */}
    <g fill="url(#skylineGoldGrad)">
      <rect x="485" y="105" width="105" height="100" rx="3" />
      <path d="M515 205 L515 145 Q535 130 555 145 L555 205 Z" fill="#FFFFFF" fillOpacity="0.8" />
      {/* Dome above gateway */}
      <path d="M510 105 C510 70, 560 70, 560 105 Z" />
      <line x1="535" y1="58" x2="535" y2="70" stroke="#C99039" strokeWidth="2" />
      <circle cx="535" cy="56" r="2.5" />
    </g>

    {/* Ancient Pillar / Minaret on Right */}
    <g fill="url(#skylineGoldGrad)">
      <rect x="620" y="70" width="12" height="135" rx="2" />
      <polygon points="626,48 619,70 633,70" />
      <circle cx="626" cy="45" r="3" />
      <rect x="617" y="105" width="18" height="3" />
      <rect x="617" y="145" width="18" height="3" />
    </g>

    {/* Ground base line */}
    <rect x="0" y="205" width="720" height="15" fill="url(#skylineGoldGrad)" opacity="0.3" />
  </svg>
);

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ onExploreRelated }) => {
  // Search, filter and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [activeInterest, setActiveInterest] = useState<string | null>(null);
  const [showAllDiscoveries, setShowAllDiscoveries] = useState(false);

  // Repository data state
  const [allDiscoveries, setAllDiscoveries] = useState<DiscoveryItem[]>([]);
  const [, setLoading] = useState(true);

  // Saved/wishlist items persisted in localStorage
  const [savedItems, setSavedItems] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('virasat_saved_discoveries');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const toggleSave = (id: string) => {
    setSavedItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('virasat_saved_discoveries', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  // Load all repository items in background for instant search and multi-category filtering
  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      try {
        const [places, festivals, crafts, performing, experiences, stories] = await Promise.all([
          api.getHeritagePlaces().catch(() => []),
          api.getFestivals().catch(() => []),
          api.getArtsCrafts().catch(() => []),
          api.getPerformingArts().catch(() => []),
          api.getExperiences().catch(() => []),
          api.getStories().catch(() => []),
        ]);

        if (!isMounted) return;

        const combined: DiscoveryItem[] = [
          ...initialPopularDiscoveries,
          ...places.map((p) => ({
            id: p.id,
            title: p.name,
            location: `${p.city || p.district || 'India'}, ${p.state}`,
            state: p.state,
            categoryName: 'Heritage Places',
            description: p.description,
            image_url: p.image_url || '/hero/monument-1.jpg',
            type: 'heritage',
            source_url: p.source_url,
          })),
          ...festivals.map((f) => ({
            id: f.id,
            title: f.name,
            location: `${f.region || 'India'}, ${f.state}`,
            state: f.state,
            categoryName: 'Festivals & Traditions',
            description: f.description,
            image_url: f.image_url || '/festivals/rath-yatra.jpg',
            type: 'festival',
            source_url: f.source_url,
          })),
          ...crafts.map((c) => ({
            id: c.id,
            title: c.name,
            location: `${c.origin || 'India'}, ${c.state}`,
            state: c.state,
            categoryName: 'Arts & Crafts',
            description: c.description,
            image_url: c.image_url || '/craft-jaipur-pottery.jpg',
            type: 'art_craft',
            source_url: c.source_url,
          })),
          ...performing.map((pa) => ({
            id: pa.id,
            title: pa.name,
            location: pa.state,
            state: pa.state,
            categoryName: 'Performing Arts',
            description: pa.description,
            image_url: pa.image_url || 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80',
            type: 'performing_art',
            source_url: pa.source_url,
          })),
          ...experiences.map((exp) => ({
            id: exp.id,
            title: exp.name,
            location: `${exp.city || 'India'}, ${exp.state}`,
            state: exp.state,
            categoryName: 'Cultural Experiences',
            description: exp.description,
            image_url: exp.image_url || 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
            type: 'experience',
            source_url: exp.source_url,
          })),
          ...stories.map((st) => ({
            id: st.id,
            title: st.title,
            location: `${st.region || 'India'}, ${st.state}`,
            state: st.state,
            categoryName: 'Cultural Stories',
            description: st.narrative,
            image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
            type: 'story',
            source_url: st.source_url,
          })),
        ];

        // Deduplicate by ID
        const seen = new Set<string>();
        const unique = combined.filter((item) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });

        setAllDiscoveries(unique);
      } catch (err) {
        console.error('Failed to load discover items from repository:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and Sort Engine
  const filteredDiscoveries = useMemo(() => {
    const isFilterApplied =
      searchQuery.trim() !== '' ||
      selectedState !== 'All' ||
      selectedCategory !== 'All' ||
      activeInterest !== null ||
      sortBy !== 'popular';

    // If no filter is applied and showAllDiscoveries is false, show exactly the 4 iconic items
    if (!isFilterApplied && !showAllDiscoveries) {
      return initialPopularDiscoveries;
    }

    let list = allDiscoveries.length > 0 ? allDiscoveries : initialPopularDiscoveries;

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q)
      );
    }

    // 2. State Filter
    if (selectedState !== 'All') {
      list = list.filter((item) =>
        item.state.toLowerCase() === selectedState.toLowerCase() ||
        item.location.toLowerCase().includes(selectedState.toLowerCase())
      );
    }

    // 3. Category Filter
    if (selectedCategory !== 'All') {
      list = list.filter((item) => item.type === selectedCategory);
    }

    // 4. Sort Filter
    if (sortBy === 'name_asc') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'state_asc') {
      list = [...list].sort((a, b) => a.state.localeCompare(b.state));
    }

    return list;
  }, [allDiscoveries, searchQuery, selectedState, selectedCategory, activeInterest, sortBy, showAllDiscoveries]);

  // Handlers
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedState('All');
    setSelectedCategory('All');
    setSortBy('popular');
    setActiveInterest(null);
    setShowAllDiscoveries(false);
  };

  const handleInterestClick = (key: string) => {
    if (activeInterest === key) {
      setActiveInterest(null);
      setSelectedCategory('All');
    } else {
      setActiveInterest(key);
      setSelectedCategory(key);
    }
  };

  const handleResetInterest = () => {
    setActiveInterest(null);
    setSelectedCategory('All');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8 pb-16 font-sans select-none">
      
      {/* ============================================================== */}
      {/* 1. HERO BANNER: "Discover India" with Skyline & Tricolour Line  */}
      {/* ============================================================== */}
      <section className="relative rounded-3xl bg-white border border-stone-200/90 shadow-2xs overflow-hidden p-6 sm:p-10 lg:p-12">
        
        {/* Warm Golden Monument Skyline Silhouette (Taj Mahal, Stupa, Gopuram, Birds) */}
        <div className="absolute right-0 bottom-1 top-0 w-1/2 lg:w-5/12 pointer-events-none flex items-end justify-end overflow-hidden pr-2 pb-1">
          <DiscoverSkyline />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 max-w-2xl space-y-5">
          <div>
            <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#FF6600] inline-block mb-1.5">
              EXPLORE CULTURE, PLACE & TRADITION
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-stone-900 tracking-tight leading-tight">
              Discover India
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl mt-1.5 leading-relaxed">
              Find meaningful places, festivals, arts and living traditions across India.
            </p>
          </div>

          {/* Search Bar Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2.5 max-w-xl pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, festivals, crafts, traditions..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200/90 text-xs sm:text-sm font-medium text-stone-800 placeholder:text-stone-400 outline-none focus:border-[#FF6600] shadow-2xs transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FF6600] hover:bg-[#E65C00] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Search</span>
            </button>
          </form>

          {/* Filter Dropdowns Row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
            {/* 1. State / UT Dropdown */}
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="appearance-none pl-8 pr-7 py-1.5 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-700 outline-none focus:border-[#FF6600] shadow-2xs cursor-pointer hover:bg-stone-50/50"
              >
                <option value="All">State / UT</option>
                {indianStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* 2. Category Dropdown */}
            <div className="relative">
              <LayoutGrid className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setActiveInterest(e.target.value === 'All' ? null : e.target.value);
                }}
                className="appearance-none pl-8 pr-7 py-1.5 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-700 outline-none focus:border-[#FF6600] shadow-2xs cursor-pointer hover:bg-stone-50/50"
              >
                <option value="All">Category</option>
                <option value="heritage">Heritage Places</option>
                <option value="festival">Festivals & Traditions</option>
                <option value="art_craft">Arts & Crafts</option>
                <option value="performing_art">Performing Arts</option>
                <option value="experience">Cultural Experiences</option>
                <option value="story">Cultural Stories</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* 3. Sort by Dropdown */}
            <div className="relative">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-8 pr-7 py-1.5 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-700 outline-none focus:border-[#FF6600] shadow-2xs cursor-pointer hover:bg-stone-50/50"
              >
                <option value="popular">Sort by</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="state_asc">State (A-Z)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* 4. Clear Filters Action */}
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#FF6600] hover:bg-orange-50 transition-colors ml-0.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>

        {/* Indian Tricolour Bottom Line: Saffron, White, Green border spanning full banner bottom */}
        <div className="absolute bottom-0 inset-x-0 flex flex-col h-[4px]">
          <div className="h-[2px] bg-[#FF671F]" />
          <div className="h-[2px] bg-[#046A38]" />
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. EXPLORE BY INTEREST: 6 Category Cards matching reference    */}
      {/* ============================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-1.5 h-5 bg-[#FF6600] rounded-full inline-block mr-2.5" />
            <h2 className="text-xl sm:text-[22px] font-bold text-stone-900 tracking-tight">
              Explore by Interest
            </h2>
          </div>

          <button
            type="button"
            onClick={handleResetInterest}
            className="text-xs sm:text-sm font-semibold text-[#FF6600] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <span className="text-base leading-none">→</span>
          </button>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {interestCategories.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = activeInterest === cat.key;

            return (
              <div
                key={cat.key}
                onClick={() => handleInterestClick(cat.key)}
                className={`p-2 sm:p-2.5 rounded-2xl bg-white border transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-2xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#FF6600] ring-1.5 ring-[#FF6600]/30 bg-orange-50/20'
                    : 'border-stone-200/90 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Thumbnail Image */}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 border border-stone-100 shadow-2xs group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero/monument-1.jpg';
                    }}
                  />

                  {/* Circle Color Badge Icon */}
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white shrink-0 ${cat.badgeBg} shadow-2xs`}
                  >
                    <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                  </div>

                  {/* Title */}
                  <span className="text-[12px] sm:text-[13px] font-bold text-stone-900 group-hover:text-[#FF6600] transition-colors truncate">
                    {cat.title}
                  </span>
                </div>

                {/* Right Chevron Arrow */}
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 group-hover:text-[#FF6600] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. POPULAR DISCOVERIES: 4 Featured Cards matching reference    */}
      {/* ============================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-1.5 h-5 bg-[#FF6600] rounded-full inline-block mr-2.5" />
            <h2 className="text-xl sm:text-[22px] font-bold text-stone-900 tracking-tight">
              Popular Discoveries
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowAllDiscoveries(!showAllDiscoveries)}
            className="text-xs sm:text-sm font-semibold text-[#FF6600] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{showAllDiscoveries ? 'Show Featured' : 'View All Discoveries'}</span>
            <span className="text-base leading-none">→</span>
          </button>
        </div>

        {/* Discoveries Cards Grid */}
        {filteredDiscoveries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/90 p-8 text-center space-y-3 shadow-2xs">
            <p className="text-stone-500 text-sm">
              No cultural discoveries found matching your search criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-orange-50 text-[#FF6600] font-semibold text-xs hover:bg-orange-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredDiscoveries.map((item) => {
              const isSaved = Boolean(savedItems[item.id]);

              return (
                <div
                  key={item.id}
                  onClick={() => onExploreRelated(item.type, item.id)}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  {/* Card Thumbnail Image & Favorite Heart Button */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-stone-100">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/hero/monument-1.jpg';
                      }}
                    />

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(item.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      title={isSaved ? 'Remove from saved' : 'Save to favorites'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform active:scale-125 ${
                          isSaved ? 'fill-red-500 text-red-500' : 'text-white stroke-[2]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Body Information */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      {/* Location with Orange Pin */}
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#FF6600] shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>

                      {/* Monument/Destination Title */}
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-[#FF6600] transition-colors leading-snug">
                        {item.title}
                      </h3>

                      {/* Brief Verified Description */}
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* "View Details →" Action Link */}
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FF6600] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>View Details</span>
                        <span className="text-sm">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
