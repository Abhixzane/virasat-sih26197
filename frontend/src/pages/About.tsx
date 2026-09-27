import React from 'react';
import {
  ShieldCheck, Database, Bot, Sparkles, MapPin, Award,
  BookOpen, CheckCircle, Code, Server, Smartphone, Heart, ArrowRight
} from 'lucide-react';
import {
  TricolourRibbonWave, MonumentSkyline, StatsCounterBar
} from '../components/shared/TricolourBranding';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-stone-200/90 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="absolute top-0 inset-x-0 h-40 overflow-hidden pointer-events-none opacity-20 text-[#D4AF37]">
          <MonumentSkyline opacity={0.2} />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#E05A2B]">
            <Award className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>SMART INDIA HACKATHON 2026 (SIH26197)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-900 leading-tight">
            About the VIRASAT Platform
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            VIRASAT (विरासत) is a full-stack, AI-powered Indian cultural discovery platform built to solve the fragmentation of India's heritage tourism.
            By introducing <strong>Connected Cultural Intelligence™</strong>, VIRASAT bridges ancient architecture to living artisan traditions, Vedic festivals, classical dances, and oral folklore.
          </p>
        </div>

        <div className="pt-6">
          <TricolourRibbonWave />
        </div>
      </section>

      {/* 2. SIH26197 Comparative Advantage: Traditional vs VIRASAT */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E05A2B] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE ARCHITECTURAL SHIFT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            Why VIRASAT Stands in the Top Tier for SIH26197
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Comparing typical generic tourism directories against VIRASAT's connected cultural intelligence system.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-stone-200 rounded-2xl overflow-hidden">
            <thead className="bg-[#FFF8EE] text-stone-900 font-serif border-b border-stone-200">
              <tr>
                <th className="p-3.5 font-bold">Feature Domain</th>
                <th className="p-3.5 font-bold text-stone-500">Conventional Tourism Portals</th>
                <th className="p-3.5 font-bold text-[#E05A2B]">VIRASAT (SIH26197 Solution)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              <tr>
                <td className="p-3.5 font-semibold">Information Architecture</td>
                <td className="p-3.5 text-stone-500">Isolated listing cards with static Wikipedia blurbs</td>
                <td className="p-3.5 font-semibold text-[#1A6B3C] bg-emerald-50/30">
                  Connected Cultural Intelligence linking monuments, GI crafts, dances & folklore
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">AI Assistant Integrity</td>
                <td className="p-3.5 text-stone-500">Ungrounded generic LLMs producing hallucinated ticket prices & fake hours</td>
                <td className="p-3.5 font-semibold text-[#1A6B3C] bg-emerald-50/30">
                  Strict Retrieval-Augmented Grounding citing official ASI and State Tourism archives
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Artisan Economics</td>
                <td className="p-3.5 text-stone-500">Commercial souvenir shops and tourist traps</td>
                <td className="p-3.5 font-semibold text-[#1A6B3C] bg-emerald-50/30">
                  Geographical Indications (GI) Registry integration empowering hereditary artisan guilds
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Itinerary Synthesis</td>
                <td className="p-3.5 text-stone-500">Unfiltered list of hotels and random tourist spots</td>
                <td className="p-3.5 font-semibold text-[#1A6B3C] bg-emerald-50/30">
                  Fatigue-aware geographic clustering balancing monuments with authentic cultural immersion
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Data Centralization</td>
                <td className="p-3.5 text-stone-500">Scattered multi-page mockups with inconsistent state</td>
                <td className="p-3.5 font-semibold text-[#1A6B3C] bg-emerald-50/30">
                  Single Centralized In-Memory Knowledge Graph (FastAPI + Pydantic + React 18)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#E05A2B] flex items-center justify-center border border-amber-200/60">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-900 font-serif">1. Connected Cultural Intelligence</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Rather than treating cultural assets as isolated cards, VIRASAT automatically discovers verified relationships connecting monuments to living artisan lineages, sacred epics, and Vedic agrarian festivals.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-900 font-serif">2. Centralized Database Integrity</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All 7 cultural collections reside in a single validated data layer. Zero synthetic ticket prices, fake opening hours, or imaginary government certifications are permitted.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200/60">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-stone-900 font-serif">3. Retrieval-Grounded AI Guide</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Operates on strict database grounding. It only answers questions using verified archaeological records, transparently citing source repositories.
          </p>
        </div>
      </div>

      {/* 4. Verified Government Data Sources */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
          Official Provenance & Verification Authorities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <div className="font-bold text-stone-900">Archaeological Survey of India</div>
            <p className="text-stone-500">Coordinates, historical periods, and monument conservation boundaries.</p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <div className="font-bold text-stone-900">Geographical Indications Registry</div>
            <p className="text-stone-500">GI tag application numbers, artisan guild locations, and materials.</p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <div className="font-bold text-stone-900">Sangeet Natak Akademi</div>
            <p className="text-stone-500">Natya Shastra codification, classical dance lineages, and rasas.</p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <div className="font-bold text-stone-900">UNESCO World Heritage Centre</div>
            <p className="text-stone-500">Tangible and Intangible Cultural Heritage of Humanity registries.</p>
          </div>
        </div>
      </section>

      {/* 5. Stats Bar */}
      <section>
        <StatsCounterBar
          item1={{ count: 'SIH26197', label: 'Problem Statement ID' }}
          item2={{ count: '395+', label: 'Verified Database Entities' }}
          item3={{ count: '100%', label: 'Grounded Authenticity' }}
          item4={{ count: 'Top 5', label: 'National Submission Tier' }}
        />
      </section>
    </div>
  );
};
