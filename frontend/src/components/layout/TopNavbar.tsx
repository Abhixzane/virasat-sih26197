import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass, Landmark, Sparkles, Map, Search, Menu, X,
  Palette, Calendar, MapPin, Home as HomeIcon, User as UserIcon,
  LogOut, Bookmark, ChevronDown, Check, ShieldCheck, Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';

interface TopNavbarProps {
  onOpenSearch: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenSearch }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 8 exploratory tabs matching the reference navigation design
  const navTabs = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/heritage', label: 'Heritage', icon: Landmark },
    { to: '/festivals', label: 'Festivals', icon: Calendar },
    { to: '/arts-crafts', label: 'Arts & Crafts', icon: Palette },
    { to: '/experiences', label: 'Experiences', icon: MapPin },
    { to: '/cultural-map', label: 'Cultural Map', icon: Map },
    { to: '/itinerary', label: 'Itinerary', icon: Calendar },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && (location.pathname === path || location.pathname.startsWith(`${path}/`))) return true;
    if (path === '/cultural-map' && location.pathname === '/map') return true;
    return false;
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  // Google multicolor SVG logo for small badges
  const GoogleMiniIcon = () => (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
    </svg>
  );

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

          {/* 3. Right Cluster: Search Input Pill + Google Auth Profile Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Global Search Pill Input */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center justify-between px-3.5 py-2 rounded-full bg-[#F3F4F6] hover:bg-stone-200/80 border border-stone-200/70 text-stone-400 text-xs w-44 sm:w-56 lg:w-56 xl:w-72 transition-all group cursor-pointer"
              title="Search destinations, festivals, crafts..."
            >
              <span className="text-stone-500 text-xs font-normal truncate">Search destinations, festivals, crafts...</span>
              <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors shrink-0 ml-2" />
            </button>

            {/* Authentication Button & Profile Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 shadow-2xs transition-all group cursor-pointer"
                  title="Your Explorer Profile"
                >
                  {/* User Profile Avatar */}
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-[#E05A2B] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=e05a2b`;
                        }}
                      />
                    ) : (
                      user.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-left">
                    <span className="text-xs font-bold text-stone-800 max-w-[85px] sm:max-w-[120px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    {user.provider === 'google' && (
                      <span className="hidden sm:inline-block">
                        <GoogleMiniIcon />
                      </span>
                    )}
                    <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-600 transition-transform" />
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-stone-200 shadow-xl p-3 z-50 animate-fadeIn space-y-2">
                    {/* User Info Header */}
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 truncate block">{user.name}</span>
                        {user.provider === 'google' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            <GoogleMiniIcon />
                            <span>Google</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full">
                            Explorer
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 truncate block">{user.email}</span>
                    </div>

                    {/* Navigation Shortcuts */}
                    <div className="space-y-1 pt-1">
                      <button
                        onClick={() => { setProfileDropdownOpen(false); navigate('/itinerary'); }}
                        className="w-full px-3 py-2 text-xs font-medium text-stone-700 hover:text-[#E05A2B] hover:bg-orange-50/70 rounded-xl transition-colors flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-[#E05A2B]" />
                          <span>Saved Itinerary Circuits</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600">
                          {user.saved_itineraries?.length || 0}
                        </span>
                      </button>

                      <button
                        onClick={() => { setProfileDropdownOpen(false); navigate('/cultural-map'); }}
                        className="w-full px-3 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors flex items-center gap-2 text-left"
                      >
                        <Map className="w-3.5 h-3.5 text-amber-700" />
                        <span>Pan-India Cultural Map</span>
                      </button>

                      <button
                        onClick={() => { setProfileDropdownOpen(false); navigate('/experiences'); }}
                        className="w-full px-3 py-2 text-xs font-medium text-stone-700 hover:text-emerald-800 hover:bg-emerald-50/70 rounded-xl transition-colors flex items-center gap-2 text-left"
                      >
                        <Compass className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Living Experiences</span>
                      </button>
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-2 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of VIRASAT</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Signed Out State: Prominent Google Sign-In Pill */
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signin')}
                  className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold tracking-tight border border-stone-300 shadow-2xs hover:shadow transition-all shrink-0 cursor-pointer"
                  title="Sign in with Google"
                >
                  <GoogleMiniIcon />
                  <span className="whitespace-nowrap">Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="hidden sm:flex items-center gap-1 px-3.5 py-2 rounded-full bg-[#FF6600] hover:bg-[#E65100] text-white text-xs font-semibold tracking-tight shadow-xs hover:shadow transition-all shrink-0 cursor-pointer"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}

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
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          
          {/* Mobile Auth Status */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 mb-2">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-[#E05A2B] text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{user.name}</div>
                    <div className="text-[10px] text-stone-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="text-xs font-semibold text-red-600 p-1.5 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAuth('signin')}
                  className="flex-1 py-2 px-3 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-800 flex items-center justify-center gap-2 shadow-2xs"
                >
                  <GoogleMiniIcon />
                  <span>Google Sign In</span>
                </button>
                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#FF6600] text-white text-xs font-bold shadow-2xs"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          <div className="px-3 py-1 text-xs font-semibold text-stone-500 uppercase tracking-wider">
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

      {/* Global Google & Email Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </header>
  );
};
