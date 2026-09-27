import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass, Landmark, Calendar, Palette, Music, Navigation,
  BookOpen, Sparkles, MapPin, Search, ArrowRight, ShieldCheck,
  Bot, Award, Globe
} from 'lucide-react';
import { api } from '../services/api';
import {
  HeritagePlace, Festival, ArtCraft, PerformingArt,
  CulturalExperience, CulturalStory, MapMarker
} from '../types/cultural';
import { HeritageCard } from '../components/cards/HeritageCard';
import { FestivalCard } from '../components/cards/FestivalCard';
import { ArtCraftCard } from '../components/cards/ArtCraftCard';
import { PerformingArtCard } from '../components/cards/PerformingArtCard';
import { ExperienceCard } from '../components/cards/ExperienceCard';
import { StoryCard } from '../components/cards/StoryCard';
import { CulturalMapView } from '../components/map/CulturalMapView';
import { AIChatWidget } from '../components/ai/AIChatWidget';

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
  const [arts, setArts] = useState<ArtCraft[]>([]);
  const [perfArts, setPerfArts] = useState<PerformingArt[]>([]);
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [stories, setStories] = useState<CulturalStory[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        const [p, f, a, pa, exp, st, m] = await Promise.all([
          api.getHeritagePlaces(),
          api.getFestivals(),
          api.getArtsCrafts(),
          api.getPerformingArts(),
          api.getExperiences(),
          api.getStories(),
          api.getMapLocations(),
        ]);
        if (isMounted) {
          setPlaces(p.slice(0, 6));
          setFestivals(f.slice(0, 4));
          setArts(a.slice(0, 4));
          setPerfArts(pa.slice(0, 4));
          setExperiences(exp.slice(0, 3));
          setStories(st.slice(0, 3));
          setMarkers(m);
        }
      } catch (err) {
        console.error('Failed to load home cultural data:', err);
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
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-stone-800">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connected Cultural Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight leading-tight">
            Discover India’s Living <span className="text-amber-400">Cultural Heritage</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-normal">
            Journey across verified UNESCO monuments, Vedic festivals, GI-tagged crafts, and classical performing arts.
            Uncover the deep historical relationships connecting ancient architecture to living artisan traditions.
          </p>

          {/* Quick Search Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="flex-1 flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white/95 text-stone-700 hover:bg-white text-xs sm:text-sm font-medium shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-amber-700" />
                <span className="text-stone-500">Search monuments, festivals, crafts...</span>
              </div>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg">
                Explore Database
              </span>
            </button>

            <Link
              to="/ai-guide"
              className="px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <Bot className="w-4 h-4 text-stone-950" />
              <span>Ask AI Guide</span>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified ASI & State Provenance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Authentic GI-Tagged Crafts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>293+ Integrated Destinations</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Connected Cultural Intelligence Showcase */}
      <section className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>The VIRASAT Innovation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Connected Cultural Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Unlike isolated listing cards, VIRASAT automatically discovers living links between historical monuments,
              regional folklore, traditional crafts, and sacred festivals.
            </p>
          </div>
          <Link
            to="/discover"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-700 transition-colors"
          >
            <span>Explore All Connections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-800">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">Festivals ↔ Traditions</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Explore how Chhath Puja in Bihar directly links to ancient solar worship in the Mahabharata and local Madhubani rituals.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Palette className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">Monuments ↔ Master Crafts</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Discover how the pietra dura marble inlay of the Taj Mahal is actively preserved by 6th-generation artisans in Tajganj.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-800">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">Heritage Sites ↔ Living Lore</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Experience the acoustic wonders of Hampi's musical pillars alongside royal chronicles from Emperor Krishnadevaraya.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Heritage Destinations */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">Historical Foundations</div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Featured Heritage Destinations
            </h2>
          </div>
          <Link
            to="/heritage"
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
          >
            <span>View All Monuments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* 4. Explore Indian Festivals */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-orange-800 uppercase tracking-wider">Living Celebrations</div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Explore Indian Festivals & Traditions
            </h2>
          </div>
          <Link
            to="/festivals"
            className="text-xs font-bold text-orange-800 hover:text-orange-900 flex items-center gap-1"
          >
            <span>View All Festivals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

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

      {/* 5. Traditional Arts & Crafts */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Artisan Lineages</div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Discover Traditional Arts & Crafts
            </h2>
          </div>
          <Link
            to="/arts-crafts"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>View All Crafts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {arts.map((art) => (
            <ArtCraftCard
              key={art.id}
              art={art}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('art_craft', art.id)}
            />
          ))}
        </div>
      </section>

      {/* 6. Folk & Performing Arts */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-purple-800 uppercase tracking-wider">Rhythmic Heritage</div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Folk & Classical Performing Arts
            </h2>
          </div>
          <Link
            to="/performing-arts"
            className="text-xs font-bold text-purple-800 hover:text-purple-900 flex items-center gap-1"
          >
            <span>View All Arts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perfArts.map((pa) => (
            <PerformingArtCard
              key={pa.id}
              art={pa}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('performing_art', pa.id)}
            />
          ))}
        </div>
      </section>

      {/* 7. Interactive Map Preview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">Spatial Geometry</div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Interactive Cultural Map
            </h2>
          </div>
          <Link
            to="/map"
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
          >
            <span>Full Screen Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <CulturalMapView
          markers={markers}
          onSelectMarker={(type, id) => onExploreRelated(type, id)}
        />
      </section>

      {/* 8. AI Cultural Guide Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            <Bot className="w-4 h-4 text-indigo-700" />
            <span>Archival Grounding</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            VIRASAT AI Cultural Guide
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Our AI assistant operates on strict retrieval grounding. Before formulating any cultural answer, it retrieves verified records from our central database, providing accurate historical timelines, cultural contexts, and verified citations.
          </p>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Multi-turn conversational context</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>English, हिन्दी, and Hinglish language support</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Zero-hallucination factual database fallback</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <AIChatWidget />
        </div>
      </section>

      {/* 9. Cultural Stories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-rose-800 uppercase tracking-wider">Oral Folklore & Chronicles</div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Cultural Stories & Legends
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onExploreRelated={onExploreRelated}
              onClick={() => onExploreRelated('story', story.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
