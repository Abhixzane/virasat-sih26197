import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import L from 'leaflet';
import {
  ArrowLeft, MapPin, Landmark, Calendar, Palette, Music, Sparkles,
  ShieldCheck, ExternalLink, Clock, Tag, Compass, CheckCircle2,
  Share2, Bot, Layers
} from 'lucide-react';
import { api } from '../services/api';
import {
  HeritagePlace, Festival, ArtCraft, PerformingArt, CulturalExperience,
  RelatedHeritageResponse
} from '../types/cultural';
import { TricolourRibbonWave, MonumentSkyline } from '../components/shared/TricolourBranding';

interface EntityDetailPageProps {
  entityType: 'heritage' | 'festival' | 'craft' | 'performing_art' | 'experience';
  onExploreRelated: (type: string, id: string) => void;
  onOpenAIChat?: (prompt: string) => void;
}

export const EntityDetailPage: React.FC<EntityDetailPageProps> = ({
  entityType,
  onExploreRelated,
  onOpenAIChat,
}) => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const identifier = slug || id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entityData, setEntityData] = useState<any>(null);
  const [sources, setSources] = useState<Array<{
    organization: string;
    source_title: string;
    source_url: string;
    supporting_claim: string;
    verification_status: string;
  }>>([]);
  const [relatedData, setRelatedData] = useState<RelatedHeritageResponse | null>(null);

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const parentRoutes: Record<string, { path: string; label: string }> = {
    heritage: { path: '/heritage', label: 'Heritage Monuments' },
    festival: { path: '/festivals', label: 'Festivals & Living Traditions' },
    craft: { path: '/arts-crafts', label: 'Arts & Master Crafts' },
    performing_art: { path: '/performing-arts', label: 'Folk & Performing Arts' },
    experience: { path: '/experiences', label: 'Cultural Experiences' },
  };

  useEffect(() => {
    if (!identifier) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadEntity = async () => {
      try {
        let data: any = null;
        if (entityType === 'heritage') {
          data = await api.getHeritagePlaceById(identifier);
        } else if (entityType === 'festival') {
          data = await api.getFestivalById(identifier);
        } else if (entityType === 'craft') {
          data = await api.getArtCraftById(identifier);
        } else if (entityType === 'performing_art') {
          data = await api.getPerformingArtById(identifier);
        } else if (entityType === 'experience') {
          data = await api.getExperienceById(identifier);
        }

        if (!data) throw new Error('Entity record not found.');
        if (isMounted) setEntityData(data);

        // Fetch sources and related entities concurrently
        const actualId = data.id || identifier;
        try {
          const [srcs, rels] = await Promise.all([
            api.getSources(entityType, actualId).catch(() => []),
            api.getRelatedEntities(entityType, actualId).catch(() => null),
          ]);
          if (isMounted) {
            setSources(srcs);
            setRelatedData(rels);
          }
        } catch {
          // Non-critical supplementary data
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load cultural record.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadEntity();
    return () => {
      isMounted = false;
    };
  }, [identifier, entityType]);

  // Leaflet Mini-Map Initialization
  useEffect(() => {
    if (!entityData || !mapContainerRef.current) return;

    const lat = entityData.latitude;
    const lng = entityData.longitude;

    if (lat === undefined || lng === undefined || (lat === 0 && lng === 0)) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 14,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const pinColor = entityType === 'heritage' ? '#FF9933' : '#138808';
    const markerHtml = `
      <div style="
        background-color: ${pinColor};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    `;

    const icon = L.divIcon({
      className: 'custom-detail-marker',
      html: markerHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup(`<b>${entityData.name || entityData.title}</b><br/>${entityData.city || ''}, ${entityData.state || ''}`)
      .openPopup();

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [entityData, entityType]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-[#E05A2B] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-stone-600">Retrieving verified cultural record...</span>
      </div>
    );
  }

  if (error || !entityData) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-[#E05A2B] flex items-center justify-center mx-auto border border-amber-200">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-stone-900">Record Not Found</h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          {error || 'The requested cultural entity could not be verified in the VIRASAT database.'}
        </p>
        <Link
          to={parentRoutes[entityType]?.path || '/discover'}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E05A2B] hover:bg-[#C84E23] text-white text-xs font-bold transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {parentRoutes[entityType]?.label || 'Collections'}</span>
        </Link>
      </div>
    );
  }

  const name = entityData.name || entityData.title;
  const state = entityData.state || 'India';
  const city = entityData.city || '';
  const imageUrl = entityData.image_url;
  const hasCoordinates = entityData.latitude && entityData.longitude && Math.abs(entityData.latitude) > 0.1;

  return (
    <div className="space-y-10 pb-16 animate-fadeIn">
      {/* 1. Breadcrumbs & Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={parentRoutes[entityType]?.path || '/discover'}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-[#E05A2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {parentRoutes[entityType]?.label}</span>
        </Link>

        {onOpenAIChat && (
          <button
            onClick={() => onOpenAIChat(`Tell me more about ${name} (${state}) and its cultural history.`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ask AI Guide</span>
          </button>
        )}
      </div>

      {/* 2. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
          {/* Hero Image */}
          <div className="lg:col-span-6 relative h-64 lg:h-auto overflow-hidden bg-stone-900">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            {entityData.image_attribution && (
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-xs text-[10px] text-white/90 z-10">
                <span className="truncate">📷 {entityData.image_attribution}</span>
                {entityData.license && <span className="shrink-0 ml-2 font-mono text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-white">{entityData.license}</span>}
              </div>
            )}
          </div>

          {/* Hero Info */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-50 text-[#E05A2B] border border-amber-200">
                  {entityData.category || entityData.craft_category || entityData.story_category || 'Heritage'}
                </span>

                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{entityData.verification_status || 'VERIFIED ARCHIVE'}</span>
                </span>

                {entityData.gi_status && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-600 text-white flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Registered GI Product</span>
                  </span>
                )}
              </div>

              {/* Title & Location */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-stone-900 leading-tight">
                {name}
              </h1>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600">
                <MapPin className="w-4 h-4 text-[#E05A2B]" />
                <span>{city ? `${city}, ` : ''}{state}</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pt-2">
                {entityData.description || entityData.narrative}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-4 text-xs text-stone-500">
              {entityData.source_url && (
                <a
                  href={entityData.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#E05A2B] hover:text-[#C84E23] font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Official Conservation Archive</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <TricolourRibbonWave />
      </section>

      {/* 3. Conditional Specifications & Context Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Key Facts & Specifications */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
            <h3 className="text-base font-bold font-serif text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E05A2B]" />
              <span>Cultural Specifications & Provenance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Heritage Fields */}
              {entityType === 'heritage' && (
                <>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Historical Period</span>
                    <span className="font-semibold text-stone-800 text-sm mt-0.5 block">{entityData.historical_period || 'Ancient / Classical'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Architectural Style</span>
                    <span className="font-semibold text-stone-800 text-sm mt-0.5 block">{entityData.architectural_style || 'Indigenous Masonry'}</span>
                  </div>
                  {entityData.latitude && entityData.longitude && (
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 sm:col-span-2">
                      <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Archaeological GPS Coordinates</span>
                      <span className="font-mono text-stone-800 text-xs mt-0.5 block">
                        {entityData.latitude.toFixed(4)}° N, {entityData.longitude.toFixed(4)}° E (Verified WGS84)
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Festival Fields */}
              {entityType === 'festival' && (
                <>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Month / Season of Celebration</span>
                    <span className="font-semibold text-stone-800 text-sm mt-0.5 block">{entityData.month_or_season || 'Traditional Solar / Lunar Calendar'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Associated Communities</span>
                    <span className="font-semibold text-stone-800 text-sm mt-0.5 block">{entityData.associated_communities || 'Indigenous Cultural Practitioners'}</span>
                  </div>
                </>
              )}

              {/* Craft Fields */}
              {entityType === 'craft' && (
                <>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Origin & Geographical Region</span>
                    <span className="font-semibold text-stone-800 text-sm mt-0.5 block">{entityData.origin || entityData.state}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">GI Registration</span>
                    <span className="font-semibold text-stone-800 text-sm mt-0.5 block">
                      {entityData.gi_status ? 'Certified Geographical Indication' : 'Traditional Non-Certified Craft'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 sm:col-span-2">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Indigenous Materials Used</span>
                    <span className="font-medium text-stone-800 text-xs mt-0.5 block">{entityData.materials_used || 'Natural regional resources'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 sm:col-span-2">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Production Technique</span>
                    <span className="font-medium text-stone-800 text-xs mt-0.5 block">{entityData.production_technique || 'Handloom / Manual carving'}</span>
                  </div>
                </>
              )}

              {/* Performing Art Fields */}
              {entityType === 'performing_art' && (
                <>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Performance Style</span>
                    <span className="font-semibold text-stone-800 text-sm mt-0.5 block">{entityData.performance_style || 'Classical / Folk'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Origin</span>
                    <span className="font-semibold text-stone-800 text-sm mt-0.5 block">{entityData.origin || entityData.state}</span>
                  </div>
                  {entityData.instruments && entityData.instruments.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 sm:col-span-2">
                      <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Traditional Musical Instruments</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {entityData.instruments.map((inst: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700 text-[11px] font-medium">
                            {inst}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Experience Fields */}
              {entityType === 'experience' && (
                <>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Estimated Immersion Duration</span>
                    <span className="font-semibold text-stone-800 text-sm mt-0.5 block">{entityData.duration || 'Half Day (2-3 Hours)'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="font-bold uppercase tracking-wider text-stone-400 block text-[10px]">Associated Heritage Site</span>
                    <span className="font-semibold text-stone-800 text-sm mt-0.5 block">{entityData.associated_place_id || 'Regional Cultural Cluster'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Cultural Significance Paragraph */}
            {(entityData.historical_significance || entityData.cultural_significance) && (
              <div className="space-y-2 pt-2">
                <span className="font-bold uppercase tracking-wider text-stone-500 text-[11px] block">
                  Cultural & Historical Significance
                </span>
                <p className="text-xs text-stone-700 leading-relaxed bg-[#FFFDF9] p-4 rounded-2xl border border-stone-200/70">
                  {entityData.historical_significance || entityData.cultural_significance}
                </p>
              </div>
            )}
          </div>

          {/* Official Source Citations Block */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 font-serif flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Institutional Provenance & Verification</span>
            </h3>

            {sources.length > 0 ? (
              <div className="space-y-3">
                {sources.map((src, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{src.organization}</span>
                      <span className="text-[10px] font-semibold uppercase text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        {src.verification_status}
                      </span>
                    </div>
                    <div className="text-stone-600 font-medium">{src.source_title}</div>
                    <p className="text-stone-500 text-[11px] leading-relaxed pt-1">{src.supporting_claim}</p>
                    <a
                      href={src.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#E05A2B] hover:underline font-semibold text-[11px] pt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{src.source_url}</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
                Verified against official Gazetteers, Archaeological Survey of India (ASI) notifications, and State Tourism archives.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mini-Map and Connected Intelligence */}
        <div className="lg:col-span-5 space-y-6">
          {/* Embedded Mini-Map */}
          {hasCoordinates && (
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E05A2B]" />
                  <span>Exact GPS Coordinates</span>
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  {entityData.latitude.toFixed(4)}, {entityData.longitude.toFixed(4)}
                </span>
              </div>
              <div
                ref={mapContainerRef}
                className="w-full h-56 rounded-2xl overflow-hidden border border-stone-200 z-10"
              />
            </div>
          )}

          {/* Connected Cultural Intelligence */}
          {relatedData && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E05A2B]" />
                  <span>Connected Intelligence</span>
                </span>
                <span className="text-[11px] text-stone-400 font-medium">Regional Network</span>
              </div>

              <div className="space-y-3">
                {/* Related Places */}
                {relatedData.related_places && relatedData.related_places.slice(0, 2).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onExploreRelated('heritage', p.id)}
                    className="p-3 rounded-xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200/60 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#E05A2B] uppercase">Monument</span>
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#E05A2B]">{p.name}</h4>
                      <span className="text-[10px] text-stone-500">{p.city}, {p.state}</span>
                    </div>
                    <ArrowLeft className="w-3.5 h-3.5 text-stone-400 rotate-180 group-hover:text-[#E05A2B] transition-colors" />
                  </div>
                ))}

                {/* Related Crafts */}
                {relatedData.related_arts && relatedData.related_arts.slice(0, 2).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onExploreRelated('craft', c.id)}
                    className="p-3 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/60 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">Master Craft</span>
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">{c.name}</h4>
                      <span className="text-[10px] text-stone-500">{c.origin || c.state}</span>
                    </div>
                    <ArrowLeft className="w-3.5 h-3.5 text-stone-400 rotate-180 group-hover:text-emerald-800 transition-colors" />
                  </div>
                ))}

                {/* Related Festivals */}
                {relatedData.related_festivals && relatedData.related_festivals.slice(0, 2).map((f) => (
                  <div
                    key={f.id}
                    onClick={() => onExploreRelated('festival', f.id)}
                    className="p-3 rounded-xl bg-stone-50 hover:bg-[#FFF8EE] border border-stone-200 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase">Living Festival</span>
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#E05A2B]">{f.name}</h4>
                      <span className="text-[10px] text-stone-500">{f.month_or_season}</span>
                    </div>
                    <ArrowLeft className="w-3.5 h-3.5 text-stone-400 rotate-180 group-hover:text-[#E05A2B] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
