import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass, Landmark, Calendar, Palette, Music, Navigation,
  BookOpen, Search, ArrowRight, Heart, Filter, ChevronDown,
  RotateCcw, Bot, Grid
} from 'lucide-react';
import {
  TricolourRibbonWave, MonumentSkyline, IndiaMapGraphic
} from '../components/shared/TricolourBranding';

interface DiscoverPageProps {
  onExploreRelated: (type: string, id: string) => void;
  onOpenAIChat: (prompt: string) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  onExploreRelated,
  onOpenAIChat,
}) => {
  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [activeInterest, setActiveInterest] = useState('Heritage Places');
  const [savedItems, setSavedItems] = useState<Record<string, boolean>>({});

  const toggleSave = (id: string) => {
    setSavedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedState('All');
    setSelectedCategory('All');
    setSortBy('popular');
  };

  // 6 Interests matching screenshot
  const interestsList = [
    { label: 'Heritage Places', icon: Landmark, route: '/heritage' },
    { label: 'Festivals & Traditions', icon: Calendar, route: '/festivals' },
    { label: 'Arts & Crafts', icon: Palette, route: '/arts-crafts' },
    { label: 'Performing Arts', icon: Music, route: '/performing-arts' },
    { label: 'Cultural Experiences', icon: Navigation, route: '/experiences' },
    { label: 'Cultural Stories', icon: BookOpen, route: '/stories' },
  ];

  // 6 Popular Discoveries matching screenshot
  const popularDiscoveries = [
    {
      id: 'hampi',
      title: 'Hampi',
      location: 'Karnataka',
      badge: 'Heritage Place',
      badgeColor: 'bg-blue-600 text-white',
      description: 'A UNESCO World Heritage Site with magnificent temple ruins and rich history.',
      image_url: 'https://images.unsplash.com/photo-1600100397608-f010f4460759?w=800&auto=format&fit=crop&q=80',
      type: 'heritage',
      targetId: 'place-hampi-vittala',
    },
    {
      id: 'chhath-puja',
      title: 'Chhath Puja',
      location: 'Bihar',
      badge: 'Festival & Tradition',
      badgeColor: 'bg-amber-600 text-white',
      description: 'A sacred festival dedicated to Sun God, symbolizing devotion, purity and nature\'s harmony.',
      image_url: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=800&auto=format&fit=crop&q=80',
      type: 'festival',
      targetId: 'fest-chhath-puja',
    },
    {
      id: 'madhubani-painting',
      title: 'Madhubani Painting',
      location: 'Bihar',
      badge: 'Arts & Crafts',
      badgeColor: 'bg-emerald-700 text-white',
      description: 'A traditional art form known for its vibrant colors and intricate patterns.',
      image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      type: 'art_craft',
      targetId: 'art-madhubani-painting',
    },
    {
      id: 'kathakali',
      title: 'Kathakali',
      location: 'Kerala',
      badge: 'Performing Art',
      badgeColor: 'bg-amber-700 text-white',
      description: 'A classical dance form known for its expressive storytelling and unique makeup.',
      image_url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80',
      type: 'performing_art',
      targetId: 'art-kathakali',
    },
    {
      id: 'kerala-backwaters',
      title: 'Kerala Backwaters',
      location: 'Kerala',
      badge: 'Cultural Experience',
      badgeColor: 'bg-teal-700 text-white',
      description: 'Experience serene backwaters, local traditions and unique cultural lifestyle.',
      image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
      type: 'experience',
      targetId: 'exp-kerala-houseboat',
    },
    {
      id: 'ancient-manuscripts',
      title: 'Ancient Indian Manuscripts',
      location: 'Various States',
      badge: 'Cultural Story',
      badgeColor: 'bg-amber-600 text-white',
      description: 'Discover India\'s rich knowledge traditions preserved through manuscripts.',
      image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      type: 'story',
      targetId: 'story-sacred-bodhi-tree',
    },
  ];

  // 8 States matching screenshot
  const statesList = [
    { name: 'Bihar', count: 24 },
    { name: 'Maharashtra', count: 32 },
    { name: 'Rajasthan', count: 48 },
    { name: 'Kerala', count: 28 },
    { name: 'Uttar Pradesh', count: 52 },
    { name: 'Karnataka', count: 38 },
    { name: 'Odisha', count: 22 },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/heritage?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header Banner matching screenshot media_1790496098606.jpg */}
      <section className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-stone-200/90 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="absolute top-0 inset-x-0 h-40 overflow-hidden pointer-events-none opacity-20 text-[#D4AF37]">
          <MonumentSkyline opacity={0.2} />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#E05A2B]">
              EXPLORE CULTURE, PLACE & TRADITION
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-900">
              Discover India
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              Find meaningful places, festivals, arts and living traditions across India.
            </p>
          </div>

          {/* Search Bar + Filters Row */}
          <div className="space-y-3 pt-2">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations, festivals, crafts, traditions..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 outline-none text-xs sm:text-sm font-medium focus:border-[#E05A2B] shadow-2xs"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#E05A2B] hover:bg-[#D04E20] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </form>

            {/* Filter Dropdowns Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* State Dropdown */}
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 outline-none focus:border-[#E05A2B] shadow-2xs cursor-pointer"
                >
                  <option value="All">State / UT</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Kerala">Kerala</option>
                </select>
                <Compass className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 outline-none focus:border-[#E05A2B] shadow-2xs cursor-pointer"
                >
                  <option value="All">Category</option>
                  <option value="Monuments">Monuments</option>
                  <option value="Festivals">Festivals</option>
                  <option value="Crafts">Traditional Crafts</option>
                  <option value="Performing Arts">Performing Arts</option>
                  <option value="Experiences">Experiences</option>
                </select>
                <Grid className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 outline-none focus:border-[#E05A2B] shadow-2xs cursor-pointer"
                >
                  <option value="popular">Sort by</option>
                  <option value="historical">Historical Antiquity</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                </select>
                <Filter className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#E05A2B] hover:bg-orange-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tricolour Ribbon Wave in Banner */}
        <div className="pt-6">
          <TricolourRibbonWave />
        </div>
      </section>

      {/* 2. Explore by Interest Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 bg-[#E05A2B] rounded-full inline-block" />
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            Explore by Interest
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {interestsList.map((item) => {
            const Icon = item.icon;
            const isSelected = activeInterest === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveInterest(item.label);
                  navigate(item.route);
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#FFF8EE] border-[#FCD34D] shadow-xs'
                    : 'bg-white border-stone-200/90 hover:border-amber-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#E05A2B] text-white'
                        : 'bg-stone-50 text-stone-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-stone-900 truncate">
                    {item.label}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0 ml-1" />
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Popular Discoveries Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-[#E05A2B] rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              Popular Discoveries
            </h2>
          </div>
          <Link
            to="/heritage"
            className="text-xs font-bold text-[#E05A2B] hover:underline flex items-center gap-1"
          >
            <span>View All Discoveries</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDiscoveries.map((item) => {
            const isSaved = Boolean(savedItems[item.id]);
            return (
              <div
                key={item.id}
                onClick={() => onExploreRelated(item.type, item.targetId)}
                className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                  {/* Top-Left Badge */}
                  <div
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${item.badgeColor}`}
                  >
                    {item.badge}
                  </div>

                  {/* Top-Right Heart Save Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(item.id);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isSaved ? 'fill-red-500 text-red-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#E05A2B] transition-colors font-serif">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                      <Compass className="w-3.5 h-3.5 text-[#E05A2B]" />
                      <span>{item.location}</span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#E05A2B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Discover by State Section matching screenshot */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-[#E05A2B] rounded-full inline-block" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
                Discover by State
              </h2>
              <p className="text-xs text-stone-500">
                Explore India's diverse heritage, festivals, arts and traditions state by state.
              </p>
            </div>
          </div>
          <Link
            to="/heritage"
            className="text-xs font-bold text-[#E05A2B] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All States</span>
            <span>→</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8 shadow-2xs">
          {/* Left: India Map Graphic */}
          <div className="w-full lg:w-1/3 flex justify-center items-center py-4">
            <IndiaMapGraphic className="w-56 h-64" />
          </div>

          {/* Right: State Cards Grid */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {statesList.map((st) => (
              <button
                key={st.name}
                onClick={() => navigate(`/heritage?state=${encodeURIComponent(st.name)}`)}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-stone-50/70 hover:bg-[#FFF8EE] border border-stone-200/80 hover:border-[#FCD34D] transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-[#E05A2B] shadow-2xs group-hover:scale-105 transition-transform">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-stone-900 font-serif">
                      {st.name}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#E05A2B] group-hover:translate-x-1 transition-all" />
              </button>
            ))}

            {/* View All States Card */}
            <button
              onClick={() => navigate('/heritage')}
              className="group flex items-center justify-between p-3.5 rounded-2xl bg-stone-50/70 hover:bg-[#FFF8EE] border border-stone-200/80 hover:border-[#FCD34D] transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-[#E05A2B] shadow-2xs group-hover:scale-105 transition-transform">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900 font-serif">
                    View All States
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#E05A2B] group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. AI Cultural Guide Promo Callout Banner matching screenshot */}
      <section className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#E05A2B] flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Not sure where to begin?
            </h3>
            <p className="text-xs text-stone-600">
              Ask VIRASAT AI to find cultural discoveries for your interests.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenAIChat('Help me discover cultural places based on my interests')}
          className="px-6 py-2.5 rounded-xl bg-[#E05A2B] hover:bg-[#D04E20] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <span>Ask the Cultural Guide</span>
          <span>→</span>
        </button>
      </section>
    </div>
  );
};
