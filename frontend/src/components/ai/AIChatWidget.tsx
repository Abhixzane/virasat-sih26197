import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, User, Sparkles, Copy, Check, RefreshCw, ShieldCheck, Globe, ExternalLink, Mic } from 'lucide-react';
import { api } from '../../services/api';
import { userMemoryService } from '../../services/userMemory';
import { ChatMessage, AIChatResponse, UIAction } from '../../types/cultural';
import { RouteCard, PlaceCard, ItineraryPreviewCard, ActionButtons } from './CompanionCards';

interface AIChatWidgetProps {
  initialPrompt?: string;
  contextRecordId?: string;
  contextRecordType?: string;
  className?: string;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  initialPrompt,
  contextRecordId,
  contextRecordType,
  className = '',
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Namaste! I am your VIRASAT AI Cultural Guide. I provide verified insights into India’s ancient monuments, living festivals, GI-tagged crafts, and folklore—strictly grounded in archaeological and archival records. How may I illuminate your cultural journey today?',
      suggested_follow_ups: [
        'Delhi to Jaipur route options and travel time',
        'Explain the Vedic origins of Chhath Puja in Bihar.',
        'What is the architectural mystery of Hampi’s musical pillars?',
        'How is Jaipur Blue Pottery crafted without using any clay?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'hinglish'>('en');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt && messages.length === 1) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleAction = (act: UIAction) => {
    if (act.path) {
      let target = act.path;
      if (act.params) {
        const queryParams = new URLSearchParams();
        Object.entries(act.params).forEach(([k, v]) => {
          if (v !== undefined && v !== null) queryParams.append(k, String(v));
        });
        const qs = queryParams.toString();
        if (qs) target += `?${qs}`;
      }
      navigate(target);
    }
  };

  const handleSend = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || loading) return;

    setInput('');
    const newMsg: ChatMessage = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    try {
      const userMem = userMemoryService.getUserMemory();
      const activeItin = messages.slice().reverse().find((m) => m.itinerary_card)?.itinerary_card;

      const res: AIChatResponse = await api.chatWithAI({
        message: textToSend,
        preferred_language: language,
        context_record_id: contextRecordId,
        context_record_type: contextRecordType,
        user_memory: userMem,
        active_itinerary: activeItin,
        conversation_history: messages.slice(-6),
      });

      if (res.memory_updates) {
        if (res.memory_updates._action === 'CLEAR') {
          userMemoryService.clearUserMemory();
        } else {
          userMemoryService.saveUserMemory(res.memory_updates);
        }
      }

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: res.response,
        retrieved_records: res.retrieved_records,
        source_references: res.source_references,
        suggested_follow_ups: res.suggested_follow_ups,
        route_card: res.route_card,
        places_cards: res.places_cards,
        itinerary_card: res.itinerary_card,
        actions: res.actions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to reach the cultural intelligence service. Non-AI website navigation remains fully active.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Conversation history cleared. Feel free to ask about any Indian monument, festival, art form, or tradition.',
        suggested_follow_ups: [
          'What is the cultural significance of the Konark Sun Temple?',
          'Tell me about the Warli tribal painting technique in Maharashtra.',
          'Recommend a 3-day cultural heritage itinerary for Varanasi.',
        ],
      },
    ]);
  };

  return (
    <div className={`flex flex-col bg-white rounded-2xl border border-stone-200 shadow-heritage overflow-hidden ${className}`}>
      {/* Header with Language Selector & Controls */}
      <div className="px-4 py-3 bg-[#1C1917] text-white flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white border border-amber-400/40 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <img src="/virasat-logo.png" alt="VIRASAT AI" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-xs font-bold font-serif text-white flex items-center gap-1.5">
              <span>VIRASAT AI Cultural Guide</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-stone-300">
              Grounded in archaeological databases
            </div>
          </div>
        </div>

        {/* Controls: Language Pills & Reset */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-[11px] font-medium">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                language === 'en' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                language === 'hi' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('hinglish')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                language === 'hinglish' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
              }`}
            >
              Hinglish
            </button>
          </div>

          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Clear Chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50 min-h-[380px] max-h-[560px]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-white border border-amber-300 flex items-center justify-center overflow-hidden shrink-0 mt-0.5 shadow-xs">
                <img src="/virasat-logo.png" alt="VIRASAT AI" className="w-full h-full object-cover" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-[#E05A2B] text-white rounded-tr-xs'
                    : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs whitespace-pre-wrap'
                }`}
              >
                {msg.content}

                {/* Embedded Route Card */}
                {msg.route_card && (
                  <RouteCard
                    data={msg.route_card}
                    onNavigateAction={(path, params) => handleAction({ action: 'NAVIGATE', path, params, label: 'View' })}
                  />
                )}

                {/* Embedded Places Cards */}
                {msg.places_cards && msg.places_cards.length > 0 && (
                  <div className="my-2 space-y-2">
                    {msg.places_cards.map((p, pIdx) => (
                      <PlaceCard
                        key={pIdx}
                        place={p}
                        onNavigateAction={(path, params) => handleAction({ action: 'NAVIGATE', path, params, label: 'Explore' })}
                      />
                    ))}
                  </div>
                )}

                {/* Embedded Itinerary Card */}
                {msg.itinerary_card && (
                  <ItineraryPreviewCard
                    itinerary={msg.itinerary_card}
                    onOpenItinerary={(itin) =>
                      handleAction({
                        action: 'OPEN_ITINERARY',
                        path: '/itinerary',
                        params: { destination: itin.destination, days: itin.duration_days },
                        label: 'Open Itinerary'
                      })
                    }
                  />
                )}

                {/* Embedded Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <ActionButtons
                    actions={msg.actions}
                    onActionClick={handleAction}
                  />
                )}

                {/* Grounding & Source Badges for Assistant */}
                {msg.role === 'assistant' && msg.retrieved_records && msg.retrieved_records.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{msg.retrieved_records.length} Database Groundings</span>
                    </span>
                    {msg.source_references && msg.source_references.map((src, i) => (
                      <a
                        key={i}
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-stone-500 hover:text-[#E05A2B] bg-stone-100 px-1.5 py-0.5 rounded transition-colors"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>Source</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Copy action for assistant response */}
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-1 px-1">
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Follow-up suggestions */}
              {msg.suggested_follow_ups && msg.suggested_follow_ups.length > 0 && idx === messages.length - 1 && (
                <div className="mt-3 space-y-1.5 w-full">
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Suggested Exploration:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggested_follow_ups.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(sug)}
                        className="text-left text-[11px] font-medium text-stone-800 bg-[#FFF8EE] hover:bg-[#FFEED9] border border-amber-200/80 px-2.5 py-1.5 rounded-xl transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-white shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[#E05A2B] shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-2 text-xs text-stone-500">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#E05A2B] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#E05A2B] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#E05A2B] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Grounding answer in cultural database...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about monuments, crafts, or festivals in ${language === 'hi' ? 'हिन्दी' : language === 'hinglish' ? 'Hinglish' : 'English'}...`}
          className="flex-1 bg-stone-100 hover:bg-stone-50 focus:bg-white text-stone-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#E05A2B] outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-[#E05A2B] hover:bg-[#C84E23] disabled:bg-stone-300 text-white font-semibold shadow-xs transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
