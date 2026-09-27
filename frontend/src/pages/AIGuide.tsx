import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bot, Sparkles, ShieldCheck, Globe, Database, ArrowRight,
  CheckCircle, MessageSquareQuote, Cpu, BookOpen
} from 'lucide-react';
import { AIChatWidget } from '../components/ai/AIChatWidget';
import {
  TricolourRibbonWave, MonumentSkyline, StatsCounterBar
} from '../components/shared/TricolourBranding';

export const AIGuidePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || undefined;

  const quickPrompts = [
    "Tell me about Hampi's musical acoustic pillars",
    "What is the Vedic significance of Chhath Puja?",
    "Explain the Korvai weaving technique of Kanjeevaram sarees",
    "How does Kathakali makeup communicate dramatic character?",
    "What makes Rani ki Vav an inverted subterranean marvel?",
    "Connect Brihadisvara Temple with Thanjavur bronze casting"
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-stone-200/90 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="absolute top-0 inset-x-0 h-40 overflow-hidden pointer-events-none opacity-20 text-[#D4AF37]">
          <MonumentSkyline opacity={0.2} />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#E05A2B]">
            <Bot className="w-3.5 h-3.5 text-[#E05A2B]" />
            <span>ARCHIVAL RETRIEVAL-GROUNDED CULTURAL INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-stone-900 leading-tight">
            VIRASAT AI Cultural Guide
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            Ask any factual inquiry regarding Indian monuments, living festivals, GI-tagged crafts, and classical theatre.
            Unlike standard LLMs, VIRASAT retrieves verified database records before generating responses, providing zero data hallucinations and direct archival citations.
          </p>
        </div>

        <div className="pt-6">
          <TricolourRibbonWave />
        </div>
      </section>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Architectural Grounding Principles */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
              <Database className="w-4 h-4 text-[#E05A2B]" />
              <span>How Retrieval-Grounding Works</span>
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              When you submit a query, VIRASAT extracts cultural entities, searches our 7-collection knowledge graph, and builds an archaeological context packet before feeding it to the AI synthesizer.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">Zero Hallucination Guarantee</div>
                  <div className="text-stone-600 text-[11px] mt-0.5">
                    No fabricated ticket prices, synthetic opening hours, or fake certifications.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/60 border border-blue-200/60">
                <Globe className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">Multilingual Fluency</div>
                  <div className="text-stone-600 text-[11px] mt-0.5">
                    Responds fluently in English, Shuddha हिन्दी, and natural conversational Hinglish.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
                <Sparkles className="w-4 h-4 text-[#E05A2B] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">Connected Intelligence Badges</div>
                  <div className="text-stone-600 text-[11px] mt-0.5">
                    Every answer provides clickable record badges linking directly to source monuments.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Prompts Panel */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4 text-[#E05A2B]" />
              <span>Recommended Cultural Inquiries</span>
            </h4>
            <div className="space-y-2">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Ask about"]') as HTMLInputElement;
                    if (input) {
                      input.value = p;
                      input.dispatchEvent(new Event('input', { bubbles: true }));
                      input.focus();
                    }
                  }}
                  className="w-full text-left text-xs text-stone-700 hover:text-[#E05A2B] p-2.5 rounded-xl bg-stone-50 hover:bg-[#FFF8EE] border border-stone-200/80 transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{p}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#E05A2B] shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat Interface */}
        <div className="lg:col-span-8">
          <AIChatWidget initialPrompt={initialPrompt} />
        </div>
      </div>

      {/* 3. Stats Bar */}
      <section>
        <StatsCounterBar
          item1={{ count: '395+', label: 'Verified Database Entities' }}
          item2={{ count: '100%', label: 'Fact-Grounded Responses' }}
          item3={{ count: '3', label: 'Supported Languages (EN/HI/HING)' }}
          item4={{ count: '< 1s', label: 'Retrieval Synthesis Speed' }}
        />
      </section>
    </div>
  );
};
