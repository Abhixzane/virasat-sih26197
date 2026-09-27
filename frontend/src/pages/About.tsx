import React from 'react';
import { ShieldCheck, Database, Bot, Sparkles, MapPin, Award, BookOpen } from 'lucide-react';
import { VirasatBrand } from '../components/shared/TricolourBranding';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SIH26197 • Architectural Specifications</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            About the VIRASAT Platform
          </h1>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
            VIRASAT is an AI-powered Indian cultural heritage platform engineered to solve the problem of fragmented, superficial tourism listings by implementing multidimensional <strong>Connected Cultural Intelligence</strong>.
          </p>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-heritage space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-900 font-serif">1. Connected Cultural Intelligence</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Rather than treating cultural assets as isolated cards, VIRASAT automatically discovers verified relationships connecting monuments to living artisan lineages, sacred epics, and Vedic agrarian festivals.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-heritage space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-900 font-serif">2. Centralized Single Source of Truth</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All 7 cultural domains—States & Cities, Monuments, Festivals, Crafts, Performing Arts, Experiences, and Folklore—reside in a synchronized central data layer. No independent, disconnected state files exist.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-heritage space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-800">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-900 font-serif">3. Retrieval-Grounded AI</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Our AI assistant operates on strict database grounding. It never generates unverified dates, fabricated certifications, or synthetic partnerships. When records are unavailable, it transparently reports its data boundaries.
          </p>
        </div>
      </div>

      {/* Data Verification Guidelines */}
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-heritage space-y-6">
        <h2 className="text-2xl font-bold font-serif text-stone-900">
          Strict Data Integrity Protocols
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed">
          <div className="space-y-3 border-l-2 border-amber-600 pl-4">
            <h4 className="font-bold text-stone-900 text-sm">Verified Coordinates & AMASR Bounds</h4>
            <p>
              Every pin on our Cultural Map utilizes verified coordinates cross-referenced against the Archaeological Survey of India (ASI) protected monument inventory. Unverified or zero-coordinate entities are excluded from map projections.
            </p>
          </div>

          <div className="space-y-3 border-l-2 border-emerald-600 pl-4">
            <h4 className="font-bold text-stone-900 text-sm">Geographical Indication (GI) Validation</h4>
            <p>
              Traditional crafts such as Jaipur Blue Pottery, Madhubani Painting, and Varanasi Kadhwa Brocades are tagged with authentic Geographical Indication status recognized by the Office of the Controller General of Patents, Designs and Trade Marks.
            </p>
          </div>

          <div className="space-y-3 border-l-2 border-purple-600 pl-4">
            <h4 className="font-bold text-stone-900 text-sm">Oral Folklore vs. Historical Records</h4>
            <p>
              VIRASAT explicitly separates epigraphical and architectural evidence from traditional religious narratives and folklore, ensuring students and researchers receive rigorous contextual education.
            </p>
          </div>

          <div className="space-y-3 border-l-2 border-blue-600 pl-4">
            <h4 className="font-bold text-stone-900 text-sm">No Commercial Fabrications</h4>
            <p>
              To maintain public trust, VIRASAT never fabricates ticket prices, opening hours, live booking queues, or synthetic government partnerships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
