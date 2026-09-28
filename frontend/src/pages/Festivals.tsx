import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, Filter, Search, Sparkles, Sun, Moon,
  Flower2, Wind, CloudRain, Snowflake, ArrowRight,
  ChevronLeft, ChevronRight, ChevronDown, Check, MapPin
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

  // 12 Authentic Indian Festivals with rich cultural chronicle metadata
  const festivalSlides = [
    {
      id: 'rath-yatra',
      name: 'Jagannath Rath Yatra',
      hindiName: 'श्री जगन्नाथ रथयात्रा',
      location: 'Puri, Odisha',
      tithi: 'Ashadha Shukla Dwitiya • June–July',
      category: 'Sacred Chariot Procession',
      badge: 'Bada Danda Grand Circuit',
      quote: 'Colossal wooden chariots (Nandighosha, Taladhwaja, Darpadalana) hand-built anew from sacred timber, pulled by a million devotees to Gundicha Temple.',
      url: '/festivals/rath-yatra.jpg',
      mapUrl: '/cultural-map?city=Puri&state=Odisha'
    },
    {
      id: 'ganga-aarti',
      name: 'Maha Ganga Aarti',
      hindiName: 'महा गंगा आरती',
      location: 'Varanasi & Haridwar',
      tithi: 'Daily Twilight (Sandhya Kal) • Year-round',
      category: 'Vedic Fire Offering & River Veneration',
      badge: 'Dashashwamedh & Har Ki Pauri',
      quote: 'Multitiered brass deepams waved in synchronized rhythmic devotion by Vedic priests amidst conch blasts, chanting, and floating marigold lamps.',
      url: '/festivals/ganga-aarti.jpg',
      mapUrl: '/cultural-map?city=Varanasi&state=Uttar%20Pradesh'
    },
    {
      id: 'durga-puja',
      name: 'Kolkata Durga Puja',
      hindiName: 'শারদীয়া দুর্গাপূজা',
      location: 'Kolkata, West Bengal',
      tithi: 'Ashwin Shukla Shashthi to Dashami • Sep–Oct',
      category: 'UNESCO Intangible Cultural Heritage',
      badge: 'Master Clay Sculpting & Dhunuchi Dance',
      quote: 'Over 3,000 architectural public pandals celebrating the triumph of Mahishasuramardini with Kumartuli clay idols, dhak percussion, and Sindoor Khela.',
      url: '/festivals/durga-puja.jpg',
      mapUrl: '/cultural-map?city=Kolkata&state=West%20Bengal'
    },
    {
      id: 'kumbh-mela',
      name: 'Maha Kumbh Mela',
      hindiName: 'महाकुंभ पर्व',
      location: 'Prayagraj, Haridwar, Ujjain, Nashik',
      tithi: 'Brihaspati-Surya Celestial Alignment',
      category: 'World’s Largest Peaceful Gathering',
      badge: 'Shahi Snan & Akhada Traditions',
      quote: 'Tens of millions of ascetics, sadhus, and pilgrims immerse at the sacred Sangam confluence, perpetuating millennia-old Sanatana monastic traditions.',
      url: '/festivals/kumbh-mela.jpg',
      mapUrl: '/cultural-map?city=Prayagraj&state=Uttar%20Pradesh'
    },
    {
      id: 'chhath-puja',
      name: 'Mahaparva Chhath',
      hindiName: 'महापर्व छठ पूजा',
      location: 'Bihar, Jharkhand & Uttar Pradesh',
      tithi: 'Kartik Shukla Chaturthi to Saptami • Oct–Nov',
      category: 'Vedic Solar & Riverine Thanksgiving',
      badge: 'Nirjala Vrat & Arghya to Surya Dev',
      quote: 'An ancient Vedic ritual of austere 36-hour waterless fasting; vratees offer thekua and bamboo soop offerings to the setting and rising sun.',
      url: '/festivals/chhath-puja.jpg',
      mapUrl: '/cultural-map?city=Patna&state=Bihar'
    },
    {
      id: 'onam',
      name: 'Thiruvonam Utsavam',
      hindiName: 'തിരുവോണം ഉത്സവം',
      location: 'Kerala',
      tithi: 'Chingam Lunar Month • August–September',
      category: 'Harvest Homecoming & Folk Splendour',
      badge: 'Pookalam, Vallam Kali & Onasadya',
      quote: 'Welcoming the benevolent mythical king Mahabali with intricate flower carpets (Pookalam), thunderous snake-boat races, and 26-dish grand feasts.',
      url: '/festivals/onam.jpg',
      mapUrl: '/cultural-map?city=Kochi&state=Kerala'
    },
    {
      id: 'holi',
      name: 'Braj Lathmar & Basant Holi',
      hindiName: 'ब्रज की लठमार व रंगोत्सव',
      location: 'Barsana, Nandgaon & Mathura, UP',
      tithi: 'Phalguna Purnima • February–March',
      category: 'Living Krishna Lore & Spring Festivity',
      badge: 'Natural Tesu Flowers & Gulal',
      quote: 'Dynamic re-enactment of the divine Radha-Krishna Leela with playful bamboo shields, rhythmic chaupai songs, and fragrant saffron water.',
      url: '/festivals/holi.jpg',
      mapUrl: '/cultural-map?city=Mathura&state=Uttar%20Pradesh'
    },
    {
      id: 'diwali',
      name: 'Deepawali & Dev Deepawali',
      hindiName: 'दीपावली एवं देव दीपावली',
      location: 'Pan-India & Varanasi Ghats',
      tithi: 'Kartik Amavasya & Kartik Purnima • Oct–Nov',
      category: 'Festival of Lights & Cosmic Victory',
      badge: '1 Million Earthen Diyas on Ghats',
      quote: 'The triumph of righteousness illuminating every doorstep with handmade terracotta lamps; Kashi ghats transformed into a golden stairway to the gods.',
      url: '/festivals/diwali.jpg',
      mapUrl: '/cultural-map?city=Varanasi&state=Uttar%20Pradesh'
    },
    {
      id: 'ganesh-chaturthi',
      name: 'Ganeshotsav & Visarjan',
      hindiName: 'श्री गणेश चतुर्थी महोत्सव',
      location: 'Maharashtra & Goa',
      tithi: 'Bhadrapada Shukla Chaturthi • Aug–Sep',
      category: 'Community Solidarity & Dhol Tasha',
      badge: 'Lokmanya Tilak Public Tradition',
      quote: 'Vibrant sarvajanik mandals welcoming Lord Ganesha with energetic Dhol-Tasha pathaks, culminating in poignant seaward Visarjan processions.',
      url: '/festivals/ganesh-chaturthi.jpg',
      mapUrl: '/cultural-map?city=Mumbai&state=Maharashtra'
    },
    {
      id: 'pushkar-fair',
      name: 'Pushkar Mela & Kartik Snan',
      hindiName: 'पुष्कर मेला एवं कार्तिक स्नान',
      location: 'Pushkar, Rajasthan',
      tithi: 'Kartik Shukla Ekadashi to Purnima • Nov',
      category: 'Desert Pastoral Gathering & Sacred Lake',
      badge: 'Adorned Camels & Rajasthani Folk Lore',
      quote: 'Traditional pastoral tribes congregate across undulating Thar sand dunes with colorfully draped camels, turbans, kalbelia musicians, and lake aartis.',
      url: '/festivals/pushkar-fair.jpg',
      mapUrl: '/cultural-map?city=Pushkar&state=Rajasthan'
    },
    {
      id: 'janmashtami',
      name: 'Shri Krishna Janmashtami',
      hindiName: 'श्री कृष्ण जन्माष्टमी',
      location: 'Mathura, Vrindavan, Dwarka & Udupi',
      tithi: 'Bhadrapada Krishna Ashtami • Aug–Sep',
      category: 'Divine Midnight Advent & Jhulan Yatra',
      badge: 'Rohini Nakshatra Abhishek',
      quote: 'Devotional fasts culminating at midnight with Panchamrita snanam of infant Krishna, melodious Harinaam sankirtan, and floral swings.',
      url: '/festivals/janmashtami.jpg',
      mapUrl: '/cultural-map?city=Mathura&state=Uttar%20Pradesh'
    },
    {
      id: 'dahi-handi',
      name: 'Gokulashtami Dahi Handi',
      hindiName: 'दही हांडी गोकुल जन्मोत्सव',
      location: 'Mumbai & Thane, Maharashtra',
      tithi: 'Day following Janmashtami • Aug–Sep',
      category: 'Acrobatic Human Pyramid Tradition',
      badge: 'Govinda Pathaks & Community Grit',
      quote: 'Ten-tier human pyramids formed by disciplined Govinda squads to break the clay pot of curd suspended high above cheering monsoon streets.',
      url: '/festivals/dahi-handi.jpg',
      mapUrl: '/cultural-map?city=Mumbai&state=Maharashtra'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic transition every 5.5 seconds with pause-on-hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % festivalSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [currentSlide, isPaused, festivalSlides.length]);

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
      {/* 1. Full-Width Premium Living Cultural Chronicle Hero (Creative, Manual & Attractive) */}
      <section 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full rounded-3xl overflow-hidden bg-stone-950 shadow-2xl border border-stone-200/60 min-h-[440px] sm:min-h-[500px] md:min-h-[540px] lg:min-h-[580px] flex items-center justify-center select-none group"
      >
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
                alt={slide.name}
                className="w-full h-full object-cover object-center brightness-[0.93] contrast-[1.04] scale-100 group-hover:scale-102 transition-transform duration-1000"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Editorial Scrim: Multi-stage gradient ensures text legibility without washing out the photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/25 z-10 pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-full lg:w-3/4 bg-gradient-to-r from-black/85 via-black/45 to-transparent z-10 pointer-events-none" />
        </div>

        {/* Top Floating Badge Bar */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 z-20 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="bg-black/65 backdrop-blur-md text-amber-300 border border-amber-400/40 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Living Festival Chronicle</span>
            </span>
            <span className="hidden sm:inline-flex bg-white/15 backdrop-blur-md text-white/90 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/20">
              365 Days of Sacred Bharat
            </span>
          </div>

          <div className="bg-black/60 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1 rounded-full border border-white/20 shadow-md">
            {String(currentSlide + 1).padStart(2, '0')} / {String(festivalSlides.length).padStart(2, '0')}
          </div>
        </div>

        {/* Manual Left/Right Arrow Navigation */}
        <button
          type="button"
          onClick={handlePrevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-2xl flex items-center justify-center border border-white/60 hover:scale-110 active:scale-95 transition-all cursor-pointer group/btn"
          aria-label="Previous festival slide"
        >
          <ChevronLeft className="w-6 h-6 text-stone-900 group-hover/btn:-translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/90 hover:bg-white text-stone-900 shadow-2xl flex items-center justify-center border border-white/60 hover:scale-110 active:scale-95 transition-all cursor-pointer group/btn"
          aria-label="Next festival slide"
        >
          <ChevronRight className="w-6 h-6 text-stone-900 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>

        {/* Active Festival Story Card (Bottom-Left) */}
        {(() => {
          const active = festivalSlides[currentSlide];
          return (
            <div className="absolute bottom-16 sm:bottom-14 left-4 sm:left-8 right-4 sm:right-auto sm:max-w-2xl lg:max-w-3xl z-20 space-y-2.5 text-left pointer-events-auto">
              {/* Category & Calendar Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#FF6600] to-[#E05A2B] text-white text-[10.5px] font-black uppercase tracking-wider shadow-md">
                  {active.category}
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-amber-200 border border-amber-300/30 text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                  <Calendar className="w-3 h-3 text-amber-300" />
                  <span>{active.tithi}</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white/95 text-[11px] font-medium flex items-center gap-1 border border-white/10">
                  <MapPin className="w-3 h-3 text-[#FF6600]" />
                  <span>{active.location}</span>
                </span>
              </div>

              {/* Title & Authentic Names */}
              <div className="space-y-0.5">
                <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-serif font-black text-white tracking-tight drop-shadow-lg leading-tight">
                  {active.name}
                </h1>
                <p className="text-xs sm:text-base font-serif italic text-amber-300 font-medium drop-shadow-sm flex items-center gap-2">
                  <span>{active.hindiName}</span>
                  <span className="text-white/60">•</span>
                  <span className="text-amber-100 font-sans text-xs font-semibold not-italic bg-black/30 px-2 py-0.5 rounded">
                    {active.badge}
                  </span>
                </p>
              </div>

              {/* Handcrafted Field Narrative Note */}
              <p className="text-xs sm:text-sm text-stone-100/95 leading-relaxed drop-shadow max-w-2xl font-medium line-clamp-2 sm:line-clamp-3">
                "{active.quote}"
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery(active.name);
                    const el = document.getElementById('festivals-grid-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6600] to-[#E05A2B] hover:from-[#E65100] hover:to-[#C85A17] text-white text-xs font-bold transition-all shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Festival Traditions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={active.mapUrl}
                  className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-bold transition-all hover:scale-105 flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>View on Cultural Map</span>
                </a>
              </div>
            </div>
          );
        })()}

        {/* Bottom Thumbnail Navigator & Dots (Bottom Center & Right) */}
        <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 pointer-events-auto">
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
                    ? 'w-6 sm:w-8 h-2 rounded-full bg-[#FF6600] shadow-sm'
                    : 'w-2 h-2 rounded-full bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Quick-Hop Thumbnail Rail on Larger Screens */}
          <div className="hidden lg:flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 pointer-events-auto">
            <span className="text-[10px] font-bold uppercase text-amber-300 pl-2 pr-1 select-none">
              Quick Jump:
            </span>
            <div className="flex items-center gap-1.5">
              {festivalSlides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-7 h-7 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                    currentSlide === idx
                      ? 'border-[#FF6600] scale-115 ring-2 ring-[#FF6600]/50 shadow-md'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                  title={`${s.name} (${s.location})`}
                >
                  <img src={s.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
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
      <div id="festivals-grid-section" className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scroll-mt-20">
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
