import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass, Landmark, Sparkles, Map, Bot, Search, Menu, X,
  Palette, Music, Calendar, BookOpen, Info, Navigation, Home as HomeIcon
} from 'lucide-react';
import { VirasatBrand, TricolourTopBar } from '../shared/TricolourBranding';

interface TopNavbarProps {
  onOpenSearch: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/discover', label: 'Discover', icon: Compass },
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
        <div className="flex items-center justify-between h-16 gap-3">
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
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-all ${
                    active
                      ? 'bg-[#FFF8EE] text-[#C85A32] border border-[#FCD34D]/80 shadow-2xs font-semibold'
                      : link.isAi
                      ? 'text-sky-800 bg-sky-50/90 hover:bg-sky-100 border border-sky-200/80 font-semibold'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-50'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      link.isAi
                        ? 'text-sky-600'
                        : active
                        ? 'text-[#C85A32]'
                        : 'text-stone-500'
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Search Input Box */}
          <div className="flex items-center gap-2">
            <div
              onClick={onOpenSearch}
              className="cursor-pointer flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-500 border border-stone-200/80 text-xs w-40 sm:w-52 transition-all shadow-2xs"
              title="Search heritage places, monuments, crafts..."
            >
              <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">Search heritage places...</span>
            </div>

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
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : link.isAi
                    ? 'text-sky-800 bg-sky-50 font-semibold'
                    : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    link.isAi ? 'text-sky-600' : active ? 'text-amber-800' : 'text-stone-500'
                  }`}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
