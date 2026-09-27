import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bot, Sparkles, ShieldCheck, Globe, Database, ArrowRight } from 'lucide-react';
import { AIChatWidget } from '../components/ai/AIChatWidget';

export const AIGuidePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || undefined;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>Archaeological Knowledge Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
            VIRASAT AI Cultural Guide
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Ask any factual inquiry regarding Indian monuments, festivals, crafts, and performing arts.
            Responses are strictly grounded in our central database before generation, preventing fabricated dates, artificial schedules, or synthetic certifications.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Architectural Grounding Principles */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-heritage space-y-4">
            <h3 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-700" />
              <span>How Retrieval-Grounding Works</span>
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              When you ask a question, VIRASAT parses cultural entities and queries our verified 7-collection archaeological repository. The LLM only synthesizes answers from verified evidence.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-800">Zero Hallucination Guarantee</div>
                  <div className="text-stone-500 text-[11px]">If records are unavailable, the AI explicitly reports database boundaries.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-800">Multilingual Expression</div>
                  <div className="text-stone-500 text-[11px]">Seamlessly supports English, pure हिन्दी, and natural conversational Hinglish.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-800">Connected Intelligence</div>
                  <div className="text-stone-500 text-[11px]">Every answer links to related regional crafts, performing arts, and living stories.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 space-y-2 text-xs">
            <div className="font-bold text-amber-900 uppercase text-[10px]">Strict Integrity Notice</div>
            <p className="text-stone-600 leading-relaxed">
              In accordance with SIH26197 specifications, VIRASAT never fabricates ticket prices, opening hours, live booking statuses, or unverified government partnerships.
            </p>
          </div>
        </div>

        {/* Right Column: Chat Widget */}
        <div className="lg:col-span-8">
          <AIChatWidget initialPrompt={initialPrompt} />
        </div>
      </div>
    </div>
  );
};
