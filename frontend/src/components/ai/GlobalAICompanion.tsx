import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, X, Send, Mic, MicOff, Maximize2, Minimize2, 
  RefreshCw, UserCheck, ShieldCheck, ExternalLink, Copy, Check,
  Settings2, MapPin, Compass
} from 'lucide-react';
import { api } from '../../services/api';
import { userMemoryService } from '../../services/userMemory';
import { ChatMessage, AIChatResponse, UIAction, UserMemory } from '../../types/cultural';
import { RouteCard, PlaceCard, ItineraryPreviewCard, ActionButtons } from './CompanionCards';

export const GlobalAICompanion: React.FC = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMemoryDrawer, setShowMemoryDrawer] = useState(false);

  const [userMemory, setUserMemory] = useState<UserMemory>(userMemoryService.getUserMemory());
  const [language, setLanguage] = useState<'en' | 'hi' | 'hinglish'>((userMemory.preferred_language as any) || 'en');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Namaste! I am your **VIRASAT AI Cultural Travel Companion**.\n\n' +
        'I am with you across your entire journey through India—answering questions about ancient monuments, sacred rituals, GI-tagged artisan crafts, highway and train routes, and customized itineraries.\n\n' +
        'How can I guide your cultural exploration today?',
      suggested_follow_ups: [
        'Delhi to Jaipur route and travel options',
        'Varanasi Ghats aur Kashi Vishwanath ki history',
        'Hampi ke musical pillars ka architectural secret',
        'Plan a 3-day cultural trip to Jaipur'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Sync memory when language changes
  const handleLanguageChange = (lang: 'en' | 'hi' | 'hinglish') => {
    setLanguage(lang);
    const updated = userMemoryService.saveUserMemory({ preferred_language: lang });
    setUserMemory(updated);
  };

  // Web Speech API Voice Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'hinglish' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Send message
  const handleSend = async (textToSend: string) => {
    const cleaned = textToSend.trim();
    if (!cleaned || loading) return;

    setInput('');
    const userMsg: ChatMessage = { role: 'user', content: cleaned };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const activeItin = messages.slice().reverse().find((m) => m.itinerary_card)?.itinerary_card;

      const res: AIChatResponse = await api.chatWithAI({
        message: cleaned,
        preferred_language: language,
        user_memory: userMemory,
        active_itinerary: activeItin,
        conversation_history: messages.slice(-6)
      });

      // If memory update returned from AI
      if (res.memory_updates) {
        if (res.memory_updates._action === 'CLEAR') {
          userMemoryService.clearUserMemory();
          setUserMemory(userMemoryService.getUserMemory());
        } else {
          const updated = userMemoryService.saveUserMemory(res.memory_updates);
          setUserMemory(updated);
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
        intent_detected: res.intent_detected
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered a brief connection issue. Standard website navigation remains active.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Universal Website Action execution
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
      // Auto minimize on mobile
      if (window.innerWidth < 640) {
        setIsOpen(false);
      }
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Conversation history refreshed. Feel free to ask about any city route, temple history, craft origin, or personalized multi-day itinerary across India.',
        suggested_follow_ups: [
          'Varanasi se Ayodhya kaise jayein?',
          'Jaipur Blue Pottery ki craft technique',
          'What are the UNESCO monuments in Delhi?'
        ]
      }
    ]);
  };

  return (
    <>
      {/* 1. Persistent Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 pl-2.5 pr-4 py-2.5 bg-gradient-to-r from-[#E05A2B] to-[#C94B20] text-white rounded-full shadow-2xl hover:shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all duration-300 group border-2 border-white/90"
          title="Open VIRASAT Universal AI Travel Companion"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden bg-white p-0.5 shadow-xs shrink-0 flex items-center justify-center">
            <img src="/virasat-logo.png" alt="VIRASAT" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold font-serif tracking-tight flex items-center gap-1.5">
              <span>VIRASAT AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="text-[9px] text-amber-100 font-medium leading-none">
              Cultural Travel Companion
            </span>
          </div>
          <div className="w-5 h-5 rounded-full bg-white/20 p-1 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
          </div>
        </button>
      )}

      {/* 2. Expanded Floating Companion Drawer / Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white border border-stone-200 shadow-2xl overflow-hidden ${
            isFullscreen
              ? 'inset-3 sm:inset-6 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[640px] max-h-[88vh] rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#1C1917] text-white flex items-center justify-between border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white border border-amber-400/50 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                <img src="/virasat-logo.png" alt="VIRASAT AI" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs font-bold font-serif text-white flex items-center gap-1.5">
                  <span>VIRASAT AI Companion</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-stone-300 flex items-center gap-1">
                  <span>India Cultural Tourism Guide</span>
                  {userMemory.home_city && (
                    <span className="text-amber-400">• From {userMemory.home_city}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Header Controls: Language, Memory, Fullscreen, Reset, Close */}
            <div className="flex items-center gap-1.5">
              {/* Language Selector */}
              <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-[10px] font-semibold">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    language === 'en' ? 'bg-[#E05A2B] text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageChange('hi')}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    language === 'hi' ? 'bg-[#E05A2B] text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => handleLanguageChange('hinglish')}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    language === 'hinglish' ? 'bg-[#E05A2B] text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Hinglish
                </button>
              </div>

              {/* Memory Settings Toggle */}
              <button
                onClick={() => setShowMemoryDrawer(!showMemoryDrawer)}
                className={`p-1.5 rounded-lg transition-colors relative ${
                  showMemoryDrawer ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-white/10'
                }`}
                title="Your Travel Profile & Memory"
              >
                <UserCheck className="w-3.5 h-3.5" />
                {userMemoryService.hasMemory() && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>

              {/* Reset Chat */}
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset Conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
                title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Minimize Companion"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User Memory Drawer (Slide-down overlay) */}
          {showMemoryDrawer && (
            <div className="bg-stone-900 text-white p-4 border-b border-stone-800 text-xs shrink-0 animate-in slide-in-from-top duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 font-bold font-serif text-amber-300 text-sm">
                  <Settings2 className="w-4 h-4" />
                  <span>Personalized Travel Profile</span>
                </div>
                <button
                  onClick={() => setShowMemoryDrawer(false)}
                  className="text-stone-400 hover:text-white text-[11px]"
                >
                  Done
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                    Home City
                  </label>
                  <input
                    type="text"
                    value={userMemory.home_city || ''}
                    placeholder="e.g. Delhi, Mumbai"
                    onChange={(e) => {
                      const updated = userMemoryService.saveUserMemory({ home_city: e.target.value });
                      setUserMemory(updated);
                    }}
                    className="w-full bg-stone-800 text-white rounded-lg px-2.5 py-1.5 border border-stone-700 text-xs focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                    Budget Preference
                  </label>
                  <select
                    value={userMemory.budget_tier || 'Moderate'}
                    onChange={(e) => {
                      const updated = userMemoryService.saveUserMemory({ budget_tier: e.target.value });
                      setUserMemory(updated);
                    }}
                    className="w-full bg-stone-800 text-white rounded-lg px-2 py-1.5 border border-stone-700 text-xs focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="Budget">Budget (Hostels & State RTC)</option>
                    <option value="Moderate">Moderate (Heritage Stays & Express)</option>
                    <option value="Luxury">Luxury (Heritage Palaces & Flights)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                    Travel Style
                  </label>
                  <select
                    value={userMemory.travel_style || 'Cultural Explorer'}
                    onChange={(e) => {
                      const updated = userMemoryService.saveUserMemory({ travel_style: e.target.value });
                      setUserMemory(updated);
                    }}
                    className="w-full bg-stone-800 text-white rounded-lg px-2 py-1.5 border border-stone-700 text-xs focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="Solo Explorer">Solo Explorer</option>
                    <option value="Family with Kids">Family with Kids</option>
                    <option value="Couple">Couple</option>
                    <option value="Senior Citizens">Senior Citizens</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
                    Dietary Preference
                  </label>
                  <select
                    value={userMemory.dietary_pref || 'Flexible'}
                    onChange={(e) => {
                      const updated = userMemoryService.saveUserMemory({ dietary_pref: e.target.value });
                      setUserMemory(updated);
                    }}
                    className="w-full bg-stone-800 text-white rounded-lg px-2 py-1.5 border border-stone-700 text-xs focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="Flexible">Flexible / Local Cuisine</option>
                    <option value="Pure Vegetarian">Pure Vegetarian</option>
                    <option value="Jain (No Root Veg)">Jain (No Root Veg)</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-[10px]">
                <span className="text-stone-400">
                  Data stored locally in your browser.
                </span>
                <button
                  onClick={() => {
                    userMemoryService.clearUserMemory();
                    setUserMemory(userMemoryService.getUserMemory());
                  }}
                  className="text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Clear Memory
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6] text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-white border border-amber-300/80 flex items-center justify-center overflow-hidden shrink-0 mt-0.5 shadow-2xs">
                    <img src="/virasat-logo.png" alt="VIRASAT" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className={`max-w-[88%] sm:max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed shadow-2xs ${
                      msg.role === 'user'
                        ? 'bg-[#E05A2B] text-white rounded-tr-xs text-xs sm:text-sm font-medium'
                        : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-xs whitespace-pre-wrap text-xs sm:text-sm'
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
                      <div className="my-2.5 space-y-2">
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          Featured Destinations & Heritage Sites:
                        </div>
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

                    {/* Database Grounding Badges */}
                    {msg.role === 'assistant' && msg.retrieved_records && msg.retrieved_records.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>{msg.retrieved_records.length} Database Groundings</span>
                        </span>
                        {msg.source_references && msg.source_references.slice(0, 2).map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-stone-500 hover:text-[#E05A2B] bg-stone-100 px-1.5 py-0.5 rounded transition-colors"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>Source Record</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Copy message action */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-700 transition-colors"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy response</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Suggested Follow-ups */}
                  {msg.suggested_follow_ups && msg.suggested_follow_ups.length > 0 && idx === messages.length - 1 && (
                    <div className="mt-3 space-y-1.5 w-full">
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Suggested Inquiries:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggested_follow_ups.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSend(sug)}
                            className="text-left text-[11px] font-medium text-stone-800 bg-[#FFF8EE] hover:bg-[#FFEED9] border border-amber-200 px-2.5 py-1.5 rounded-xl transition-colors shadow-2xs"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white border border-amber-300 flex items-center justify-center overflow-hidden shrink-0 mt-0.5 shadow-xs">
                  <img src="/virasat-logo.png" alt="VIRASAT" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 rounded-2xl bg-white border border-stone-200 text-stone-500 rounded-tl-xs flex items-center gap-2 text-xs shadow-2xs">
                  <div className="w-2 h-2 rounded-full bg-[#E05A2B] animate-ping" />
                  <span>Consulting archaeological archives and transit schedules...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar with Speech Recognition */}
          <div className="p-3 bg-white border-t border-stone-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
            >
              {/* Voice recognition button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-200'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Speak your query'}
              >
                {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isListening
                    ? 'Listening to your voice...'
                    : language === 'hi'
                    ? 'भारत के किसी भी स्मारक, उत्सव, शिल्प या यात्रा मार्ग के बारे में पूछें...'
                    : language === 'hinglish'
                    ? 'Kisi bhi monument, festival, craft ya travel route ke baare me pucho...'
                    : 'Ask about any monument, festival, GI craft, or city route...'
                }
                className="flex-1 bg-stone-100 focus:bg-white text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-stone-200 focus:outline-hidden focus:border-[#E05A2B] transition-colors"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-[#E05A2B] hover:bg-[#c94b20] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-xs"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
