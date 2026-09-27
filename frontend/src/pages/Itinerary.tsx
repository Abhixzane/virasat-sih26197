import React, { useState } from 'react';
import { BookOpen, Calendar, MapPin, Sparkles, Clock, Landmark, Navigation, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { ItineraryResponse } from '../types/cultural';

interface ItineraryPageProps {
  onExploreRelated: (type: string, id: string) => void;
}

export const ItineraryPage: React.FC<ItineraryPageProps> = ({ onExploreRelated }) => {
  const [destination, setDestination] = useState('Bihar');
  const [days, setDays] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Monuments', 'Crafts']);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const interestOptions = ['Monuments', 'Crafts', 'Festivals', 'Performing Arts', 'Spiritual Walks'];

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

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Factual Archaeological Planning</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Cultural Heritage Itinerary Generator
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Create a day-wise cultural journey through India grounded strictly in authentic monuments and artisan guilds.
            No fabricated travel times, artificial booking claims, or synthetic schedules.
          </p>
        </div>
      </div>

      {/* Generator Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-heritage">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Destination Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                State or Heritage Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-amber-700 absolute left-3 top-3" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Bihar, Rajasthan, Uttar Pradesh, Hampi..."
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 font-medium outline-none focus:border-amber-600"
                  required
                />
              </div>
            </div>

            {/* Days Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-stone-800 uppercase tracking-wider">
                <span>Duration</span>
                <span className="text-amber-800 font-serif">{days} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>1 Day</span>
                <span>4 Days</span>
                <span>7 Days</span>
              </div>
            </div>

            {/* Cultural Interests Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Cultural Focus
              </label>
              <div className="flex flex-wrap gap-1.5">
                {interestOptions.map((interest) => (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedInterests.includes(interest)
                        ? 'bg-amber-800 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Grounded in verified database records</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:bg-stone-300 text-white text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Grounded Itinerary</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Itinerary Output */}
      {itinerary && (
        <div className="space-y-6 animate-fadeIn">
          {/* Overview Banner */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-3xl p-6 sm:p-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>{itinerary.duration_days}-Day Verified Cultural Blueprint</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-stone-900">
              {itinerary.itinerary_title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
              {itinerary.overview}
            </p>
          </div>

          {/* Days Accordion / List */}
          <div className="space-y-6">
            {itinerary.days.map((day) => (
              <div
                key={day.day_number}
                className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-heritage space-y-6"
              >
                {/* Day Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-800 text-white font-serif font-bold text-sm flex items-center justify-center shadow-xs">
                      D{day.day_number}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                        Day {day.day_number} Cultural Theme
                      </div>
                      <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900">
                        {day.theme}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Cultural Explanation */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
                  {day.cultural_explanation}
                </p>

                {/* Grid of Heritage Places and Experiences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Heritage Monuments */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-amber-700" />
                      <span>Archaeological & Heritage Sites</span>
                    </div>
                    {day.heritage_places.map((place) => (
                      <div
                        key={place.id}
                        onClick={() => onExploreRelated('heritage', place.id)}
                        className="p-3 bg-stone-50 hover:bg-amber-50/50 rounded-xl border border-stone-200 hover:border-amber-300 cursor-pointer transition-all flex items-center gap-3"
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
                          <h4 className="text-xs font-bold text-stone-900 truncate">{place.name}</h4>
                          <p className="text-[11px] text-stone-500 truncate">{place.architectural_style}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
                      </div>
                    ))}
                  </div>

                  {/* Cultural Experiences */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      <span>Artisan Immersions & Walks</span>
                    </div>
                    {day.cultural_experiences.map((exp) => (
                      <div
                        key={exp.id}
                        onClick={() => onExploreRelated('experience', exp.id)}
                        className="p-3 bg-stone-50 hover:bg-blue-50/50 rounded-xl border border-stone-200 hover:border-blue-300 cursor-pointer transition-all flex items-center gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate">{exp.name}</h4>
                          <p className="text-[11px] text-stone-500 truncate">{exp.duration} • {exp.category}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Associated Traditions */}
                {day.associated_traditions && day.associated_traditions.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-stone-400 font-semibold text-[10px] uppercase">Regional Celebrations:</span>
                    {day.associated_traditions.map((trad, tIdx) => (
                      <span
                        key={tIdx}
                        className="bg-amber-100 text-amber-900 text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {trad}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
