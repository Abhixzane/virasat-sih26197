import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass, Landmark, Calendar, Palette, Sparkles, MapPin,
  Search, ArrowRight, Bot, Map, ArrowUpRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { HeritagePlace, Festival } from '../types/cultural';
import { HeritageCard } from '../components/cards/HeritageCard';
import { FestivalCard } from '../components/cards/FestivalCard';
import {
  TricolourRibbonWave, MonumentSkyline, StatsCounterBar
} from '../components/shared/TricolourBranding';

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

  // Exact curated 4 featured heritage monuments matching screenshot
  const featuredMonumentsFallback: HeritagePlace[] = [
    {
      id: 'place-taj-mahal',
      name: 'Taj Mahal',
      state: 'Uttar Pradesh',
      city: 'Agra',
      category: 'Mughal Architecture',
      historical_period: '1631 - 1648 CE',
      description: 'An iconic symbol of love and a masterpiece of Mughal architecture, built by Emperor Shah Jahan.',
      historical_significance: 'UNESCO World Heritage Site and New 7 Wonders of the World.',
      architectural_style: 'Mughal Architectural Synthesis',
      latitude: 27.1751,
      longitude: 78.0421,
      image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80',
      source_url: 'https://asi.nic.in',
      verification_status: 'VERIFIED',
    },
    {
      id: 'place-red-fort-delhi',
      name: 'Red Fort',
      state: 'Delhi',
      city: 'Delhi',
      category: 'Forts & Palaces',
      historical_period: '1639 - 1648 CE',
      description: 'A magnificent fort complex and a symbol of India\'s rich history and freedom struggle.',
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
      category: 'Temples & Sacred',
      historical_period: '1250 CE',
      description: 'A 13th-century architectural marvel dedicated to the Sun God, known for its intricate stone carvings.',
      historical_significance: 'Colossal stone chariot with 24 carved wheels serving as sundials.',
      architectural_style: 'Kalinga Temple Architecture',
      latitude: 19.8876,
      longitude: 86.0945,
      image_url: 'https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1200&auto=format&fit=crop&q=80',
      source_url: 'https://asi.nic.in',
      verification_status: 'VERIFIED',
    },
    {
      id: 'place-kashi-vishwanath',
      name: 'Kashi Vishwanath',
      state: 'Uttar Pradesh',
      city: 'Varanasi',
      category: 'Temples & Sacred',
      historical_period: 'Rebuilt 1780 CE',
      description: 'One of the holiest Hindu temples, representing India\'s eternal spiritual heritage.',
      historical_significance: 'One of the twelve sacred Jyotirlingas on the banks of the sacred Ganges River.',
      architectural_style: 'Nagara Style with Gold Spire',
      latitude: 25.3109,
      longitude: 83.0107,
      image_url: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=1200&auto=format&fit=crop&q=80',
      source_url: 'https://uptourism.gov.in',
      verification_status: 'VERIFIED',
    },
  ];

  // Exact curated 4 featured festivals matching screenshot
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
      associated_communities: 'Vihari, Maithil, Bhojpuri communities',
      associated_place_ids: [],
      related_tradition_ids: [],
      image_url: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=1200&auto=format&fit=crop&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80',
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

          // Find matching places if available, otherwise fallback
          const taj = p.find((x) => x.name.toLowerCase().includes('taj')) || featuredMonumentsFallback[0];
          const redFort = p.find((x) => x.name.toLowerCase().includes('red fort')) || featuredMonumentsFallback[1];
          const konark = p.find((x) => x.name.toLowerCase().includes('konark')) || featuredMonumentsFallback[2];
          const kashi = p.find((x) => x.name.toLowerCase().includes('kashi') || x.name.toLowerCase().includes('varanasi')) || featuredMonumentsFallback[3];
          setPlaces([taj, redFort, konark, kashi]);

          const chhath = f.find((x) => x.name.toLowerCase().includes('chhath')) || featuredFestivalsFallback[0];
          const durga = f.find((x) => x.name.toLowerCase().includes('durga')) || featuredFestivalsFallback[1];
          const onam = f.find((x) => x.name.toLowerCase().includes('onam')) || featuredFestivalsFallback[2];
          const kumbh = f.find((x) => x.name.toLowerCase().includes('kumbh')) || featuredFestivalsFallback[3];
          setFestivals([chhath, durga, onam, kumbh]);
        }
      } catch (err) {
        console.error('Failed to load home cultural data, using curated verified defaults:', err);
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

  // 8 Authentic, distinct, high-quality images of iconic Indian monuments and temples
  // Pure visual slides with ZERO monument names, captions, or text overlays
  const heroSlides = [
    { id: 'monument-1', url: '/hero/monument-1.jpg' }, // Taj Mahal, Agra
    { id: 'monument-2', url: '/hero/monument-2.jpg' }, // Meenakshi Amman Temple, Madurai
    { id: 'monument-3', url: '/hero/monument-3.jpg' }, // Varanasi Sacred Ghats & Waterfront
    { id: 'monument-4', url: '/hero/monument-4.jpg' }, // Hampi Virupaksha & Stone Chariot
    { id: 'monument-5', url: '/hero/monument-5.jpg' }, // Amber Fort Palace, Jaipur
    { id: 'monument-6', url: '/hero/monument-6.jpg' }, // Golden Temple (Harmandir Sahib), Amritsar
    { id: 'monument-7', url: '/hero/monument-7.jpg' }, // Konark Sun Temple, Odisha
    { id: 'monument-8', url: '/hero/monument-8.jpg' }, // Khajuraho Sculpted Temple, Madhya Pradesh
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slideshow changing every 3 seconds with smooth fade transitions
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [currentSlide, heroSlides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="w-full">
      {/* 1. Full-Width Automatic Heritage Image Slideshow Hero (100% Flush Edge-to-Edge) */}
      <section className="relative w-full overflow-hidden bg-stone-950 min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex flex-col justify-between select-none shadow-2xl">
        {/* Automatic Image Slideshow Background with Smooth Fade Transitions */}
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
                alt="Indian Cultural Heritage"
                className="w-full h-full object-cover object-center brightness-110 contrast-[1.05]"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Asymmetrical Lighting & Transparency:
              - Left/Center-left side: Gentle gradient scrim for crisp text & search bar contrast
              - Right side: Crystal-clear, high light transparency so the monument architecture is MOST VISIBLE! */}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-stone-950/90 via-stone-950/45 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-44 z-20 bg-gradient-to-t from-stone-950/80 via-stone-950/25 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-24 z-20 bg-gradient-to-b from-stone-950/40 to-transparent pointer-events-none" />
        </div>

        {/* Manual Left/Right Arrow Controls */}
        <button
          type="button"
          onClick={handlePrevSlide}
          className="absolute left-3 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/45 hover:bg-black/75 text-white/85 hover:text-white border border-white/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 group"
          aria-label="Previous monument slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          className="absolute right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/45 hover:bg-black/75 text-white/85 hover:text-white border border-white/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95 group"
          aria-label="Next monument slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Centered Hero Content (Saffron, White, and Green Theme) */}
        <div className="relative z-30 max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-20 lg:pt-24 pb-8 text-center space-y-6">
          {/* Top Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/55 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs">
            <Landmark className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>CONNECTED CULTURAL INTELLIGENCE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-[1.15] drop-shadow-lg">
            Discover India’s Living <br className="hidden sm:inline" />
            <span className="text-[#FF9933] drop-shadow-sm">Cultural</span>{' '}
            <span className="text-[#22c55e] drop-shadow-sm">Heritage</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-stone-200/95 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow">
            Journey across verified UNESCO monuments, vibrant festivals, GI-tagged crafts, and
            classical performing arts. Discover the deep historical, cultural, and living traditions
            that make India unique.
          </p>

          {/* Large Floating Search Bar + AI Guide Button */}
          <div className="pt-2 max-w-2xl mx-auto w-full">
            <div
              onClick={onOpenSearch}
              className="flex items-center justify-between bg-white/95 backdrop-blur-md pl-4 pr-1.5 py-1.5 rounded-full border border-stone-200/80 shadow-2xl hover:bg-white hover:shadow-amber-500/10 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 text-stone-500 group-hover:text-stone-700 text-xs sm:text-sm flex-1 truncate transition-colors">
                <Search className="w-4 h-4 text-stone-400 group-hover:text-[#FF9933] shrink-0 transition-colors" />
                <span className="truncate">Search monuments, festivals, crafts, cities or experiences...</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAIChat('Introduce me to India\'s living cultural heritage');
                }}
                className="px-5 py-2.5 rounded-full bg-[#FF9933] hover:bg-[#CC7A29] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-colors shrink-0"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Ask AI Guide</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Hero Section: Indicators & Tricolour Wave */}
        <div className="relative z-30 w-full pt-4 space-y-3">
          {/* Carousel Indicators (Dots) */}
          <div className="flex items-center justify-center gap-2 z-30">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide
                    ? 'w-7 sm:w-9 h-2 bg-[#FF9933] shadow-md shadow-amber-500/50'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* 3D Flowing Tricolour Ribbon Wave across Hero Bottom */}
          <div className="w-full">
            <TricolourRibbonWave />
          </div>
        </div>
      </section>

      {/* Main Centered Content Container below Full-Width Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
        {/* 2. Royal Bharat Cultural Intelligence Console (Creative Floating Dashboard) */}
        <div className="relative z-30 -mt-12 sm:-mt-16">
          <div className="bg-gradient-to-br from-white via-[#FFFDF9] to-amber-50/80 backdrop-blur-xl rounded-3xl border-2 border-amber-300/70 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
            {/* Top Status & Integrity Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-amber-200/60">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold tracking-wider text-emerald-800 uppercase font-sans">
                  Live Cultural Intelligence Graph
                </span>
                <span className="hidden sm:inline-block text-stone-300">•</span>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-stone-500">
                  36 States & Union Territories Synchronized
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100/80 px-3.5 py-1 rounded-full border border-amber-300/70 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
                <span>ASI & UNESCO Grounded Repository</span>
              </div>
            </div>

            {/* 4 Creative Cultural Metrics with Royal Indian Aesthetics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-6">
              {/* Metric 1 */}
              <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-amber-50/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/25 border border-amber-300/40">
                  <Landmark className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-stone-900 leading-none tracking-tight">
                    {stats ? `${stats.heritage_places}` : '146'}
                  </div>
                  <div className="text-xs font-bold text-stone-800 mt-1.5">
                    Heritage Monuments
                  </div>
                  <div className="text-[11px] text-amber-800/80 font-medium">
                    ASI & UNESCO Protected
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-emerald-50/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/25 border border-emerald-300/40">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-stone-900 leading-none tracking-tight">
                    {stats ? `${stats.states_represented}` : '36'}
                  </div>
                  <div className="text-xs font-bold text-stone-800 mt-1.5">
                    States & Union Territories
                  </div>
                  <div className="text-[11px] text-emerald-800/80 font-medium">
                    100% Pan-Bharat Coverage
                  </div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-orange-50/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/25 border border-orange-300/40">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-stone-900 leading-none tracking-tight">
                    {stats ? `${stats.festivals + stats.crafts}` : '127'}
                  </div>
                  <div className="text-xs font-bold text-stone-800 mt-1.5">
                    Festivals & GI Crafts
                  </div>
                  <div className="text-[11px] text-orange-800/80 font-medium">
                    Living Intangible Heritage
                  </div>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-blue-50/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/25 border border-blue-300/40">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-stone-900 leading-none tracking-tight">
                    {stats ? stats.verification_rate : '100%'}
                  </div>
                  <div className="text-xs font-bold text-stone-800 mt-1.5">
                    Statutory Verified
                  </div>
                  <div className="text-[11px] text-blue-800/80 font-medium">
                    Zero Synthesized Folklore
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. The Virasat Innovation / Connected Cultural Intelligence Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#E05A2B] uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#E05A2B]" />
                <span>THE VIRASAT INNOVATION • विरासत नवाचार</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-stone-900 mt-1">
                Connected Cultural Intelligence
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Unite validated archaeological data, AI insights, and living traditions to explore India's sacred geography — monuments, artisan clusters, rituals, and heritage routes.
              </p>
            </div>

            <Link
              to="/discover"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#E05A2B] hover:underline shrink-0"
            >
              <span>Explore All Connections</span>
              <span>→</span>
            </Link>
          </div>

          {/* 4 Creative Cultural Gateway Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Festivals & Traditions */}
            <Link
              to="/festivals"
              className="group bg-gradient-to-b from-amber-500/10 via-white to-white rounded-3xl border-2 border-amber-300/60 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 to-[#FF9933]" />
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-[#C85A32] flex items-center justify-center border border-amber-400/40 shadow-xs group-hover:scale-105 transition-transform">
                    <Calendar className="w-6 h-6 text-[#C85A32]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-full border border-amber-300/60">
                    67 Festivals
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-stone-900 font-serif group-hover:text-[#E05A2B] transition-colors">
                    Festivals & Rituals
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Living traditions tracked with solar & lunar calendars, community folklore, and rituals.
                  </p>
                </div>

                {/* Micro-preview pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md">Chhath</span>
                  <span className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md">Durga Puja</span>
                  <span className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md">Onam</span>
                </div>
              </div>

              <div className="pt-5 flex items-center justify-between border-t border-stone-100 mt-4">
                <span className="text-xs font-bold text-[#C85A32] group-hover:underline">Explore Celebrations</span>
                <div className="w-8 h-8 rounded-full bg-amber-100 group-hover:bg-[#C85A32] text-amber-900 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Card 2: Monuments & Heritage Sites */}
            <Link
              to="/heritage"
              className="group bg-gradient-to-b from-emerald-500/10 via-white to-white rounded-3xl border-2 border-emerald-300/60 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 to-[#138808]" />
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-800 flex items-center justify-center border border-emerald-400/40 shadow-xs group-hover:scale-105 transition-transform">
                    <Landmark className="w-6 h-6 text-emerald-800" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300/60">
                    146 Monuments
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-stone-900 font-serif group-hover:text-emerald-700 transition-colors">
                    Sacred Monuments
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Colossal rock-cut caves, medieval hill citadels, stepwells, and Dravidian gopurams.
                  </p>
                </div>

                {/* Micro-preview pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md">Dravidian</span>
                  <span className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md">Kalinga</span>
                  <span className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md">Nagara</span>
                </div>
              </div>

              <div className="pt-5 flex items-center justify-between border-t border-stone-100 mt-4">
                <span className="text-xs font-bold text-emerald-700 group-hover:underline">Explore Architecture</span>
                <div className="w-8 h-8 rounded-full bg-emerald-100 group-hover:bg-emerald-700 text-emerald-900 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Card 3: Arts & Crafts */}
            <Link
              to="/arts-crafts"
              className="group bg-gradient-to-b from-purple-500/10 via-white to-white rounded-3xl border-2 border-purple-300/60 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-400 to-indigo-600" />
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-800 flex items-center justify-center border border-purple-400/40 shadow-xs group-hover:scale-105 transition-transform">
                    <Palette className="w-6 h-6 text-purple-800" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100/90 px-2.5 py-1 rounded-full border border-purple-300/60">
                    60 GI Crafts
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-stone-900 font-serif group-hover:text-purple-700 transition-colors">
                    Indigenous GI Crafts
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Handlooms, bronze casting, blue pottery, and lacquered woodcraft from master clusters.
                  </p>
                </div>

                {/* Micro-preview pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md">Blue Pottery</span>
                  <span className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md">Warli</span>
                  <span className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md">Aranmula</span>
                </div>
              </div>

              <div className="pt-5 flex items-center justify-between border-t border-stone-100 mt-4">
                <span className="text-xs font-bold text-purple-700 group-hover:underline">Explore Artisan Guilds</span>
                <div className="w-8 h-8 rounded-full bg-purple-100 group-hover:bg-purple-700 text-purple-900 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Card 4: Heritage Maps */}
            <Link
              to="/cultural-map"
              className="group bg-gradient-to-b from-blue-500/10 via-white to-white rounded-3xl border-2 border-blue-300/60 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-600" />
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-800 flex items-center justify-center border border-blue-400/40 shadow-xs group-hover:scale-105 transition-transform">
                    <Map className="w-6 h-6 text-blue-800" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-100/90 px-2.5 py-1 rounded-full border border-blue-300/60">
                    184 Geo-Pins
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-stone-900 font-serif group-hover:text-blue-700 transition-colors">
                    GIS Cultural Map
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Interactive geospatial map with cluster zoom, category filters, and day itineraries.
                  </p>
                </div>

                {/* Micro-preview pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md">Cluster Zoom</span>
                  <span className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md">Geocoded</span>
                  <span className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md">Itinerary</span>
                </div>
              </div>

              <div className="pt-5 flex items-center justify-between border-t border-stone-100 mt-4">
                <span className="text-xs font-bold text-blue-700 group-hover:underline">Launch Cultural GIS</span>
                <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-700 text-blue-900 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </section>

      {/* 3. Historical Foundations / Featured Heritage Destinations */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E05A2B] uppercase tracking-widest">
              <Landmark className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>HISTORICAL FOUNDATIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">
              Featured Heritage Destinations
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Explore iconic monuments, heritage sites and cultural landmarks across India's rich history.
            </p>
          </div>

          <Link
            to="/heritage"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#E05A2B] hover:underline shrink-0"
          >
            <span>View All Destinations</span>
            <span>→</span>
          </Link>
        </div>

        {/* 4 Monuments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* 4. Living Celebrations / Explore Indian Festivals & Traditions */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E05A2B] uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>LIVING CELEBRATIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">
              Explore Indian Festivals & Traditions
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Experience the vibrant festivals, rituals and cultural traditions that keep India's heritage alive.
            </p>
          </div>

          <Link
            to="/festivals"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#E05A2B] hover:underline shrink-0"
          >
            <span>View All Festivals</span>
            <span>→</span>
          </Link>
        </div>

        {/* 4 Festival Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* 5. Cultural Journey CTA band matching Section 6 Page 1 G */}
      <section className="relative rounded-3xl overflow-hidden bg-[#EAF6EC] border border-[#5FBE72]/40 p-8 sm:p-12 text-center shadow-xs">
        <div className="absolute inset-0 pointer-events-none opacity-15 text-[#138808]">
          <MonumentSkyline opacity={0.2} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#5FBE72]/30 text-[#0F6D07] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#138808]" />
            <span>IMMERSIVE EXPLORATION</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-stone-900">
            Plan Your <span className="text-[#FF9933]">Cultural</span>{' '}
            <span className="text-[#138808]">Journey</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
            Generate geo-clustered daily itineraries, explore verified coordinates on the interactive cultural map, or converse with our retrieval-grounded AI guide.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            {/* Button 1: Generate Itinerary */}
            <Link
              to="/itinerary"
              className="px-6 py-3 rounded-full bg-[#FF9933] hover:bg-[#CC7A29] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow transition-all"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Generate Itinerary</span>
            </Link>

            {/* Button 2: Explore Cultural Map */}
            <Link
              to="/cultural-map"
              className="px-6 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all"
            >
              <Map className="w-4 h-4 text-[#138808]" />
              <span>Explore Cultural Map</span>
            </Link>

            {/* Button 3: Ask VIRASAT AI */}
            <Link
              to="/ai-guide"
              className="px-6 py-3 rounded-full bg-[#138808] hover:bg-[#0F6D07] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow transition-all"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Ask VIRASAT AI</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  </div>
);
};
