import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Sparkles, Landmark, Calendar, Palette, Music, Navigation, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { SearchResultItem } from '../types/cultural';
import { VerifiedBadge } from '../components/shared/TricolourBranding';

interface SearchPageProps {
  onExploreRelated: (type: string, id: string) => void;
  onOpenAIChat: (prompt: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onExploreRelated, onOpenAIChat }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedState, setSelectedState] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statesList, setStatesList] = useState<string[]>([]);

  useEffect(() => {
    api.getStates().then((states) => {
      setStatesList(states.map((s) => s.name).sort());
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setQuery(queryParam);
    setSelectedCategory(categoryParam);
    performSearch(queryParam, categoryParam, selectedState);
  }, [queryParam, categoryParam]);

  const performSearch = async (q: string, cat: string, st: string) => {
    setLoading(true);
    try {
      const res = await api.search(q, {
        category: cat === 'all' ? undefined : cat,
        state: st || undefined,
        limit: 100,
      });
      setResults(res.flat_results);
      setTotalMatches(res.total_matches);
    } catch (e) {
      console.error('Search error:', e);
      setResults([]);
      setTotalMatches(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query, category: selectedCategory });
    performSearch(query, selectedCategory, selectedState);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSearchParams({ q: query, category: cat });
    performSearch(query, cat, selectedState);
  };

  const handleStateChange = (st: string) => {
    setSelectedState(st);
    performSearch(query, selectedCategory, st);
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'heritage': return Landmark;
      case 'festival': return Calendar;
      case 'art_craft': return Palette;
      case 'performing_art': return Music;
      case 'experience': return Navigation;
      default: return BookOpen;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Search Header */}
      <div className="bg-[#FAF9F6] border border-[#EDEDED] rounded-2xl p-6 sm:p-8 shadow-xs">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#161616] font-bold mb-2">
          Universal Cultural Search
        </h1>
        <p className="text-sm text-[#6B6B6B] mb-6">
          Explore India's verified heritage monuments, traditions, crafts, performing arts, and oral histories.
        </p>

        {/* Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-[#6B6B6B]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by monument name, craft, festival, dynasty, city, or state..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#EDEDED] bg-white text-[#161616] placeholder-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF9933] shadow-xs text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#FF9933] hover:bg-[#CC7A29] text-white font-medium rounded-xl transition-all shadow-xs text-sm"
          >
            Search
          </button>
        </form>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          <span className="text-xs font-semibold text-[#6B6B6B] uppercase mr-2">Filter Category:</span>
          {[
            { id: 'all', label: 'All Entities' },
            { id: 'heritage', label: 'Heritage Sites' },
            { id: 'festival', label: 'Festivals' },
            { id: 'craft', label: 'Arts & Crafts' },
            { id: 'performing_art', label: 'Performing Arts' },
            { id: 'experience', label: 'Experiences' },
            { id: 'story', label: 'Stories' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#FF9933] text-white font-semibold shadow-xs'
                  : 'bg-white text-[#2B2B2B] border border-[#EDEDED] hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* State Filter dropdown */}
          <div className="ml-auto">
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#EDEDED] bg-white text-xs text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-[#FF9933]"
            >
              <option value="">All States & UTs</option>
              {statesList.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif text-[#161616] font-semibold">
            {query ? `Search Results for "${query}"` : 'All Cultural Records'}
          </h2>
          <p className="text-xs text-[#6B6B6B]">
            Found {totalMatches} verified records in the VIRASAT database
          </p>
        </div>

        {query && (
          <button
            onClick={() => onOpenAIChat(`Tell me verified details about "${query}" in Indian cultural heritage.`)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF6EC] text-[#0F6D07] border border-[#5FBE72] text-xs font-semibold hover:bg-[#CDEAD2] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#138808]" />
            <span>Ask AI Guide about this</span>
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-[#EDEDED] animate-pulse space-y-3">
              <div className="h-44 bg-stone-100 rounded-xl" />
              <div className="h-4 bg-stone-100 rounded w-3/4" />
              <div className="h-3 bg-stone-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && (
        <div className="bg-[#FAF9F6] border border-[#EDEDED] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-[#FF9933] rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg text-[#161616] font-bold">
            No Verified Records Found
          </h3>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            I could not find a verified record for "{query}" in the VIRASAT database. In accordance with our cultural authenticity policy, unverified information is not fabricated.
          </p>
          <button
            onClick={() => onOpenAIChat(query ? `Can you find cultural context for "${query}"?` : 'Show famous heritage monuments')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#138808] text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-[#0F6D07] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask VIRASAT AI Guide</span>
          </button>
        </div>
      )}

      {/* Results Grid */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => {
            const Icon = getEntityIcon(item.type);
            return (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => onExploreRelated(item.type, item.id)}
                className="group cursor-pointer bg-white rounded-2xl border border-[#EDEDED] overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
                    <Icon className="w-3.5 h-3.5 text-[#FFC77D]" />
                    <span className="capitalize">{item.type.replace('_', ' ')}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <VerifiedBadge status={item.verification_status} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] font-semibold text-[#CC7A29] uppercase tracking-wider mb-1">
                      {item.state} • {item.category}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#161616] group-hover:text-[#CC7A29] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-2 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-[#138808] font-semibold">
                    <span>View Connected Intelligence</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
