import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass, Landmark, Sparkles, Map, Bot, Search, Menu, X,
  Palette, Music, Calendar, BookOpen, Info, Navigation
} from 'lucide-react';
import { VirasatBrand, TricolourTopBar } from '../shared/TricolourBranding';

interface TopNavbarProps {
  onOpenSearch: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: Compass },
    { to: '/discover', label: 'Discover', icon: Sparkles },
    { to: '/heritage', label: 'Heritage', icon: Landmark },
    { to: '/festivals', label: 'Festivals', icon: Calendar },
    { to: '/arts-crafts', label: 'Arts & Crafts', icon: Palette },
    { to: '/performing-arts', label: 'Performing Arts', icon: Music },
    { to: '/experiences', label: 'Experiences', icon: Navigation },
    { to: '/map', label: 'Cultural Map', icon: Map },
    { to: '/itinerary', label: 'Itinerary', icon: BookOpen },
    { to: '/ai-guide', label: 'AI Guide', icon: Bot, isAi: true },
    { to: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE8DF] shadow-xs">
      <TricolourTopBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="shrink-0">
            <VirasatBrand />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs'
                      : link.isAi
                      ? 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/60'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${link.isAi ? 'text-indigo-600' : active ? 'text-amber-800' : 'text-stone-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Universal Search Trigger & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/90 text-stone-700 text-xs font-medium border border-stone-200 transition-colors shadow-2xs"
              title="Search across all Indian heritage, festivals, and crafts"
            >
              <Search className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Search Heritage...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-stone-300 rounded font-mono text-stone-500">
                Ctrl+K
              </kbd>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FFFDF9] border-b border-[#EFE8DF] px-4 pt-3 pb-5 space-y-1 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : link.isAi
                    ? 'text-indigo-700 bg-indigo-50 font-semibold'
                    : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${link.isAi ? 'text-indigo-600' : active ? 'text-amber-800' : 'text-stone-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
