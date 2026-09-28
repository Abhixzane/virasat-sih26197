import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass, Landmark, Sparkles, Map, Search, Menu, X,
  Palette, Calendar, Info, MapPin, Home as HomeIcon
} from 'lucide-react';

interface TopNavbarProps {
  onOpenSearch: () => void;
}

/**
 * Authentic 3-petal Indian Lotus Flower Icon for Festivals & Rituals
 */
const LotusIcon: React.FC<{ className?: string }> = ({ className = 'w-4.5 h-4.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Central tall petal */}
    <path d="M12 3.5C10 7.5 10 13 12 18.5C14 13 14 7.5 12 3.5Z" />
    {/* Left sweeping petal */}
    <path d="M11 9C7.5 8 3.5 11 4 15.5C5.5 17.5 9 18 11.5 17.5" />
    {/* Right sweeping petal */}
    <path d="M13 9C16 9 20.5 11 20 15.5C18.5 17.5 15 18 12.5 17.5" />
    {/* Base support curve */}
    <path d="M8 19C10.5 20.2 13.5 20.2 16 19" />
  </svg>
);

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Exactly the 8 core exploratory tabs matching the reference navigation design
  const navTabs = [
    { to: '/', label: 'Home', icon: HomeIcon, isHome: true },
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/heritage', label: 'Heritage', icon: Landmark },
    { to: '/festivals', label: 'Festivals', icon: LotusIcon },
    { to: '/arts-crafts', label: 'Arts & Crafts', icon: Palette },
    { to: '/experiences', label: 'Experiences', icon: MapPin },
    { to: '/cultural-map', label: 'Cultural Map', icon: Map },
    { to: '/itinerary', label: 'Itinerary', icon: Calendar },
  ];

  // Mobile menu items
  const mobileNavItems = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/heritage', label: 'Heritage', icon: Landmark },
    { to: '/festivals', label: 'Festivals', icon: LotusIcon },
    { to: '/arts-crafts', label: 'Arts & Crafts', icon: Palette },
    { to: '/experiences', label: 'Experiences', icon: MapPin },
    { to: '/cultural-map', label: 'Cultural Map', icon: Map },
    { to: '/itinerary', label: 'Itinerary', icon: Calendar },
    { to: '/ai-guide', label: 'Ask VIRASAT (AI Guide)', icon: Sparkles, isSpecial: true },
    { to: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && (location.pathname === path || location.pathname.startsWith(`${path}/`))) return true;
    if (path === '/cultural-map' && location.pathname === '/map') return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/80 shadow-xs relative">
      {/* 1. Tricolour Top Accent Bar: Saffron on the left (spanning ~66%), Green on the right */}
      <div
        className="w-full h-[3.5px]"
        style={{
          background: 'linear-gradient(90deg, #FF6600 0%, #FF6600 66%, #138808 66%, #138808 100%)',
        }}
      />

      {/* Decorative Tricolour Left Ribbon Wave (matches image flanks) */}
      <div className="absolute left-0 top-[3.5px] bottom-0 w-24 pointer-events-none overflow-hidden hidden 2xl:block select-none z-0">
        <svg viewBox="0 0 100 70" fill="none" preserveAspectRatio="none" className="w-full h-full opacity-60">
          <path d="M0,0 C35,12 45,45 0,70 L0,0 Z" fill="#FF6600" fillOpacity="0.8" />
          <path d="M0,24 C38,36 32,64 0,70 L0,24 Z" fill="#FFFFFF" fillOpacity="0.8" />
          <path d="M0,28 C42,42 36,68 0,70 L0,28 Z" fill="#138808" fillOpacity="0.85" />
        </svg>
      </div>

      {/* Decorative Tricolour Right Ribbon Wave (matches image flanks) */}
      <div className="absolute right-0 top-[3.5px] bottom-0 w-24 pointer-events-none overflow-hidden hidden 2xl:block select-none z-0">
        <svg viewBox="0 0 100 70" fill="none" preserveAspectRatio="none" className="w-full h-full opacity-60">
          <path d="M100,0 C65,12 55,45 100,70 L100,0 Z" fill="#138808" fillOpacity="0.8" />
          <path d="M100,24 C62,36 68,64 100,70 L100,24 Z" fill="#FFFFFF" fillOpacity="0.8" />
          <path d="M100,28 C58,42 64,68 100,70 L100,28 Z" fill="#FF6600" fillOpacity="0.85" />
        </svg>
      </div>

      {/* Main Navbar Bar Content Container */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-[72px] gap-2 lg:gap-3 xl:gap-5">
          
          {/* 1. Left Brand & Emblem Logo */}
          <Link to="/" className="shrink-0 flex items-center gap-3 group select-none pr-1">
            <div className="w-11 h-11 rounded-full bg-white border border-[#E8DFD5] shadow-xs flex items-center justify-center overflow-hidden p-0.5 group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/virasat-logo.png"
                alt="VIRASAT Emblem"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-serif font-black tracking-wide text-[21px] sm:text-[23px] text-[#1A1A1A] leading-none">
                  VIRASAT
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FF6600] inline-block ml-1 self-center" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-normal text-stone-500 tracking-tight leading-tight mt-0.5 whitespace-nowrap">
                Indian Cultural Heritage Platform
              </span>
            </div>
          </Link>

          {/* 2. Center Navigation Tabs (Vertical Stack: Icon on top, Label below) */}
          <nav className="hidden lg:flex items-center justify-center gap-1.5 xl:gap-2.5 flex-1 py-1">
            {navTabs.map((tab) => {
              const active = isActive(tab.to);
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`relative flex flex-col items-center justify-center transition-all duration-150 group select-none ${
                    active
                      ? 'bg-[#FFF2E5] text-[#FF6600] font-semibold px-3 xl:px-4 py-1.5 rounded-2xl'
                      : 'text-stone-700 hover:text-[#FF6600] hover:bg-stone-50/80 px-2.5 xl:px-3 py-1.5 rounded-2xl'
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] transition-transform group-hover:scale-110 ${
                      active
                        ? tab.isHome
                          ? 'fill-current text-[#FF6600]'
                          : 'text-[#FF6600]'
                        : 'text-stone-700 group-hover:text-[#FF6600]'
                    }`}
                  />
                  <span
                    className={`text-[11.5px] tracking-tight whitespace-nowrap mt-1 ${
                      active ? 'text-[#FF6600] font-semibold' : 'text-stone-700 group-hover:text-[#FF6600] font-medium'
                    }`}
                  >
                    {tab.label}
                  </span>

                  {/* Active Orange Underline Indicator along bottom */}
                  {active && (
                    <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-[#FF6600] rounded-full animate-fadeIn" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Cluster: Vertical Divider + Search + Ask VIRASAT + About */}
          <div className="flex items-center gap-2 sm:gap-2.5 xl:gap-3.5 shrink-0">
            {/* Subtle Vertical Divider */}
            <div className="hidden lg:block h-7 w-[1px] bg-stone-200/90 mx-0.5 shrink-0" />

            {/* Global Search Pill Input */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#F3F4F6] hover:bg-stone-200/70 border border-stone-200/60 text-stone-400 text-xs w-32 sm:w-36 lg:w-36 xl:w-44 transition-all group"
              title="Search heritage places, monuments, crafts... (Press / or Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors shrink-0" />
              <span className="text-stone-400 text-xs font-normal truncate">Search...</span>
            </button>

            {/* "Ask VIRASAT" Pill Button */}
            <Link
              to="/ai-guide"
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#FF6600] hover:bg-[#E65100] text-white text-xs font-semibold tracking-tight shadow-xs hover:shadow transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white text-white shrink-0" />
              <span className="whitespace-nowrap">Ask VIRASAT</span>
            </Link>

            {/* "About" Link with Info Icon */}
            <Link
              to="/about"
              className="hidden sm:flex items-center gap-1 text-xs font-medium text-stone-700 hover:text-[#1A1A1A] transition-colors px-1 py-1.5 shrink-0"
            >
              <Info className="w-4 h-4 text-stone-600 shrink-0" />
              <span className="font-semibold text-stone-700">About</span>
            </Link>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 focus:outline-none shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-1 shadow-lg animate-fadeIn">
          <div className="px-3 py-1 mb-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Explore Cultural Heritage
          </div>
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#FFF2E5] text-[#FF6600] font-semibold border border-[#FFD0A6]'
                    : item.isSpecial
                    ? 'bg-[#FFF2E5] text-[#FF6600] font-semibold border border-[#FFB27A]'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    active ? 'text-[#FF6600]' : item.isSpecial ? 'text-[#FF6600]' : 'text-stone-500'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
