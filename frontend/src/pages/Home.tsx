import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Landmark, MapPin, Calendar, Palette, Search,
  Map, ShieldCheck, ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { HeritagePlace, Festival } from '../types/cultural';
import { HeritageCard } from '../components/cards/HeritageCard';
import { FestivalCard } from '../components/cards/FestivalCard';

interface HomePageProps {
  onOpenSearch: () => void;
  onExploreRelated: (type: string, id: string) => void;
  onOpenAIChat: (prompt: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenSearch,
  onExploreRelated,
  onOpenAIChat,
}) => {
  const navigate = useNavigate();

  const [places, setPlaces] = useState<HeritagePlace[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 4 Featured Heritage Destinations matching reference dashboard screenshot
  const featuredMonumentsFallback: HeritagePlace[] = [
    {
      id: 'place-taj-mahal',
      name: 'Taj Mahal',
      state: 'Uttar Pradesh',
      city: 'Agra',
      category: 'UNESCO Heritage',
      historical_period: '1631 - 1648 CE',
      description: 'An eternal symbol of love and Mughal artistry.',
      historical_significance: 'UNESCO World Heritage Site and New 7 Wonders of the World.',
      architectural_style: 'Mughal Architectural Synthesis',
      latitude: 27.1751,
      longitude: 78.0421,
      image_url: '/hero/monument-1.jpg',
      source_url: 'https://asi.nic.in',
      verification_status: 'VERIFIED',
    },
    {
      id: 'place-red-fort-delhi',
      name: 'Red Fort',
      state: 'Delhi',
      city: 'Delhi',
      category: 'Historic Fort',
      historical_period: '1639 - 1648 CE',
      description: 'Iconic fortress of the Mughal Empire.',
      historical_significance: 'Historic seat of the Mughal Empire and national symbol of Indian independence.',
      architectural_style: 'Indo-Islamic & Timurid Style',
      latitude: 28.6562,
      longitude: 77.241,
      image_url: 'https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=1200&auto=format&fit=crop&q=80',
      source_url: 'https://asi.nic.in',
      verification_status: 'VERIFIED',
    },
    {
      id: 'place-konark-sun-temple',
      name: 'Konark Sun Temple',
      state: 'Odisha',
      city: 'Konark',
      category: 'Ancient Temple',
      historical_period: '1250 CE',
      description: 'A masterpiece of Kalinga architecture.',
      historical_significance: 'Colossal stone chariot with 24 carved wheels serving as sundials.',
      architectural_style: 'Kalinga Temple Architecture',
      latitude: 19.8876,
      longitude: 86.0945,
      image_url: '/hero/monument-7.jpg',
      source_url: 'https://asi.nic.in',
      verification_status: 'VERIFIED',
    },
    {
      id: 'place-kashi-vishwanath',
      name: 'Varanasi Ghats',
      state: 'Uttar Pradesh',
      city: 'Varanasi',
      category: 'Spiritual Destination',
      historical_period: 'Ancient Living Heritage',
      description: 'A spiritual city on the banks of the Ganga.',
      historical_significance: 'One of the oldest continuously inhabited sacred riverfronts in the world.',
      architectural_style: 'Nagara Style Ghat Architecture',
      latitude: 25.3109,
      longitude: 83.0107,
      image_url: '/hero/monument-3.jpg',
      source_url: 'https://uptourism.gov.in',
      verification_status: 'VERIFIED',
    },
  ];

  // Curated 4 featured festivals
  const featuredFestivalsFallback: Festival[] = [
    {
      id: 'fest-chhath-puja',
      name: 'Chhath Puja',
      state: 'Bihar',
      region: 'Mithila & Bhojpur',
      category: 'Vedic Festival',
      month_or_season: 'Kartika (October - November)',
      description: 'A sacred Vedic festival dedicated to the Sun God, celebrated with devotion and river rituals.',
      historical_background: 'Mentioned in Mahabharata and Rigveda solar hymns.',
      cultural_significance: 'Ancient eco-worship offering gratitude to Surya and Usha along living waterbodies.',
      celebration_details: 'Four days: Nahay Khay, Kharna, Sandhya Arghya, and Usha Arghya.',
      associated_communities: 'Bihari, Maithil, Bhojpuri communities',
      associated_place_ids: [],
      related_tradition_ids: [],
      image_url: '/festivals/chhath-puja.jpg',
      source_url: 'https://bihartourism.gov.in',
      verification_status: 'VERIFIED',
    },
    {
      id: 'fest-durga-puja',
      name: 'Durga Puja',
      state: 'West Bengal',
      region: 'Kolkata & Bengal',
      category: 'Cultural Festival',
      month_or_season: 'Ashwin (September - October)',
      description: 'A grand festival celebrating Goddess Durga, showcasing art, culture and community spirit.',
      historical_background: 'Patronized by medieval zamindars, now community Sarbojanin celebration.',
      cultural_significance: 'UNESCO Intangible Cultural Heritage of Humanity celebrated through ephemeral pandal architecture.',
      celebration_details: 'Shasthi to Dashami with Dhunuchi dance, Sindoor Khela, and grand immersion.',
      associated_communities: 'Bengali community and artists across India',
      associated_place_ids: [],
      related_tradition_ids: [],
      image_url: '/festivals/durga-puja.jpg',
      source_url: 'https://wbtourism.gov.in',
      verification_status: 'VERIFIED',
    },
    {
      id: 'fest-onam',
      name: 'Onam',
      state: 'Kerala',
      region: 'Malabar & Travancore',
      category: 'Harvest Festival',
      month_or_season: 'Chingam (August - September)',
      description: 'A vibrant harvest festival marked by floral decorations, boat races and traditional feasts.',
      historical_background: 'Celebrates the golden egalitarian reign of mythical King Mahabali.',
      cultural_significance: 'Welcoming King Mahabali with Pookkalam floral art, Vallam Kali boat races, and Onasadya.',
      celebration_details: 'Ten-day celebration climaxing on Thiruvonam with 26-dish vegetarian feast.',
      associated_communities: 'Malayali people across all faiths',
      associated_place_ids: [],
      related_tradition_ids: [],
      image_url: '/festivals/onam.jpg',
      source_url: 'https://keralatourism.org',
      verification_status: 'VERIFIED',
    },
    {
      id: 'fest-kumbh-mela',
      name: 'Kumbh Mela',
      state: 'Uttar Pradesh',
      region: 'Prayagraj Triveni Sangam',
      category: 'Spiritual Festival',
      month_or_season: 'Magh / Chaitra (Cycle)',
      description: 'The world\'s largest spiritual gathering, celebrated in a 12-year cycle at sacred river confluences.',
      historical_background: 'Rooted in the Samudra Manthan nectar drops mythology described by Xuanzang in 7th century CE.',
      cultural_significance: 'UNESCO Intangible Cultural Heritage representing unity, pilgrim faith, and Vedic discourse.',
      celebration_details: 'Shahi Snan (Royal Baths) led by Akhara sadhus at dawn.',
      associated_communities: 'Akharas, Sadhus, and millions of global pilgrims',
      associated_place_ids: [],
      related_tradition_ids: [],
      image_url: '/festivals/kumbh-mela.jpg',
      source_url: 'https://uptourism.gov.in',
      verification_status: 'VERIFIED',
    },
  ];

  const [stats, setStats] = useState<{
    heritage_places: number;
    states_represented: number;
    festivals: number;
    crafts: number;
    performing_arts: number;
    cultural_experiences: number;
    stories: number;
    total_records: number;
    verification_rate: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        const [p, f, st] = await Promise.all([
          api.getHeritagePlaces(),
          api.getFestivals(),
          api.getStatistics().catch(() => null),
        ]);
        if (isMounted) {
          if (st) setStats(st);

          // Find exact matching places or fallback to curated list
          const taj = p.find((x) => x.name.toLowerCase().includes('taj')) || featuredMonumentsFallback[0];
          const redFort = p.find((x) => x.name.toLowerCase().includes('red fort')) || featuredMonumentsFallback[1];
          const konark = p.find((x) => x.name.toLowerCase().includes('konark')) || featuredMonumentsFallback[2];
          const varanasi = p.find((x) => x.name.toLowerCase().includes('kashi') || x.name.toLowerCase().includes('varanasi')) || featuredMonumentsFallback[3];
          setPlaces([taj, redFort, konark, varanasi]);

          const chhath = f.find((x) => x.name.toLowerCase().includes('chhath')) || featuredFestivalsFallback[0];
          const durga = f.find((x) => x.name.toLowerCase().includes('durga')) || featuredFestivalsFallback[1];
          const onam = f.find((x) => x.name.toLowerCase().includes('onam')) || featuredFestivalsFallback[2];
          const kumbh = f.find((x) => x.name.toLowerCase().includes('kumbh')) || featuredFestivalsFallback[3];
          setFestivals([chhath, durga, onam, kumbh]);
        }
      } catch (err) {
        console.error('Failed to load home data, using curated verified defaults:', err);
        if (isMounted) {
          setPlaces(featuredMonumentsFallback);
          setFestivals(featuredFestivalsFallback);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Authentic Indian Heritage Photography Slideshow (starts with Varanasi Sunset Ghats)
  const heroSlides = [
    { id: 'monument-3', url: '/hero/monument-3.jpg', title: 'Varanasi Sacred Ghats' },
    { id: 'monument-1', url: '/hero/monument-1.jpg', title: 'Taj Mahal, Agra' },
    { id: 'monument-2', url: '/hero/monument-2.jpg', title: 'Meenakshi Temple, Madurai' },
    { id: 'monument-4', url: '/hero/monument-4.jpg', title: 'Hampi Virupaksha' },
    { id: 'monument-7', url: '/hero/monument-7.jpg', title: 'Konark Sun Temple' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onOpenSearch();
    }
  };

  const popularTags = [
    { label: 'Taj Mahal', path: '/heritage/place-taj-mahal' },
    { label: 'Jaipur', path: '/search?q=Jaipur' },
    { label: 'Varanasi', path: '/search?q=Varanasi' },
    { label: 'Rajasthan', path: '/search?q=Rajasthan' },
    { label: 'Kerala', path: '/search?q=Kerala' },
    { label: 'Tamil Nadu', path: '/search?q=Tamil%20Nadu' },
    { label: 'Festivals', path: '/festivals' },
    { label: 'GI Crafts', path: '/arts-crafts' },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen text-stone-900 font-sans">
      {/* 1. Full-Width Heritage Hero Banner matching screenshot */}
      <section className="relative w-full overflow-hidden bg-stone-950 min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] flex flex-col justify-between select-none">
        {/* Background Image Slideshow with smooth fade transitions */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.url}
                alt={slide.title}
                className="w-full h-full object-cover object-center brightness-[0.88] contrast-[1.08]"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Scrim Overlay for high legibility */}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-stone-950/20 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 z-20 bg-gradient-to-t from-stone-950/70 to-transparent pointer-events-none" />
        </div>

        {/* Left/Right Subtle Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-xs transition-all shadow-md cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-xs transition-all shadow-md cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Hero Content matching exact screenshot typography and layout */}
        <div className="relative z-30 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12 text-center space-y-4">
          {/* Tagline */}
          <div className="text-white/90 text-xs sm:text-sm font-semibold tracking-wider uppercase">
            Explore • Experience • Preserve
          </div>

          {/* Main Title in bold Arial */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-sm font-sans">
            India's Living Heritage
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-2xl mx-auto leading-relaxed font-normal">
            Discover timeless traditions, vibrant festivals, magnificent monuments and the people who keep our culture alive.
          </p>

          {/* Centralized Search Bar Pill */}
          <div className="pt-3 max-w-2xl mx-auto w-full">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center justify-between bg-white rounded-full pl-4 sm:pl-5 pr-1.5 py-1.5 shadow-2xl border border-white/60 transition-all group"
            >
              <div className="flex items-center gap-3 text-stone-500 text-xs sm:text-sm flex-1 truncate">
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search places, festivals, crafts, experiences..."
                  className="w-full bg-transparent text-stone-800 text-xs sm:text-sm outline-none placeholder:text-stone-400 font-sans"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#FF6600] hover:bg-[#E65100] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Popular Search Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              <span className="text-white/80 text-xs font-semibold mr-1">Popular:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => {
                    if (tag.path.startsWith('/search?q=')) {
                      navigate(tag.path);
                    } else {
                      navigate(tag.path);
                    }
                  }}
                  className="px-3 py-1 rounded-full bg-black/40 hover:bg-black/65 border border-white/20 text-white text-xs font-normal transition-all cursor-pointer backdrop-blur-2xs"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clean bottom transition wave */}
        <div className="relative z-20 w-full h-8 overflow-hidden pointer-events-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-8 text-[#FAF8F5] fill-current"
          >
            <path d="M0,0 C150,90 350,-40 500,60 C650,140 900,20 1200,40 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Main Container below Hero */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14 pb-20">
        
        {/* 2. Attractive Statistics Cards (4 Columns) matching screenshot */}
        <div className="relative z-30 -mt-6 sm:-mt-8">
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Stat 1: 146 Heritage Monuments */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#FFF2E5] text-[#FF6600] flex items-center justify-center shrink-0">
                  <Landmark className="w-6 h-6 text-[#FF6600]" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-stone-900 leading-none">
                    {stats ? stats.heritage_places : '146'}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-stone-800 mt-1">
                    Heritage Monuments
                  </div>
                  <div className="text-[11px] text-stone-500 font-normal">
                    ASI & UNESCO Protected
                  </div>
                </div>
              </div>

              {/* Stat 2: 36 States & Union Territories */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#E6F4EA] text-[#059669] flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-[#059669]" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-stone-900 leading-none">
                    {stats ? stats.states_represented : '36'}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-stone-800 mt-1">
                    States & Union Territories
                  </div>
                  <div className="text-[11px] text-stone-500 font-normal">
                    100% Pan-India Coverage
                  </div>
                </div>
              </div>

              {/* Stat 3: 127 Festivals & GI Crafts */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#FFF8E6] text-[#F59E0B] flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-stone-900 leading-none">
                    {stats ? stats.festivals + stats.crafts : '127'}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-stone-800 mt-1">
                    Festivals & GI Crafts
                  </div>
                  <div className="text-[11px] text-stone-500 font-normal">
                    Living Intangible Heritage
                  </div>
                </div>
              </div>

              {/* Stat 4: 100% Source-Backed */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-stone-900 leading-none">
                    {stats ? stats.verification_rate : '100%'}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-stone-800 mt-1">
                    Source-Backed
                  </div>
                  <div className="text-[11px] text-stone-500 font-normal">
                    Statutory Verified Information
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Connected Cultural Intelligence Section matching screenshot */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="border-l-4 border-[#FF6600] pl-3">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight font-sans">
                Connected Cultural Intelligence
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Explore India's rich cultural landscape through our curated collections.
              </p>
            </div>

            <Link
              to="/discover"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF6600] hover:underline shrink-0"
            >
              <span>Explore All Connections</span>
              <span>→</span>
            </Link>
          </div>

          {/* 4 Cultural Category Cards with authentic images matching reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Festivals & Rituals */}
            <Link
              to="/festivals"
              className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF2E5] text-[#FF6600] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#FF6600]" />
                  </div>
                  {/* Authentic Festival Ritual Preview Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60 shadow-2xs">
                    <img
                      src="/festivals/category-cultural.jpg"
                      alt="Festivals & Rituals"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/festivals/rath-yatra.jpg';
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#FF6600] transition-colors">
                    Festivals & Rituals
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                    Living traditions tracked with solar & lunar calendars, community folklore, and rituals.
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Diwali', 'Holi', 'Chhath', 'Onam'].map((t) => (
                    <span key={t} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#FF6600] group-hover:underline">
                  Explore Celebrations →
                </span>
              </div>
            </Link>

            {/* Card 2: Sacred Monuments */}
            <Link
              to="/heritage"
              className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] text-[#059669] flex items-center justify-center shrink-0">
                    <Landmark className="w-5 h-5 text-[#059669]" />
                  </div>
                  {/* Authentic Temple Architecture Preview Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60 shadow-2xs">
                    <img
                      src="/hero/monument-7.jpg"
                      alt="Sacred Monuments"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#059669] transition-colors">
                    Sacred Monuments
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                    Colossal rock-cut caves, medieval hill citadels, stepwells, and Dravidian masterpieces.
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Khajuraho', 'Hampi', 'Konark', 'Ajanta'].map((t) => (
                    <span key={t} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#059669] group-hover:underline">
                  Explore Architecture →
                </span>
              </div>
            </Link>

            {/* Card 3: Indigenous GI Crafts */}
            <Link
              to="/arts-crafts"
              className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Palette className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                  {/* Authentic Artisan Pottery Painting Preview Image matching screenshot */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60 shadow-2xs">
                    <img
                      src="/craft-jaipur-pottery.jpg"
                      alt="Indigenous GI Crafts"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#7C3AED] transition-colors">
                    Indigenous GI Crafts
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                    Handlooms, bronze casting, blue pottery, and lacquered woodcraft from master clusters.
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Banarasi', 'Kanchipuram', 'Blue Pottery', 'Pashmina'].map((t) => (
                    <span key={t} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7C3AED] group-hover:underline">
                  Explore Artisan Guides →
                </span>
              </div>
            </Link>

            {/* Card 4: GIS Cultural Map */}
            <Link
              to="/cultural-map"
              className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <Map className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  {/* Authentic India Cultural Map Graphic matching screenshot */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60 shadow-2xs">
                    <img
                      src="/map-monuments-art.jpg"
                      alt="GIS Cultural Map"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#2563EB] transition-colors">
                    GIS Cultural Map
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                    Interactive geospatial map with cluster zoom, category filters, and day itineraries.
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Cluster Zoom', 'Routes', 'Nearby', 'Itinerary'].map((t) => (
                    <span key={t} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2563EB] group-hover:underline">
                  Launch Cultural GIS →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* 4. Featured Heritage Destinations Section matching screenshot */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="border-l-4 border-[#FF6600] pl-3">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight font-sans">
                Featured Heritage Destinations
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Explore iconic monuments, heritage sites and cultural landmarks across India's rich history.
              </p>
            </div>

            <Link
              to="/heritage"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF6600] hover:underline shrink-0"
            >
              <span>View All Destinations</span>
              <span>→</span>
            </Link>
          </div>

          {/* 4 Monument Cards matching screenshot (Taj Mahal, Red Fort, Konark, Varanasi Ghats) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {places.map((place) => (
              <HeritageCard
                key={place.id}
                place={place}
                onExploreRelated={onExploreRelated}
                onClick={() => onExploreRelated('heritage', place.id)}
              />
            ))}
          </div>
        </section>

        {/* 5. Living Celebrations: Explore Indian Festivals & Traditions */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="border-l-4 border-[#FF6600] pl-3">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight font-sans">
                Explore Indian Festivals & Traditions
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Experience the vibrant festivals, rituals and cultural traditions that keep India's heritage alive.
              </p>
            </div>

            <Link
              to="/festivals"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF6600] hover:underline shrink-0"
            >
              <span>View All Festivals</span>
              <span>→</span>
            </Link>
          </div>

          {/* 4 Festival Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {festivals.map((fest) => (
              <FestivalCard
                key={fest.id}
                festival={fest}
                onExploreRelated={onExploreRelated}
                onClick={() => onExploreRelated('festival', fest.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
