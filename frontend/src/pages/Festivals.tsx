import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, Filter, Search, Sparkles, Sun, Moon,
  Flower2, Wind, CloudRain, Snowflake, ArrowRight,
  ChevronLeft, ChevronRight, ChevronDown, Check
} from 'lucide-react';
import { api } from '../services/api';
import { Festival } from '../types/cultural';
import { FestivalCard } from '../components/cards/FestivalCard';
import { StatsCounterBar } from '../components/shared/TricolourBranding';

interface FestivalsPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const FestivalsPage: React.FC<FestivalsPageProps> = ({ onExploreRelated }) => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [moreMonthsOpen, setMoreMonthsOpen] = useState(false);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  // 12 Authentic Indian Festivals requested
  // Pure visual photography with ZERO text overlay or titles on the images
  const festivalSlides = [
    { id: 'ganga-aarti', name: 'Ganga Aarti', url: '/festivals/ganga-aarti.jpg' },
    { id: 'rath-yatra', name: 'Jagannath Rath Yatra', url: '/festivals/rath-yatra.jpg' },
    { id: 'holi', name: 'Holi', url: '/festivals/holi.jpg' },
    { id: 'diwali', name: 'Diwali', url: '/festivals/diwali.jpg' },
    { id: 'kumbh-mela', name: 'Maha Kumbh Mela', url: '/festivals/kumbh-mela.jpg' },
    { id: 'janmashtami', name: 'Krishna Janmashtami', url: '/festivals/janmashtami.jpg' },
    { id: 'dahi-handi', name: 'Dahi Handi', url: '/festivals/dahi-handi.jpg' },
    { id: 'durga-puja', name: 'Durga Puja', url: '/festivals/durga-puja.jpg' },
    { id: 'onam', name: 'Onam', url: '/festivals/onam.jpg' },
    { id: 'chhath-puja', name: 'Chhath Puja', url: '/festivals/chhath-puja.jpg' },
    { id: 'ganesh-chaturthi', name: 'Ganesh Chaturthi', url: '/festivals/ganesh-chaturthi.jpg' },
    { id: 'pushkar-fair', name: 'Pushkar Camel Fair', url: '/festivals/pushkar-fair.jpg' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic transition every 3 seconds with smooth fade
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % festivalSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [currentSlide, festivalSlides.length]);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + festivalSlides.length) % festivalSlides.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % festivalSlides.length);
  };

  // Close more months dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setMoreMonthsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchFestivals = async () => {
      setLoading(true);
      try {
        const data = await api.getFestivals();
        if (isMounted) setFestivals(data);
      } catch (err) {
        console.error('Failed to load festivals:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchFestivals();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    'All',
    'Vedic Festivals',
    'Harvest Festivals',
    'Spiritual Festivals',
    'Cultural Festivals',
    'Tribal Festivals',
  ];

  const primaryMonths = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const moreMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const statesList = [
    'All', 'Bihar', 'West Bengal', 'Kerala', 'Uttar Pradesh',
    'Maharashtra', 'Karnataka', 'Odisha', 'Assam', 'Rajasthan', 'Nagaland', 'Ladakh'
  ];

  // 5 Featured Category Cards matching reference screenshot
  const featuredCategories = [
    {
      key: 'Vedic Festivals',
      label: 'Vedic Festivals',
      badgeClass: 'bg-emerald-900/85 text-emerald-200 border-emerald-500/40',
      count: '28 Festivals',
      image: '/festivals/category-vedic.jpg',
    },
    {
      key: 'Harvest Festivals',
      label: 'Harvest Festivals',
      badgeClass: 'bg-amber-900/85 text-amber-200 border-amber-500/40',
      count: '19 Festivals',
      image: '/festivals/category-harvest.jpg',
    },
    {
      key: 'Spiritual Festivals',
      label: 'Spiritual Festivals',
      badgeClass: 'bg-purple-950/85 text-purple-200 border-purple-500/40',
      count: '32 Festivals',
      image: '/festivals/category-spiritual.jpg',
    },
    {
      key: 'Cultural Festivals',
      label: 'Cultural Festivals',
      badgeClass: 'bg-rose-950/85 text-rose-200 border-rose-500/40',
      count: '26 Festivals',
      image: '/festivals/category-cultural.jpg',
    },
    {
      key: 'Tribal Festivals',
      label: 'Tribal Heritage',
      badgeClass: 'bg-stone-900/85 text-amber-100 border-amber-600/40',
      count: '18 Festivals',
      image: '/festivals/category-tribal.jpg',
    },
  ];

  // Vedic 6 Ritus (Seasons)
  const seasonsData = [
    { name: 'Vasant (Spring)', months: 'Chaitra - Vaisakha (Mar-May)', icon: Flower2, fest: 'Holi, Bihu, Baisakhi', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { name: 'Grishma (Summer)', months: 'Jyeshtha - Ashadha (May-Jul)', icon: Sun, fest: 'Rath Yatra, Ganga Dussehra', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { name: 'Varsha (Monsoon)', months: 'Shravana - Bhadrapada (Jul-Sep)', icon: CloudRain, fest: 'Onam, Raksha Bandhan, Janmashtami', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { name: 'Sharad (Autumn)', months: 'Ashwin - Kartika (Sep-Nov)', icon: Wind, fest: 'Durga Puja, Navratri, Dussehra', color: 'bg-orange-50 text-orange-800 border-orange-200' },
    { name: 'Hemant (Pre-Winter)', months: 'Agrahayana - Pausha (Nov-Jan)', icon: Moon, fest: 'Diwali, Chhath Puja, Hornbill', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { name: 'Shishir (Winter)', months: 'Magha - Phalguna (Jan-Mar)', icon: Snowflake, fest: 'Makar Sankranti, Pongal, Kumbh Mela', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  ];

  const filteredFestivals = festivals.filter((f) => {
    // Category filter
    if (selectedCategory !== 'All') {
      const catLower = (f.category || '').toLowerCase();
      const nameLower = (f.name || '').toLowerCase();
      const combined = `${catLower} ${nameLower}`;
      if (selectedCategory === 'Vedic Festivals' && !combined.includes('vedic') && !combined.includes('solar') && !combined.includes('ritua') && !combined.includes('yajna') && !combined.includes('homa')) {
        return false;
      }
      if (selectedCategory === 'Harvest Festivals' && !combined.includes('harvest') && !combined.includes('agrarian') && !combined.includes('thanksgiving') && !combined.includes('bihu') && !combined.includes('pongal') && !combined.includes('onam') && !combined.includes('sankranti') && !combined.includes('baisakhi')) {
        return false;
      }
      if (selectedCategory === 'Spiritual Festivals' && !combined.includes('spiritual') && !combined.includes('sacred') && !combined.includes('temple') && !combined.includes('pilgrimage') && !combined.includes('kumbh') && !combined.includes('deepawali') && !combined.includes('puja')) {
        return false;
      }
      if (selectedCategory === 'Cultural Festivals' && !combined.includes('cultural') && !combined.includes('heritage') && !combined.includes('pageant') && !combined.includes('carnival') && !combined.includes('dance') && !combined.includes('mela') && !combined.includes('yatra')) {
        return false;
      }
      if (selectedCategory === 'Tribal Festivals' && !combined.includes('tribal') && !combined.includes('indigenous') && !combined.includes('folk') && !combined.includes('hornbill') && !combined.includes('wangala') && !combined.includes('bastar') && !combined.includes('sarhul')) {
        return false;
      }
    }

    // Month filter
    if (selectedMonth !== 'All') {
      const monthLower = selectedMonth.toLowerCase();
      const fMonth = (f.month_or_season || '').toLowerCase();
      if (!fMonth.includes(monthLower)) {
        return false;
      }
    }

    // State filter
    if (selectedState !== 'All' && f.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = f.name?.toLowerCase().includes(q);
      const matchState = f.state?.toLowerCase().includes(q);
      const matchDesc = f.description?.toLowerCase().includes(q);
      const matchComm = f.associated_communities?.toLowerCase().includes(q);
      const matchCat = f.category?.toLowerCase().includes(q);
      if (!matchName && !matchState && !matchDesc && !matchComm && !matchCat) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-16 bg-[#FFFDF9]">
      {/* 1. Full-Width Premium Image Slideshow Hero (12 Authentic Festivals, No Text Overlays) */}
      <section className="relative w-full rounded-3xl overflow-hidden bg-stone-950 shadow-xl border border-stone-200/60 min-h-[300px] sm:min-h-[400px] md:min-h-[460px] lg:min-h-[520px] flex items-center justify-center select-none group">
        {/* Slides Container */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {festivalSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.url}
                alt=""
                className="w-full h-full object-cover object-center brightness-105 contrast-[1.02]"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Gentle scrim at bottom for indicator pill contrast */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none z-20" />
        </div>

        {/* Manual Left/Right Arrow Navigation */}
        <button
          type="button"
          onClick={handlePrevSlide}
          className="absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-stone-800 shadow-xl flex items-center justify-center border border-stone-200/50 hover:scale-105 active:scale-95 transition-all cursor-pointer group/btn"
          aria-label="Previous festival slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-stone-800 group-hover/btn:-translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          className="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-stone-800 shadow-xl flex items-center justify-center border border-stone-200/50 hover:scale-105 active:scale-95 transition-all cursor-pointer group/btn"
          aria-label="Next festival slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-stone-800 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>

        {/* Bottom Navigation Indicators (Dots) */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20">
          {festivalSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              className={`transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? 'w-6 sm:w-7 h-2 rounded-full bg-[#FF6600] shadow-xs'
                  : 'w-2 h-2 rounded-full bg-white/70 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Filter Bar Matching Reference Screenshot Exactly */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Left: Festival Type Filter */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mr-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>Festival Type:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#E05A2B] text-white shadow-xs'
                    : 'bg-stone-50 text-stone-700 border border-stone-200/80 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Middle/Right: Month Filter & Search Box */}
          <div className="flex flex-wrap items-center gap-3 pt-2 xl:pt-0 border-t xl:border-t-0 border-stone-100">
            {/* Month Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1 mr-1 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-[#E05A2B]" />
                <span>Month:</span>
              </span>
              {primaryMonths.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMonth(m)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedMonth === m
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                      : 'text-stone-600 hover:bg-stone-100 bg-stone-50/80 border border-stone-200/60'
                  }`}
                >
                  {m}
                </button>
              ))}

              {/* More Months Dropdown */}
              <div className="relative" ref={moreDropdownRef}>
                <button
                  type="button"
                  onClick={() => setMoreMonthsOpen(!moreMonthsOpen)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    moreMonths.includes(selectedMonth)
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                      : 'text-stone-600 hover:bg-stone-100 bg-stone-50/80 border border-stone-200/60'
                  }`}
                >
                  <span>{moreMonths.includes(selectedMonth) ? selectedMonth : 'More'}</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>

                {moreMonthsOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-32 bg-white border border-stone-200 rounded-xl shadow-xl py-1 z-50 animate-fadeIn text-xs">
                    {moreMonths.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setSelectedMonth(m);
                          setMoreMonthsOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 transition-colors cursor-pointer flex items-center justify-between ${
                          selectedMonth === m
                            ? 'bg-[#FFF2E5] text-[#FF6600] font-bold'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span>{m}</span>
                        {selectedMonth === m && <Check className="w-3 h-3 text-[#FF6600]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full sm:w-64 lg:w-72">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search festivals, rituals, or places..."
                className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-[#F9FAFB] hover:bg-stone-100/60 focus:bg-white border border-stone-200 focus:border-[#FF6600] outline-none text-stone-800 placeholder-stone-400 transition-all shadow-2xs font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. 5 Category Cards Matching Reference Screenshot Exactly */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {featuredCategories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <div
              key={cat.key}
              onClick={() => setSelectedCategory(isSelected ? 'All' : cat.key)}
              className={`group relative h-28 sm:h-32 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer border flex flex-col justify-between p-3 select-none ${
                isSelected ? 'ring-2 ring-[#FF6600] border-transparent scale-[1.02]' : 'border-stone-200/90'
              }`}
            >
              {/* Background Photo */}
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />

              {/* Top Category Badge */}
              <div className="relative z-10 self-start">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md border ${cat.badgeClass}`}>
                  <span>✦</span> {cat.label}
                </span>
              </div>

              {/* Bottom Count and Arrow */}
              <div className="relative z-10 flex items-center justify-between text-white pt-2">
                <span className="text-xs font-semibold drop-shadow">{cat.count}</span>
                <div className="w-5 h-5 rounded-full bg-white text-stone-800 flex items-center justify-center text-[10px] font-bold shadow-xs group-hover:bg-[#FF6600] group-hover:text-white transition-colors">
                  →
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. State Filter Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-stone-600 shrink-0">Filter by State:</span>
        {statesList.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setSelectedState(st)}
            className={`px-3 py-1 rounded-full shrink-0 font-medium transition-all cursor-pointer ${
              selectedState === st
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* 5. Grid of Verified Festivals */}
      {loading ? (
        <div className="py-24 text-center text-stone-400 text-sm flex items-center justify-center gap-2 bg-white rounded-3xl border border-stone-200">
          <div className="w-5 h-5 border-2 border-[#E05A2B] border-t-transparent rounded-full animate-spin" />
          <span>Retrieving verified festivals from database...</span>
        </div>
      ) : filteredFestivals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFestivals.map((fest) => (
            <FestivalCard
              key={fest.id}
              festival={fest}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('festival', fest.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
          <p className="font-semibold text-sm">No festivals found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedMonth('All');
              setSelectedState('All');
              setSearchQuery('');
            }}
            className="mt-2 text-xs font-bold text-[#E05A2B] hover:underline cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* 6. Seasonal Cycle of India (The 6 Vedic Ritus) */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E05A2B] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASTRONOMICAL & AGRARIAN HARMONY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            The Living Cycle: India’s Six Vedic Seasons (Shad Ritu)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Unlike binary calendars, India's festivals are calibrated with the sun, moon, and agricultural rhythms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {seasonsData.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.name}
                className={`p-4 rounded-2xl border transition-all hover:shadow-xs flex items-start gap-3.5 ${s.color}`}
              >
                <div className="p-2 rounded-xl bg-white/80 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold font-serif">{s.name}</h3>
                  <div className="text-[11px] font-medium opacity-80">{s.months}</div>
                  <div className="text-xs font-semibold pt-1">
                    Festivals: <span className="font-normal">{s.fest}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Stats Bar */}
      <section>
        <StatsCounterBar
          item1={{ count: '100+', label: 'Annual Living Traditions' }}
          item2={{ count: '36', label: 'States & UT Calendars' }}
          item3={{ count: '6', label: 'Vedic Ritus (Seasons)' }}
          item4={{ count: '100%', label: 'Grounded Ritual Provenance' }}
        />
      </section>
    </div>
  );
};
