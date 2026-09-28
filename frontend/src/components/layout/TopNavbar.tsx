import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass, Landmark, Sparkles, Map, Search, Menu, X,
  Palette, Calendar, MapPin, Home as HomeIcon, User, Check
} from 'lucide-react';
import { userMemoryService } from '../../services/userMemory';

interface TopNavbarProps {
  onOpenSearch: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem('virasat_user_name') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const location = useLocation();

  // Exactly the 8 exploratory tabs matching the reference navigation design
  const navTabs = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/heritage', label: 'Heritage', icon: Landmark },
    { to: '/festivals', label: 'Festivals', icon: Calendar },
    { to: '/arts-crafts', label: 'Arts & Crafts', icon: Palette },
    { to: '/experiences', label: 'Experiences', icon: Sparkles },
    { to: '/cultural-map', label: 'Cultural Map', icon: Map },
    { to: '/itinerary', label: 'Itinerary', icon: Calendar },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && (location.pathname === path || location.pathname.startsWith(`${path}/`))) return true;
    if (path === '/cultural-map' && location.pathname === '/map') return true;
    return false;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('virasat_user_name', userName.trim());
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setAuthModalOpen(false);
      }, 1200);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-2xs select-none">
      {/* Main Navbar Content Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] gap-2 lg:gap-4">
          
          {/* 1. Left Brand & Emblem Logo */}
          <Link to="/" className="shrink-0 flex items-center gap-2.5 group select-none pr-1">
            <div className="w-10 h-10 rounded-full bg-white border border-stone-200 shadow-2xs flex items-center justify-center overflow-hidden p-0.5 group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/virasat-logo.png"
                alt="VIRASAT Emblem"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-sans font-bold tracking-tight text-[20px] text-stone-900 leading-none">
                  VIRASAT
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600] inline-block ml-1 self-center" />
              </div>
              <span className="text-[10px] font-normal text-stone-500 tracking-tight leading-tight mt-0.5 whitespace-nowrap">
                Indian Cultural Heritage Platform
              </span>
            </div>
          </Link>

          {/* 2. Center Navigation Tabs (Vertical Stack: Icon on top, Label below) */}
          <nav className="hidden lg:flex items-center justify-center gap-1.5 xl:gap-3 flex-1 py-1">
            {navTabs.map((tab) => {
              const active = isActive(tab.to);
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`relative flex flex-col items-center justify-center px-2.5 xl:px-3.5 py-1 transition-all duration-150 group select-none ${
                    active
                      ? 'text-[#FF6600] font-semibold'
                      : 'text-stone-600 hover:text-[#FF6600]'
                  }`}
                >
                  <Icon
                    className={`w-[17px] h-[17px] transition-transform group-hover:scale-110 ${
                      active
                        ? 'text-[#FF6600]'
                        : 'text-stone-600 group-hover:text-[#FF6600]'
                    }`}
                  />
                  <span
                    className={`text-[11.5px] tracking-tight whitespace-nowrap mt-1 ${
                      active ? 'text-[#FF6600] font-semibold' : 'text-stone-600 group-hover:text-[#FF6600] font-normal'
                    }`}
                  >
                    {tab.label}
                  </span>

                  {/* Active Orange Underline Indicator */}
                  {active && (
                    <span className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#FF6600] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Cluster: Search Input Pill + Sign In Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Global Search Pill Input matching screenshot */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center justify-between px-3.5 py-2 rounded-full bg-[#F3F4F6] hover:bg-stone-200/80 border border-stone-200/70 text-stone-400 text-xs w-48 sm:w-56 lg:w-60 xl:w-72 transition-all group cursor-pointer"
              title="Search destinations, festivals, crafts..."
            >
              <span className="text-stone-500 text-xs font-normal truncate">Search destinations, festivals, crafts...</span>
              <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors shrink-0 ml-2" />
            </button>

            {/* "Sign In" Pill Button matching screenshot */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF6600] hover:bg-[#E65100] text-white text-xs font-semibold tracking-tight shadow-xs hover:shadow transition-all shrink-0 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="whitespace-nowrap">{userName ? userName.split(' ')[0] : 'Sign In'}</span>
            </button>

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
          {navTabs.map((item) => {
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
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    active ? 'text-[#FF6600]' : 'text-stone-500'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Sign In / Cultural Explorer Profile Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FFF2E5] text-[#FF6600] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 font-sans">Cultural Explorer Profile</h3>
                <p className="text-xs text-stone-500">Sign in to save your heritage itineraries and preferences</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Abhi Sinha"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#FF6600] outline-none"
                  required
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-600 space-y-1">
                <div className="font-semibold text-stone-800">Grounded Companion Preferences</div>
                <div className="text-[11px] text-stone-500">
                  Your home city, budget tier, and dietary preferences are securely stored locally in your browser session.
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#FF6600] hover:bg-[#E65100] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Saved Successfully!</span>
                  </>
                ) : (
                  <span>Save & Continue</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
