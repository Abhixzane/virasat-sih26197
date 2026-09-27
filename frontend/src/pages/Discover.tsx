import React, { useState, useEffect } from 'react';
import { Sparkles, Landmark, Calendar, Palette, Music, Navigation, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { HeritagePlace, Festival, ArtCraft, PerformingArt, CulturalExperience, CulturalStory } from '../types/cultural';

interface DiscoverPageProps {
  onExploreRelated: (type: string, id: string) => void;
  onOpenAIChat: (prompt: string) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  onExploreRelated,
  onOpenAIChat,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'festivals' | 'monuments' | 'crafts'>('all');
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [places, setPlaces] = useState<HeritagePlace[]>([]);
  const [arts, setArts] = useState<ArtCraft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [f, p, a] = await Promise.all([
          api.getFestivals(),
          api.getHeritagePlaces(),
          api.getArtsCrafts(),
        ]);
        if (isMounted) {
          setFestivals(f);
          setPlaces(p);
          setArts(a);
        }
      } catch (err) {
        console.error('Failed to load discover data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Relational Discovery Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Connected Cultural Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Every tradition in India is part of an interconnected web. Explore how ancient monuments inspire living master crafts, how temple architecture houses classical dances, and how sacred festivals preserve community eco-wisdom.
          </p>
        </div>
      </div>

      {/* Featured Deep Dive Relational Case Studies */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold font-serif text-stone-900">
          Featured Cultural Relationship Systems
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bihar Network */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-heritage space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                Bihar Heritage Network
              </span>
              <span className="text-xs text-stone-400">Eastern India</span>
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Vedic Solar Worship, Madhubani Art & The Sacred Bodhi Tree
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              In Bihar, Chhath Puja represents an ancient Vedic eco-festival where offerings to Surya are made along riverbanks. The iconography of the sun and river deities directly influences the geometric Kachni and Bharni styles of Madhubani (Mithila) paintings, while oral ballads of Draupadi’s Surya Upasana unite the narrative to the sacred Bodhi Tree precinct of Bodh Gaya.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => onExploreRelated('festival', 'fest-chhath-puja')}
                className="text-xs font-semibold text-orange-900 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors"
              >
                Chhath Puja Connections →
              </button>
              <button
                onClick={() => onExploreRelated('art_craft', 'art-madhubani-painting')}
                className="text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
              >
                Madhubani Art Connections →
              </button>
            </div>
          </div>

          {/* Karnataka / Vijayanagara Network */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-heritage space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full">
                Vijayanagara Empire Network
              </span>
              <span className="text-xs text-stone-400">Southern India</span>
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Granite Acoustics, Tungabhadra Coracles & Dravidian Grandeur
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              At Hampi's Vittala Temple, 56 monolithic granite pillars engineered with micro-acoustic resonant frequencies harmonize with the monolithic stone Garuda chariot. The living culture continues on the Tungabhadra River through traditional reed coracle boats, unchanged in construction since the 16th-century reign of Emperor Krishnadevaraya.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => onExploreRelated('heritage', 'place-hampi-vittala')}
                className="text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
              >
                Vittala Temple Connections →
              </button>
              <button
                onClick={() => onExploreRelated('experience', 'exp-hampi-boulder-coracle')}
                className="text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
              >
                Coracle Trail Connections →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Node Explorer */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-serif text-stone-900">
          Click Any Record to Reveal Connected Heritage
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {festivals.map((f) => (
            <div
              key={f.id}
              onClick={() => onExploreRelated('festival', f.id)}
              className="p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-orange-800 uppercase bg-orange-50 px-2 py-0.5 rounded">
                  Festival
                </span>
                <h4 className="text-sm font-bold text-stone-900 mt-2 font-serif">{f.name}</h4>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">{f.description}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-semibold text-amber-800">
                <span>View Connections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}

          {places.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => onExploreRelated('heritage', p.id)}
              className="p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase bg-amber-50 px-2 py-0.5 rounded">
                  Monument
                </span>
                <h4 className="text-sm font-bold text-stone-900 mt-2 font-serif">{p.name}</h4>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">{p.description}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-semibold text-amber-800">
                <span>View Connections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}

          {arts.map((a) => (
            <div
              key={a.id}
              onClick={() => onExploreRelated('art_craft', a.id)}
              className="p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                  Traditional Craft
                </span>
                <h4 className="text-sm font-bold text-stone-900 mt-2 font-serif">{a.name}</h4>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">{a.description}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-semibold text-amber-800">
                <span>View Connections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
