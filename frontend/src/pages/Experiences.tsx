import React, { useState, useEffect } from 'react';
import {
  Navigation, Filter, Search, Sparkles, Clock, MapPin,
  Compass, ArrowRight, ShieldCheck, Footprints, HeartHandshake,
  BookOpen, CheckCircle2, ChevronRight, Award, Camera
} from 'lucide-react';
import { api } from '../services/api';
import { CulturalExperience } from '../types/cultural';
import { ExperienceCard } from '../components/cards/ExperienceCard';
import {
  TricolourRibbonWave, MonumentSkyline, StatsCounterBar
} from '../components/shared/TricolourBranding';

interface ExperiencesPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const ExperiencesPage: React.FC<ExperiencesPageProps> = ({ onExploreRelated }) => {
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Verified authentic field highlights for hero showcase
  const heroHighlights = [
    {
      title: 'Subah-e-Banaras Dawn Heritage Boat & Aarti',
      hindiTitle: 'सुबह-ए-बनारस प्रभात नौका विहार',
      subtitle: 'Varanasi, Uttar Pradesh • Sacred Ganga Ghats',
      tag: 'Spiritual Dawn Experience',
      image: '/festivals/ganga-aarti.jpg',
      note: 'Ancient morning surya-namaskar, classical sitar ragas, and traditional akhada wrestling.'
    },
    {
      title: 'Mughal Lapidary Parchinkari Atelier Walkthrough',
      hindiTitle: 'मुग़ल परचिनकारी हस्तकला कार्यशाला',
      subtitle: 'Agra, Uttar Pradesh • Master Stone Craftsmen',
      tag: 'Artisan Craft Masterclass',
      image: '/craft-agra-marble.jpg',
      note: 'Generational stone lapidaries hand-shaping lapis lazuli and malachite into pristine Makrana marble.'
    },
    {
      title: 'Tungabhadra Coracle Ride & Monolithic Sunset Trail',
      hindiTitle: 'तुंगभद्रा हस्तनिर्मित नाव एवं सूर्यास्त',
      subtitle: 'Hampi, Karnataka • UNESCO World Heritage Site',
      tag: 'Historical Landscape & Riverine Experience',
      image: '/hero/monument-4.jpg',
      note: 'Ancient circular reed boats gliding beneath granite boulder ruins and Vijayanagara riverside temples.'
    },
    {
      title: 'Bastar Lost-Wax Bronze Foundry Residency',
      hindiTitle: 'बस्तर ढोकरा कांस्य ढलाई कार्यशाला',
      subtitle: 'Jagdalpur, Chhattisgarh • Tribal Dokra Crafts',
      tag: 'Living Metallurgy Immersion',
      image: '/craft-dokra.jpg',
      note: '4,000-year-old Indus Valley cire-perdue technique practiced by indigenous Bell Metal artisan families.'
    }
  ];

  // Auto-rotate hero highlights every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroHighlights.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroHighlights.length]);

  useEffect(() => {
    let isMounted = true;
    const fetchExp = async () => {
      setLoading(true);
      try {
        const data = await api.getExperiences();
        if (isMounted) setExperiences(data);
      } catch (err) {
        console.error('Failed to load cultural experiences:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchExp();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    'All',
    'Artisan Masterclass',
    'Historical Landscape',
    'Spiritual Contemplation',
    'Village Immersion',
  ];

  const statesList = [
    'All', 'Uttar Pradesh', 'Karnataka', 'Maharashtra', 'Bihar', 'Rajasthan', 'Odisha', 'Kerala'
  ];

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return experiences.length;
    return experiences.filter(e => (e.category || '').toLowerCase().includes(cat.toLowerCase())).length;
  };

  const filteredExperiences = experiences.filter((exp) => {
    if (selectedCategory !== 'All' && !exp.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (selectedState !== 'All' && exp.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      exp.name.toLowerCase().includes(q) ||
      exp.city.toLowerCase().includes(q) ||
      exp.category.toLowerCase().includes(q) ||
      exp.description.toLowerCase().includes(q)
    );
  });

  const activeHighlight = heroHighlights[currentHeroSlide];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Curated Field Guide Header Banner (2-Column Handcrafted Editorial Layout) */}
      <section className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-amber-200/80 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[290px]">
          
          {/* Left Column: Human Curator Intelligence & Living Immersion Philosophy */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-5 z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200/80 text-[11px] font-bold tracking-wide text-amber-950 uppercase">
                <span className="w-2 h-2 rounded-full bg-[#E05A2B] animate-pulse" />
                <span>HUMAN-CURATED FIELD IMMERSIONS • सांस्कृतिक अनुभव</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-serif font-extrabold text-[#0B1E36] tracking-tight leading-tight">
                Living Cultural Immersions & Master Artisan Trails
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
                Step beyond standard sightseeing. Engage directly with hereditary artisan guilds, row ancient coracles
                on sacred dawn waters, and attend temple rituals guided by generational community custodians.
              </p>
            </div>

            {/* Authenticity & Ethical Protocol Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Non-Commercial Guilds</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] font-medium text-amber-900">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Verified Local Protocol</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-[11px] font-medium text-stone-700">
                <Compass className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>Direct Google Maps Navigation</span>
              </div>
            </div>

            {/* Micro Stats Bar */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-amber-100 max-w-lg">
              <div>
                <span className="block text-xl font-bold font-serif text-[#0B1E36]">{experiences.length || '38'}</span>
                <span className="text-[11px] text-stone-500 font-medium">Field Immersions</span>
              </div>
              <div>
                <span className="block text-xl font-bold font-serif text-[#E05A2B]">18+</span>
                <span className="text-[11px] text-stone-500 font-medium">Living Craft Ateliers</span>
              </div>
              <div>
                <span className="block text-xl font-bold font-serif text-emerald-700">28</span>
                <span className="text-[11px] text-stone-500 font-medium">States & UTs Covered</span>
              </div>
            </div>
          </div>

          {/* Right Column: Real-time Field Photograph with Smooth Light-Theme Scrim */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden flex items-end justify-end group">
            {/* Multi-stage light theme fade gradient scrim */}
            <div className="absolute inset-y-0 left-0 w-36 sm:w-48 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/85 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF9]/90 via-[#FFFDF9]/30 to-transparent z-10 pointer-events-none" />

            <img
              src={activeHighlight.image}
              alt={activeHighlight.title}
              className="w-full h-full object-cover object-center select-none brightness-[0.98] contrast-[1.02] group-hover:scale-105 transition-transform duration-700"
            />

            {/* Real Photography Tag */}
            <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-stone-200/90 shadow-xs flex items-center gap-1.5 text-[10px] font-bold text-stone-800 select-none">
              <Camera className="w-3 h-3 text-[#E05A2B]" />
              <span>Real Field Photography</span>
            </div>

            {/* Active Highlight Spotlight Card */}
            <div className="absolute bottom-5 left-5 right-5 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-stone-200 shadow-md space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#E05A2B] uppercase tracking-wide">
                <span>{activeHighlight.tag}</span>
                <span className="text-stone-400">{currentHeroSlide + 1} / {heroHighlights.length}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold font-serif text-stone-900 line-clamp-1">
                {activeHighlight.title}
              </h4>
              <p className="text-[11px] text-stone-600 line-clamp-1">
                {activeHighlight.subtitle}
              </p>

              {/* Slider Dots */}
              <div className="flex items-center gap-1.5 pt-1">
                {heroHighlights.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroSlide(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentHeroSlide === idx ? 'w-5 bg-[#E05A2B]' : 'w-1.5 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Jump to highlight ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Curled Bharat Tricolour Ribbon Wave at bottom-right */}
            <div className="absolute bottom-0 right-0 w-full pointer-events-none z-10">
              <svg viewBox="0 0 500 36" fill="none" preserveAspectRatio="none" className="w-full h-7 opacity-90">
                <path d="M0,36 Q250,6 500,14 L500,21 Q250,13 0,36 Z" fill="#FF6600" />
                <path d="M0,36 Q250,13 500,21 L500,28 Q250,20 0,36 Z" fill="#FFFFFF" fillOpacity="0.9" />
                <path d="M0,36 Q250,20 500,28 L500,36 Q250,28 0,36 Z" fill="#138808" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category & State Filter Bar with Counts & Fast Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-500 mr-1 flex items-center gap-1 uppercase tracking-wide">
            <Filter className="w-3.5 h-3.5 text-[#E05A2B]" /> Format:
          </span>
          {categories.map((cat) => {
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#E05A2B] text-white shadow-xs'
                    : 'bg-stone-50 text-stone-700 border border-stone-200/80 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat ? 'bg-white/25 text-white' : 'bg-stone-200/70 text-stone-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-100">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-bold text-stone-500 mr-1 uppercase tracking-wide">Region:</span>
            {statesList.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedState === st
                    ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, craft or ritual..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-stone-50 border border-stone-200 outline-none focus:border-[#E05A2B] focus:bg-white transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Grid of Living Experiences */}
      {loading ? (
        <div className="py-20 text-center text-stone-400 text-sm flex flex-col items-center justify-center gap-3">
          <div className="w-7 h-7 border-2 border-[#E05A2B] border-t-transparent rounded-full animate-spin" />
          <span className="font-medium text-stone-600">Retrieving verified cultural experiences from database...</span>
        </div>
      ) : filteredExperiences.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1 font-medium">
            <span>Showing <strong className="text-stone-800">{filteredExperiences.length}</strong> living heritage encounters</span>
            {(selectedCategory !== 'All' || selectedState !== 'All' || searchQuery) && (
              <button
                onClick={() => { setSelectedCategory('All'); setSelectedState('All'); setSearchQuery(''); }}
                className="text-[#E05A2B] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                onExploreRelated={onExploreRelated}
                onClick={() => onExploreRelated('experience', exp.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200 space-y-2">
          <p className="font-semibold text-sm text-stone-700">No experiences found matching your filters.</p>
          <p className="text-xs text-stone-500">Try adjusting your region or search keywords.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedState('All'); setSearchQuery(''); }}
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-white bg-[#E05A2B] hover:bg-[#c9491d] px-3 py-1.5 rounded-lg shadow-2xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. Responsible Cultural Travel Protocol */}
      <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E05A2B] uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>ETHICAL & COMMUNITY-LED TOURISM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            The VIRASAT Living Heritage Protocol
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
            To prevent over-tourism and cultural commodification, all VIRASAT immersion experiences adhere to four non-negotiable community principles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/70 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">1</span>
              <div className="text-xs font-bold text-stone-900 font-serif">Direct Artisan Benefit</div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">No middle-men markups; travelers engage directly with registered master craftsmen cooperatives.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/70 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">2</span>
              <div className="text-xs font-bold text-stone-900 font-serif">Sacred Sanctity Reverence</div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">Adherence to traditional attire, photography etiquette, and silence during live Vedic rituals.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/70 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">3</span>
              <div className="text-xs font-bold text-stone-900 font-serif">Zero Ecological Footprint</div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">Plastic-free river trails, natural reed coracles, and preservation of delicate temple masonry.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/70 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">4</span>
              <div className="text-xs font-bold text-stone-900 font-serif">Grounded Historical Context</div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">Walks guided by licensed ASI historians and generational family elders with verified knowledge.</p>
          </div>
        </div>
      </section>

      {/* 5. Stats Bar */}
      <section>
        <StatsCounterBar
          item1={{ count: `${experiences.length || '38'}+`, label: 'Verified Living Experiences' }}
          item2={{ count: '100%', label: 'Community-Led Guilds' }}
          item3={{ count: 'Zero', label: 'Synthetic Tourism Claims' }}
          item4={{ count: 'ASI / State', label: 'Archival Provenance' }}
        />
      </section>
    </div>
  );
};
