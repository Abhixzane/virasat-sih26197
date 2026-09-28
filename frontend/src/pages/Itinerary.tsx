import React, { useState, useEffect } from 'react';
import {
  Calendar, MapPin, Sparkles, Clock, Landmark,
  ArrowRight, Check, Compass, Ticket, Info,
  Share2, Download, Edit3, X, Map, List,
  Star, Wifi, Coffee, Utensils, ShoppingBag,
  Bus, Car, Train, Navigation, ShieldCheck, Heart
} from 'lucide-react';
import { api } from '../services/api';
import { ItineraryResponse } from '../types/cultural';

interface ItineraryPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const ItineraryPage: React.FC<ItineraryPageProps> = ({ onExploreRelated }) => {
  const [destination, setDestination] = useState('Tamil Nadu');
  const [days, setDays] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Temple Traditions', 'Crafts', 'Monuments']);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapTab, setMapTab] = useState<'map' | 'list'>('map');
  const [spotlightOpen, setSpotlightOpen] = useState(true);
  const [exploreTab, setExploreTab] = useState('Attractions');
  const [shareToast, setShareToast] = useState(false);

  const interestOptions = [
    'Monuments',
    'Crafts',
    'Festivals',
    'Performing Arts',
    'Temple Traditions',
    'Culinary Heritage',
  ];

  const quickDestinationsRow1 = ['Tamil Nadu', 'Rajasthan', 'Karnataka', 'Bihar', 'Uttar Pradesh'];
  const quickDestinationsRow2 = ['Kerala', 'Odisha', 'Delhi'];

  const exploreTabs = [
    'Attractions',
    'Hotels',
    'Nearby Markets',
    'Local Cuisine',
    'Transport Options',
    'Stay Duration',
    'Cultural Insights'
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!destination.trim() || loading) return;

    setLoading(true);
    try {
      const res = await api.generateItinerary({
        state_or_destination: destination,
        days: days,
        cultural_interests: selectedInterests,
      });
      setItinerary(res);
    } catch (err) {
      console.error('Failed to generate itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleGenerate();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16 bg-[#FFFDF9]">
      {/* Share Toast */}
      {shareToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-900 text-white text-xs font-semibold shadow-2xl animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Itinerary link copied to clipboard!</span>
        </div>
      )}

      {/* 1. Header Banner Matching Reference Screenshot */}
      <section className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-stone-200/90 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Column: Heading, Subtitle & 4 Feature Badges */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-4 z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-800 uppercase tracking-wider border border-emerald-200/60">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>AI CULTURAL ITINERARY SYNTHESIZER</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-extrabold text-[#0B1E36] tracking-tight leading-tight">
              Plan Your Cultural Journey
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
              Discover personalized itineraries across India's heritage sites, festivals, crafts, cuisine and living traditions — designed with verified cultural intelligence.
            </p>

            {/* 4 Feature Badges in a Row */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-medium text-stone-700">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-200/60">
                <MapPin className="w-3.5 h-3.5 text-[#E05A2B]" />
                <span>Curated Routes by Experts</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-200/60">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Authentic Local Experiences</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Information</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-200/60">
                <Compass className="w-3.5 h-3.5 text-teal-600" />
                <span>Sustainable & Responsible Travel</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cultural Montage Artwork (Explore Preserve Experience Bharat) */}
          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full overflow-hidden flex items-center justify-end">
            <img
              src="/itinerary/itinerary-hero-art.jpg"
              alt="Explore Preserve Experience Bharat"
              className="w-full h-full object-cover object-center select-none"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1548013146-72479768bada?w=800';
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. Interactive Route Planner Bar */}
      <form onSubmit={handleGenerate} className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-start">
          {/* Destination / State (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>Destination / State</span>
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Tamil Nadu, Rajasthan..."
                required
                className="w-full pl-9 pr-8 py-2 text-xs font-semibold rounded-xl bg-stone-50 border border-stone-200 focus:border-[#E05A2B] outline-none text-stone-800"
              />
              {destination && (
                <button
                  type="button"
                  onClick={() => setDestination('')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick destination tags matching screenshot */}
            <div className="space-y-1 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {quickDestinationsRow1.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDestination(d)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                      destination.toLowerCase() === d.toLowerCase()
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-2xs'
                        : 'text-stone-600 bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickDestinationsRow2.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDestination(d)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                      destination.toLowerCase() === d.toLowerCase()
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-2xs'
                        : 'text-stone-600 bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trip Duration (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>Trip Duration</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {[1, 2, 3, 4, 5, 7].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setDays(num)}
                  className={`w-9 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    days === num
                      ? 'bg-[#E05A2B] text-white shadow-2xs'
                      : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {num}d
                </button>
              ))}
            </div>
            <p className="text-[10px] text-stone-500 leading-tight pt-1">
              AI clusters locations geographically to minimize transit time.
            </p>
          </div>

          {/* Cultural Focus Areas (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>Cultural Focus Areas</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {interestOptions.map((opt) => {
                const selected = selectedInterests.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggleInterest(opt)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#E05A2B] text-white border-transparent font-semibold shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button (2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-end pt-2 lg:pt-0">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-3 rounded-2xl bg-[#E05A2B] hover:bg-[#D04E20] text-white text-xs font-bold flex flex-col items-center justify-center gap-1 shadow-md transition-all cursor-pointer disabled:opacity-50 text-center leading-snug"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Generate</span>
                  </div>
                  <span>Verified Itinerary</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 3. 4 Trust Metric Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold font-serif text-stone-900 leading-tight">100%</div>
            <div className="text-[11px] text-stone-500 font-medium leading-tight">Geographic Route Coherence</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold font-serif text-stone-900 leading-tight">Zero</div>
            <div className="text-[11px] text-stone-500 font-medium leading-tight">Synthetic Opening Hours</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold font-serif text-stone-900 leading-tight">1–7</div>
            <div className="text-[11px] text-stone-500 font-medium leading-tight">Day Scalability</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold font-serif text-stone-900 leading-tight">Direct</div>
            <div className="text-[11px] text-stone-500 font-medium leading-tight">Artisan & ASI Grounding</div>
          </div>
        </div>
      </div>

      {/* 4. "Your 3-Day Itinerary" Main Section */}
      <section className="space-y-6">
        {/* Section Header */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#E05A2B]">
                <Calendar className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Your {days}-Day Itinerary
              </h2>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-stone-800">
              Temple Traditions & Coastal Heritage of {destination}
            </h3>
            <p className="text-xs text-stone-600">
              Ancient temples, living traditions, vibrant markets and coastal culture.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 180, behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Plan</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Timeline Days on Left, Map & Spotlight on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Timeline of Days (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Day 1 */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#E05A2B] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <span className="text-sm font-bold text-stone-900 font-serif">
                    Day 1 <span className="font-sans font-semibold text-stone-700 text-xs sm:text-sm ml-1.5">Chennai → Mahabalipuram</span>
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  <span>12 Jan 2025</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-5 relative h-40 sm:h-36 rounded-2xl overflow-hidden group">
                  <img
                    src="/itinerary/day1-mahabalipuram.jpg"
                    alt="Shore Temple Mahabalipuram"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800';
                    }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 text-stone-700 flex items-center justify-center text-xs shadow-xs">
                    ›
                  </div>
                </div>

                <div className="sm:col-span-7 space-y-2.5">
                  <div className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E05A2B]" />
                    <span>Key Experiences</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    <li className="flex items-center gap-2">
                      <Landmark className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Shore Temple (UNESCO)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Landmark className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Pancha Rathas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Stone Sculpture Workshops</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Utensils className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Local Seafood Cuisine</span>
                    </li>
                  </ul>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setSpotlightOpen(true)}
                      className="text-xs font-bold text-[#E05A2B] hover:text-[#C04018] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 2 */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <span className="text-sm font-bold text-stone-900 font-serif">
                    Day 2 <span className="font-sans font-semibold text-stone-700 text-xs sm:text-sm ml-1.5">Kanchipuram → Chidambaram</span>
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  <span>13 Jan 2025</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-5 relative h-40 sm:h-36 rounded-2xl overflow-hidden group">
                  <img
                    src="/itinerary/day2-kanchipuram.jpg"
                    alt="Kanchipuram Temple"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1600100397608-f010f4439c28?w=800';
                    }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 text-stone-700 flex items-center justify-center text-xs shadow-xs">
                    ›
                  </div>
                </div>

                <div className="sm:col-span-7 space-y-2.5">
                  <div className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E05A2B]" />
                    <span>Key Experiences</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Kanchipuram Silk Weaving</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Landmark className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Ekambareswarar Temple</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Landmark className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Chidambaram Nataraja Temple</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Classical Dance Performance</span>
                    </li>
                  </ul>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => onExploreRelated('heritage', 'place-meenakshi-temple')}
                      className="text-xs font-bold text-[#E05A2B] hover:text-[#C04018] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 3 */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <span className="text-sm font-bold text-stone-900 font-serif">
                    Day 3 <span className="font-sans font-semibold text-stone-700 text-xs sm:text-sm ml-1.5">Pondicherry (Heritage & Culture)</span>
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  <span>14 Jan 2025</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-5 relative h-40 sm:h-36 rounded-2xl overflow-hidden group">
                  <img
                    src="/itinerary/day3-pondicherry.jpg"
                    alt="Pondicherry French Quarter"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800';
                    }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 text-stone-700 flex items-center justify-center text-xs shadow-xs">
                    ›
                  </div>
                </div>

                <div className="sm:col-span-7 space-y-2.5">
                  <div className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E05A2B]" />
                    <span>Key Experiences</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    <li className="flex items-center gap-2">
                      <Landmark className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>French Quarter Walk</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Aurobindo Ashram</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Coffee className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Local Markets & Cafés</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Beach Sunset Experience</span>
                    </li>
                  </ul>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => onExploreRelated('heritage', 'place-auroville')}
                      className="text-xs font-bold text-[#E05A2B] hover:text-[#C04018] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Route Map Card & Selected Place Spotlight (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Route Map Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-bold text-emerald-900">
                  Route Map
                </h3>
                {/* Map View / List View Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-stone-100 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setMapTab('map')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      mapTab === 'map'
                        ? 'bg-[#E05A2B] text-white shadow-2xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Map View
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapTab('list')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      mapTab === 'list'
                        ? 'bg-[#E05A2B] text-white shadow-2xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    List View
                  </button>
                </div>
              </div>

              {/* Map Canvas / Visual Route */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-[#E8F1F5] min-h-[260px] flex items-center justify-center">
                {mapTab === 'map' ? (
                  <img
                    src="/itinerary/route-map.jpg"
                    alt="Cultural Route Map"
                    className="w-full h-full object-cover select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800';
                    }}
                  />
                ) : (
                  <div className="p-4 w-full space-y-2 text-xs bg-white">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="w-5 h-5 rounded-full bg-[#E05A2B] text-white text-[10px] font-bold flex items-center justify-center">1</span>
                      <span className="font-semibold text-stone-800">Chennai → Mahabalipuram (56 km)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                      <span className="font-semibold text-stone-800">Kanchipuram → Chidambaram (180 km)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                      <span className="font-semibold text-stone-800">Chidambaram → Pondicherry (65 km)</span>
                    </div>
                  </div>
                )}

                {/* Floating Map Zoom buttons */}
                {mapTab === 'map' && (
                  <div className="absolute right-3 top-3 flex flex-col gap-1 z-10">
                    <button type="button" className="w-7 h-7 rounded-lg bg-white shadow text-stone-700 font-bold flex items-center justify-center text-xs hover:bg-stone-50 cursor-pointer">
                      +
                    </button>
                    <button type="button" className="w-7 h-7 rounded-lg bg-white shadow text-stone-700 font-bold flex items-center justify-center text-xs hover:bg-stone-50 cursor-pointer">
                      −
                    </button>
                    <button type="button" className="w-7 h-7 rounded-lg bg-white shadow text-stone-700 flex items-center justify-center hover:bg-stone-50 cursor-pointer">
                      <Compass className="w-3.5 h-3.5 text-stone-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom stats below map */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs border-t border-stone-100">
                <div className="p-2 rounded-xl bg-stone-50">
                  <div className="text-[10px] text-stone-500 font-medium">Total Distance</div>
                  <div className="font-bold text-stone-900 mt-0.5 font-serif">~ 410 km</div>
                </div>
                <div className="p-2 rounded-xl bg-stone-50">
                  <div className="text-[10px] text-stone-500 font-medium">Est. Travel Time</div>
                  <div className="font-bold text-stone-900 mt-0.5 font-serif">~ 8 hrs</div>
                </div>
                <div className="p-2 rounded-xl bg-stone-50">
                  <div className="text-[10px] text-stone-500 font-medium">Best Season</div>
                  <div className="font-bold text-stone-900 mt-0.5 font-serif">Oct – Mar</div>
                </div>
              </div>
            </div>

            {/* Selected Place Spotlight Card (Shore Temple) */}
            {spotlightOpen && (
              <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs space-y-3.5 p-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    Shore Temple
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSpotlightOpen(false)}
                    className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative h-44 rounded-2xl overflow-hidden">
                  <img
                    src="/itinerary/spotlight-shore-temple.jpg"
                    alt="Shore Temple Sunset"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800';
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-stone-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>Mahabalipuram, Tamil Nadu</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      ✦ UNESCO Heritage
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[10px] font-bold text-purple-800 border border-purple-200">
                      ✦ Monument
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed pt-1">
                    A 7th-century structural temple built by the Pallavas, famous for its intricate carvings and stunning coastal views.
                  </p>

                  <div className="space-y-1.5 pt-2 text-xs border-t border-stone-100">
                    <div className="flex items-center justify-between text-stone-600">
                      <span className="text-stone-500">Timings:</span>
                      <span className="font-semibold text-stone-800">6:00 AM – 6:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-600">
                      <span className="text-stone-500">Entry Fee:</span>
                      <span className="font-semibold text-stone-800">₹40 (Indians) | ₹600 (Foreigners)</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-600">
                      <span className="text-stone-500">Time Required:</span>
                      <span className="font-semibold text-stone-800">1 – 2 Hours</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-600">
                      <span className="text-stone-500">Best Time:</span>
                      <span className="font-semibold text-stone-800">Oct – Mar</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => onExploreRelated('heritage', 'place-mahabalipuram')}
                      className="py-2 px-3 rounded-xl bg-[#E05A2B] hover:bg-[#D04E20] text-white text-xs font-bold transition-all text-center cursor-pointer shadow-2xs"
                    >
                      Add to Itinerary
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapTab('map')}
                      className="py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all text-center cursor-pointer"
                    >
                      View on Map
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. "Explore Along the Way" Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Explore Along the Way
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {exploreTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setExploreTab(tab)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                exploreTab === tab
                  ? 'bg-orange-50 text-[#E05A2B] border border-[#E05A2B] font-bold shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Shore Temple */}
          <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs flex flex-col justify-between">
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src="/itinerary/explore-shore-temple.jpg"
                  alt="Shore Temple"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800';
                  }}
                />
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-900/80 backdrop-blur-md text-[10px] font-bold text-emerald-300">
                  Must Visit
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Shore Temple
                </h3>
                <div className="text-xs text-stone-500 font-medium">
                  Mahabalipuram, Tamil Nadu
                </div>
                <div className="text-xs text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>0 km from city center</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed pt-1">
                  A UNESCO World Heritage Site with exquisite Dravidian architecture.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setSpotlightOpen(true)}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2: Kanchipuram Silk Market */}
          <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs flex flex-col justify-between">
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src="/itinerary/explore-silk.jpg"
                  alt="Kanchipuram Silk Market"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';
                  }}
                />
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-900/80 backdrop-blur-md text-[10px] font-bold text-amber-300">
                  Popular
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Kanchipuram Silk Market
                </h3>
                <div className="text-xs text-stone-500 font-medium">
                  Kanchipuram, Tamil Nadu
                </div>
                <div className="text-xs text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>2.5 km from temple</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed pt-1">
                  Traditional silk sarees, handloom collections, and artisan outlets.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => onExploreRelated('art_craft', 'art-kanjeevaram-silk')}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 3: The Residency Tower */}
          <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs flex flex-col justify-between">
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src="/itinerary/explore-hotel.jpg"
                  alt="The Residency Tower"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
                  }}
                />
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-blue-900/80 backdrop-blur-md text-[10px] font-bold text-blue-300">
                  Recommended
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-serif font-bold text-stone-900">
                  The Residency Tower
                </h3>
                <div className="text-xs text-stone-500 font-medium">
                  Chennai, Tamil Nadu
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.5</span>
                  <span className="text-stone-400 font-normal">(2.1k reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-0.5">
                  <span>₹₹₹</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5"><Wifi className="w-3 h-3" /> Free WiFi</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5"><Coffee className="w-3 h-3" /> Breakfast</span>
                </div>
                <div className="text-xs text-stone-500 flex items-center gap-1 pt-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>3 km from city center</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <a
                href="https://www.google.com/travel/hotels"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Hotel</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom "Plan with Local Context" Banner */}
      <section className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#E05A2B]">
            <Compass className="w-3.5 h-3.5" />
          </span>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif">
            Plan with Local Context
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {/* Pillar 1 */}
          <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E05A2B]" />
              <span>Nearby Cities</span>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed font-medium">
              Mahabalipuram (0 km), Kanchipuram (75 km)
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#E05A2B]" />
              <span>Stay Duration</span>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed font-medium">
              1-2 days per city (Recommended)
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 text-[#E05A2B]" />
              <span>Nearby Markets</span>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed font-medium">
              Kanchipuram Silk Market, Pondy Bazaar (Chennai)
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
              <Utensils className="w-3 h-3 text-[#E05A2B]" />
              <span>Local Cuisine</span>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed font-medium">
              Filter Coffee, Chettinad Cuisine, Seafood, Tamil Thali
            </div>
          </div>

          {/* Pillar 5 */}
          <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
              <Bus className="w-3 h-3 text-[#E05A2B]" />
              <span>Transport Options</span>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed font-medium">
              Cab / Train / Bus (Well connected)
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
