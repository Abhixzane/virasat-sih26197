import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass, Landmark, Calendar, Palette, Sparkles, MapPin,
  Search, ArrowRight, Bot, Map, ArrowUpRight
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

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        const [p, f] = await Promise.all([
          api.getHeritagePlaces(),
          api.getFestivals(),
        ]);
        if (isMounted) {
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

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section matching screenshot media_1790496081071.jpg */}
      <section className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-stone-200/90 shadow-sm pt-12 pb-10 px-6 sm:px-10 lg:px-16 text-center">
        {/* Subtle Architectural Silhouette Background */}
        <div className="absolute top-0 inset-x-0 h-44 overflow-hidden pointer-events-none opacity-20 text-[#D4AF37]">
          <MonumentSkyline opacity={0.25} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Top Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#C85A32] text-xs font-semibold uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>CONNECTED CULTURAL INTELLIGENCE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight text-stone-900 leading-[1.15]">
            Discover India’s Living <br className="hidden sm:inline" />
            <span className="text-[#E05A2B]">Cultural</span>{' '}
            <span className="text-[#1A6B3C]">Heritage</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Journey across verified UNESCO monuments, vibrant festivals, GI-tagged crafts, and
            classical performing arts. Discover the deep historical, cultural, and living traditions
            that make India unique.
          </p>

          {/* Large Floating Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div
              onClick={onOpenSearch}
              className="flex items-center justify-between bg-white pl-4 pr-1.5 py-1.5 rounded-full border border-stone-200 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 text-stone-400 text-xs sm:text-sm flex-1 truncate">
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="truncate">Search monuments, festivals, crafts, cities or experiences...</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAIChat('Introduce me to India\'s living cultural heritage');
                }}
                className="px-5 py-2.5 rounded-full bg-[#E05A2B] hover:bg-[#D04E20] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Ask AI Guide</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3D Flowing Tricolour Ribbon Wave across Hero */}
        <div className="pt-8">
          <TricolourRibbonWave />
        </div>

        {/* 4-Item Stats Bar below the ribbon */}
        <div className="pt-4 max-w-5xl mx-auto">
          <StatsCounterBar
            item1={{ count: '1,200+', label: 'Verified Heritage Places' }}
            item2={{ count: '36', label: 'States & UTs' }}
            item3={{ count: '200+', label: 'Cultural Experiences' }}
            item4={{ count: '100%', label: 'Authenticated Data' }}
          />
        </div>
      </section>

      {/* 2. The Virasat Innovation / Connected Cultural Intelligence Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E05A2B] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>THE VIRASAT INNOVATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">
              Connected Cultural Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Unite validated data, AI insights, and local stories to explore India's cultural treasures — people, places, traditions and living heritage.
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

        {/* 4 Feature Innovation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Festivals & Traditions */}
          <Link
            to="/festivals"
            className="group bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/60">
                <Calendar className="w-5 h-5 text-[#E05A2B]" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 font-serif group-hover:text-[#E05A2B] transition-colors">
                Festivals & Traditions
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Explore India's living festivals with verified dates, stories and regional significance.
              </p>
            </div>
            <div className="pt-4 flex justify-end">
              <div className="w-7 h-7 rounded-full bg-amber-50 group-hover:bg-[#E05A2B] text-amber-700 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Card 2: Monuments & Heritage Sites */}
          <Link
            to="/heritage"
            className="group bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
                <Landmark className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 font-serif group-hover:text-[#E05A2B] transition-colors">
                Monuments & Heritage Sites
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Discover iconic and lesser-known monuments with historical context.
              </p>
            </div>
            <div className="pt-4 flex justify-end">
              <div className="w-7 h-7 rounded-full bg-amber-50 group-hover:bg-[#E05A2B] text-amber-700 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Card 3: Arts & Crafts */}
          <Link
            to="/arts-crafts"
            className="group bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60">
                <Palette className="w-5 h-5 text-purple-700" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 font-serif group-hover:text-[#E05A2B] transition-colors">
                Arts & Crafts
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Explore India's artisan traditions, GI-tagged crafts and craft clusters.
              </p>
            </div>
            <div className="pt-4 flex justify-end">
              <div className="w-7 h-7 rounded-full bg-amber-50 group-hover:bg-[#E05A2B] text-amber-700 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Card 4: Heritage Maps */}
          <Link
            to="/map"
            className="group bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                <Map className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 font-serif group-hover:text-[#E05A2B] transition-colors">
                Heritage Maps
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Visualise cultural experiences across India with our interactive map.
              </p>
            </div>
            <div className="pt-4 flex justify-end">
              <div className="w-7 h-7 rounded-full bg-amber-50 group-hover:bg-[#E05A2B] text-amber-700 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
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

      {/* 5. Plan Your Cultural Journey Banner matching screenshot bottom */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF5EA] via-[#FFF9F3] to-[#F1F8F4] border border-stone-200 p-8 sm:p-12 text-center shadow-xs">
        <div className="absolute inset-0 pointer-events-none opacity-20 text-[#C85A32]">
          <MonumentSkyline opacity={0.2} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-stone-900">
            Plan Your <span className="text-[#E05A2B]">Cultural</span> Journey
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Create personalized itineraries, explore hidden gems, and experience India like never before.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/itinerary"
              className="px-6 py-3 rounded-full bg-[#E05A2B] hover:bg-[#D04E20] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Generate Itinerary</span>
            </Link>

            <Link
              to="/map"
              className="px-6 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all"
            >
              <Map className="w-4 h-4 text-stone-600" />
              <span>Explore on Map</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
