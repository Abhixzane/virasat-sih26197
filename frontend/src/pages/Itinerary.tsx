import React, { useState } from 'react';
import {
  BookOpen, Calendar, MapPin, Sparkles, Clock, Landmark,
  Navigation, ArrowRight, ShieldCheck, Printer, Check, Compass
} from 'lucide-react';
import { api } from '../services/api';
import { ItineraryResponse } from '../types/cultural';
import {
  TricolourRibbonWave, MonumentSkyline, StatsCounterBar
} from '../components/shared/TricolourBranding';

interface ItineraryPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const ItineraryPage: React.FC<ItineraryPageProps> = ({ onExploreRelated }) => {
  const [destination, setDestination] = useState('Tamil Nadu');
  const [days, setDays] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Monuments', 'Crafts', 'Temple Traditions']);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const interestOptions = [
    'Monuments',
    'Crafts',
    'Festivals',
    'Performing Arts',
    'Temple Traditions',
    'Culinary Heritage',
  ];

  const quickDestinations = [
    'Tamil Nadu', 'Rajasthan', 'Karnataka', 'Bihar',
    'Uttar Pradesh', 'Kerala', 'Odisha', 'Delhi'
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-stone-200/90 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="absolute top-0 inset-x-0 h-40 overflow-hidden pointer-events-none opacity-20 text-[#D4AF37]">
          <MonumentSkyline opacity={0.2} />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#E05A2B]">
            <Calendar className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>AI CULTURAL ITINERARY SYNTHESIZER</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-900 leading-tight">
            Plan Your Cultural Journey
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            Synthesize balanced day-by-day travel plans grounded in verified geographic clusters.
            Weave together UNESCO monuments, master craft ateliers, sacred riverfront ceremonies, and classical theatre without travel fatigue.
          </p>
        </div>

        <div className="pt-6">
          <TricolourRibbonWave />
        </div>
      </section>

      {/* 2. Interactive Generator Form */}
      <form onSubmit={handleGenerate} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Destination */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>Target State or Cultural Destination</span>
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Tamil Nadu, Rajasthan, Varanasi, Hampi..."
              required
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-medium outline-none focus:border-[#E05A2B]"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickDestinations.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDestination(d)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-md border transition-colors ${
                    destination === d
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                      : 'text-stone-600 bg-white border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Days */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E05A2B]" />
              <span>Duration ({days} Days)</span>
            </label>
            <div className="flex items-center gap-2 pt-1">
              {[1, 2, 3, 4, 5, 7].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setDays(num)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                    days === num
                      ? 'bg-[#E05A2B] text-white shadow-xs'
                      : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {num}d
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-500 pt-1">
              AI clusters locations geographically to minimize transit time.
            </p>
          </div>
        </div>

        {/* Cultural Interests */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>Select Cultural Focus Areas</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((opt) => {
              const selected = selectedInterests.includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => toggleInterest(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selected
                      ? 'bg-[#E05A2B] text-white shadow-xs'
                      : 'bg-stone-50 text-stone-700 border border-stone-200/80 hover:bg-stone-100'
                  }`}
                >
                  {selected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#E05A2B] hover:bg-[#D04E20] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing Cultural Route...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Verified Itinerary</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 3. Generated Itinerary Results View */}
      {itinerary && (
        <div className="space-y-6 animate-fadeIn">
          {/* Itinerary Title Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E05A2B]">
                {itinerary.duration_days}-Day Verified Cultural Circuit
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                {itinerary.itinerary_title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
                {itinerary.overview}
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition-colors shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>

          {/* Days Cards */}
          <div className="space-y-6">
            {itinerary.days.map((day) => (
              <div
                key={day.day_number}
                className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6"
              >
                {/* Day Header */}
                <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#E05A2B] text-white flex items-center justify-center font-bold text-sm font-serif shrink-0 shadow-xs">
                    D{day.day_number}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-serif text-stone-900">
                      Day {day.day_number}: {day.theme}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                      {day.cultural_explanation}
                    </p>
                  </div>
                </div>

                {/* Day Items: Places & Experiences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Heritage Places on this day */}
                  {day.heritage_places.map((place) => (
                    <div
                      key={place.id}
                      onClick={() => onExploreRelated('heritage', place.id)}
                      className="group p-4 rounded-2xl bg-amber-50/40 hover:bg-amber-50/80 border border-amber-200/60 transition-all cursor-pointer flex gap-3.5 items-start"
                    >
                      <img
                        src={place.image_url}
                        alt={place.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#E05A2B] uppercase">
                          Monuments & Architecture
                        </span>
                        <h4 className="text-sm font-bold text-stone-900 font-serif group-hover:text-[#E05A2B]">
                          {place.name}
                        </h4>
                        <div className="text-[11px] text-stone-500 font-medium">
                          {place.city}, {place.state}
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-2">
                          {place.description || place.historical_significance}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Cultural Experiences on this day */}
                  {day.cultural_experiences.map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => onExploreRelated('experience', exp.id)}
                      className="group p-4 rounded-2xl bg-emerald-50/40 hover:bg-emerald-50/80 border border-emerald-200/60 transition-all cursor-pointer flex gap-3.5 items-start"
                    >
                      <img
                        src={exp.image_url}
                        alt={exp.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase">
                          Artisan & Ritual Immersion
                        </span>
                        <h4 className="text-sm font-bold text-stone-900 font-serif group-hover:text-emerald-900">
                          {exp.name}
                        </h4>
                        <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{exp.duration}</span> • <span>{exp.city}</span>
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-2">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Stats Bar */}
      <section>
        <StatsCounterBar
          item1={{ count: '100%', label: 'Geographic Route Coherence' }}
          item2={{ count: 'Zero', label: 'Synthetic Opening Hours' }}
          item3={{ count: '1–7', label: 'Day Scalability' }}
          item4={{ count: 'Direct', label: 'Artisan & ASI Grounding' }}
        />
      </section>
    </div>
  );
};
