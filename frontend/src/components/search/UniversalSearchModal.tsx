import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Landmark, Calendar, Palette, Music, Navigation, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { SearchResponse, SearchResultItem } from '../../types/cultural';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (type: string, id: string) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.search(query, {
          category: categoryFilter || undefined,
          state: stateFilter || undefined,
          limit: 30,
        });
        setResults(res);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, categoryFilter, stateFilter, isOpen]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'heritage': return <Landmark className="w-4 h-4 text-amber-700" />;
      case 'festival': return <Calendar className="w-4 h-4 text-orange-600" />;
      case 'art_craft': return <Palette className="w-4 h-4 text-emerald-700" />;
      case 'performing_art': return <Music className="w-4 h-4 text-purple-700" />;
      case 'experience': return <Navigation className="w-4 h-4 text-blue-600" />;
      case 'story': return <BookOpen className="w-4 h-4 text-rose-700" />;
      default: return <Landmark className="w-4 h-4 text-stone-500" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'heritage': return 'Monument';
      case 'festival': return 'Festival';
      case 'art_craft': return 'Traditional Craft';
      case 'performing_art': return 'Performing Art';
      case 'experience': return 'Experience';
      case 'story': return 'Cultural Narrative';
      case 'state': return 'State';
      case 'city': return 'City';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-3xl bg-[#FFFDF9] rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-amber-700 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search festivals, monuments, crafts (e.g., 'Chhath Puja', 'Taj Mahal', 'Madhubani')..."
            className="flex-1 bg-transparent text-stone-900 text-sm sm:text-base outline-none placeholder:text-stone-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="px-4 py-2 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium mr-1">Filter:</span>
          {[
            { id: '', label: 'All' },
            { id: 'heritage', label: 'Monuments' },
            { id: 'festival', label: 'Festivals' },
            { id: 'art_craft', label: 'Arts & Crafts' },
            { id: 'performing_art', label: 'Performing Arts' },
            { id: 'experience', label: 'Experiences' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                categoryFilter === cat.id
                  ? 'bg-amber-800 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
          {loading ? (
            <div className="py-12 text-center text-stone-400 text-xs flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <span>Querying verified cultural database...</span>
            </div>
          ) : results && results.flat_results.length > 0 ? (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                {results.total_matches} Verified Matches
              </div>
              {results.flat_results.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    onSelectResult(item.type, item.id);
                    onClose();
                  }}
                  className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-amber-50/60 border border-transparent hover:border-amber-200 cursor-pointer transition-all"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-stone-200 group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=200';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-white border border-stone-200 shadow-3xs">
                        {getTypeIcon(item.type)}
                        <span>{getTypeName(item.type)}</span>
                      </div>
                      <span className="text-xs font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                        {item.state}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 mt-1 group-hover:text-amber-900 transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-800 shrink-0 self-center transition-transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="py-12 text-center text-stone-500 text-xs">
              <p className="font-semibold text-stone-700">No verified records found for "{query}"</p>
              <p className="text-stone-400 mt-1">Try searching for "Chhath", "Hampi", "Taj Mahal", "Warli", or "Kathakali".</p>
            </div>
          ) : (
            <div className="py-10 text-center text-stone-400 text-xs">
              <p className="font-medium">Type any keyword to search across 293+ verified Indian destinations, crafts, and celebrations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
