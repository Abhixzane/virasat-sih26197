import React, { useState, useEffect } from 'react';
import {
  Sparkles, X, Landmark, Calendar, Palette, Music, Navigation,
  BookOpen, ExternalLink, ShieldCheck, MapPin, ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { RelatedHeritageResponse } from '../../types/cultural';

interface ConnectedIntelligenceModalProps {
  recordType: string | null;
  recordId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (type: string, id: string) => void;
  onOpenAIChat?: (prompt: string) => void;
}

export const ConnectedIntelligenceModal: React.FC<ConnectedIntelligenceModalProps> = ({
  recordType,
  recordId,
  isOpen,
  onClose,
  onSelectNode,
  onOpenAIChat,
}) => {
  const [data, setData] = useState<RelatedHeritageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !recordType || !recordId) {
      setData(null);
      return;
    }

    let isMounted = true;
    const fetchRelations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getRelatedHeritage(recordType, recordId);
        if (isMounted) setData(res);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load cultural relationships');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRelations();
    return () => {
      isMounted = false;
    };
  }, [recordType, recordId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-4xl bg-[#FFFDF9] rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950 via-indigo-950 to-stone-950 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                Connected Cultural Intelligence
              </div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-white truncate max-w-md">
                {data?.primary_record_name || 'Loading Heritage Relationships...'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-500 text-sm">
              <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing multidimensional heritage relationships...</span>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-rose-600 text-sm">
              {error}
            </div>
          ) : data ? (
            <>
              {/* Highlight summary card */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-amber-900 uppercase tracking-wide">
                    Active Heritage Anchor
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    {data.primary_record_name}
                  </div>
                  <div className="text-xs text-stone-600 mt-1">
                    Grounded in archaeological evidence & living traditions from authentic repositories.
                  </div>
                </div>

                {onOpenAIChat && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAIChat(`Explain how ${data.primary_record_name} connects to its regional monuments, crafts, and performing arts.`);
                    }}
                    className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ask AI Cultural Guide</span>
                  </button>
                )}
              </div>

              {/* Grid of connected cultural domains */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Related Heritage Monuments */}
                {data.related_places.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                      <Landmark className="w-4 h-4 text-amber-700" />
                      <span>Associated Heritage Places ({data.related_places.length})</span>
                    </div>
                    <div className="space-y-2">
                      {data.related_places.map((place) => (
                        <div
                          key={place.id}
                          onClick={() => onSelectNode('heritage', place.id)}
                          className="p-3 bg-white rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 cursor-pointer transition-all flex items-center gap-3 group"
                        >
                          <img
                            src={place.image_url}
                            alt={place.name}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=100';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-900 truncate">
                              {place.name}
                            </h4>
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                              {place.city}, {place.state} • {place.architectural_style}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-amber-700 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Related Festivals */}
                {data.related_festivals.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-900 uppercase tracking-wider">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span>Associated Festivals ({data.related_festivals.length})</span>
                    </div>
                    <div className="space-y-2">
                      {data.related_festivals.map((fest) => (
                        <div
                          key={fest.id}
                          onClick={() => onSelectNode('festival', fest.id)}
                          className="p-3 bg-white rounded-xl border border-stone-200 hover:border-orange-400 hover:bg-orange-50/40 cursor-pointer transition-all flex items-center gap-3 group"
                        >
                          <img
                            src={fest.image_url}
                            alt={fest.name}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=100';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-stone-900 group-hover:text-orange-900 truncate">
                              {fest.name}
                            </h4>
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                              {fest.state} • {fest.month_or_season}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-orange-700 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Related Arts & Crafts */}
                {data.related_arts.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      <Palette className="w-4 h-4 text-emerald-700" />
                      <span>Indigenous Arts & Crafts ({data.related_arts.length})</span>
                    </div>
                    <div className="space-y-2">
                      {data.related_arts.map((art) => (
                        <div
                          key={art.id}
                          onClick={() => onSelectNode('art_craft', art.id)}
                          className="p-3 bg-white rounded-xl border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/40 cursor-pointer transition-all flex items-center gap-3 group"
                        >
                          <img
                            src={art.image_url}
                            alt={art.name}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=100';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-stone-900 group-hover:text-emerald-900 truncate">
                              {art.name}
                            </h4>
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                              {art.origin} • {art.craft_category} {art.gi_status && '• GI'}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-emerald-700 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Related Performing Arts */}
                {data.related_performing_arts.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-900 uppercase tracking-wider">
                      <Music className="w-4 h-4 text-purple-700" />
                      <span>Folk & Performing Arts ({data.related_performing_arts.length})</span>
                    </div>
                    <div className="space-y-2">
                      {data.related_performing_arts.map((part) => (
                        <div
                          key={part.id}
                          onClick={() => onSelectNode('performing_art', part.id)}
                          className="p-3 bg-white rounded-xl border border-stone-200 hover:border-purple-400 hover:bg-purple-50/40 cursor-pointer transition-all flex items-center gap-3 group"
                        >
                          <img
                            src={part.image_url}
                            alt={part.name}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=100';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-stone-900 group-hover:text-purple-900 truncate">
                              {part.name}
                            </h4>
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                              {part.origin} • {part.category}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-purple-700 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Related Cultural Experiences */}
                {data.related_experiences.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <span>Cultural Experiences ({data.related_experiences.length})</span>
                    </div>
                    <div className="space-y-2">
                      {data.related_experiences.map((exp) => (
                        <div
                          key={exp.id}
                          onClick={() => onSelectNode('experience', exp.id)}
                          className="p-3 bg-white rounded-xl border border-stone-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition-all flex items-center gap-3 group"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-stone-900 group-hover:text-blue-900 truncate">
                              {exp.name}
                            </h4>
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                              {exp.city}, {exp.state} • {exp.duration}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-blue-700 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Related Cultural Stories */}
                {data.related_stories.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-rose-600" />
                      <span>Living Narratives & Folklore ({data.related_stories.length})</span>
                    </div>
                    <div className="space-y-2">
                      {data.related_stories.map((story) => (
                        <div
                          key={story.id}
                          onClick={() => onSelectNode('story', story.id)}
                          className="p-3 bg-white rounded-xl border border-stone-200 hover:border-rose-400 hover:bg-rose-50/40 cursor-pointer transition-all flex items-center gap-3 group"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-stone-900 group-hover:text-rose-900 truncate">
                              {story.title}
                            </h4>
                            <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 italic">
                              &ldquo;{story.narrative}&rdquo;
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-rose-700 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Source References */}
              {data.source_references.length > 0 && (
                <div className="pt-4 border-t border-stone-200 text-xs text-stone-500">
                  <div className="font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Source Provenance</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.source_references.map((src, i) => (
                      <a
                        key={i}
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-amber-800 hover:underline bg-amber-50 px-2 py-0.5 rounded"
                      >
                        <span>{src}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
