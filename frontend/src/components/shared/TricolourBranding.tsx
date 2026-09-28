import React from 'react';

export const VirasatLogoMark: React.FC<{ className?: string; size?: number }> = ({ className = 'w-9 h-9', size }) => (
  <img
    src="/virasat-logo.png"
    alt="VIRASAT Logo"
    style={size ? { width: size, height: size } : undefined}
    className={`${className} shrink-0 rounded-full object-cover select-none shadow-xs`}
  />
);

export const VirasatBrand: React.FC<{
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}> = ({ onClick, size = 'md', variant = 'light' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 text-left group select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`${
          isSm ? 'w-9 h-9' : isLg ? 'w-13 h-13' : 'w-11 h-11'
        } rounded-full bg-white border border-[#EFE8DF] shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden p-0.5 shrink-0`}
      >
        <img
          src="/virasat-logo.png"
          alt="VIRASAT Emblem"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif font-black tracking-tight leading-tight ${
              isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl'
            } ${variant === 'dark' ? 'text-white' : 'text-[#0B192C]'}`}
          >
            VIRASAT
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E05A2B]" />
        </div>
        <span
          className={`text-[9.5px] font-semibold tracking-wider uppercase ${
            variant === 'dark' ? 'text-amber-300/90' : 'text-stone-500'
          }`}
        >
          Explore • Preserve • Experience Bharat
        </span>
      </div>
    </div>
  );
};


export const TricolourTopBar: React.FC = () => (
  <div className="w-full h-[3px] bg-gradient-to-r from-[#FF9933] via-[#D97706] to-[#138808]" />
);

/**
 * Flowing 3D Tricolour Ribbon Wave SVG
 */
export const TricolourRibbonWave: React.FC<{ className?: string; flip?: boolean }> = ({ className = '', flip = false }) => (
  <div className={`w-full overflow-hidden pointer-events-none select-none ${flip ? 'scale-y-[-1]' : ''} ${className}`}>
    <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-12 sm:h-16 lg:h-20 opacity-90">
      <path
        d="M0,25 C320,65 520,5 820,38 C1120,72 1320,15 1440,32 L1440,48 C1320,31 1120,88 820,54 C520,21 320,81 0,41 Z"
        fill="url(#saffronWaveGrad)"
      />
      <path
        d="M0,40 C320,80 520,20 820,53 C1120,87 1320,30 1440,47 L1440,60 C1320,43 1120,100 820,66 C520,33 320,93 0,53 Z"
        fill="#FFFFFF"
        fillOpacity="0.85"
      />
      <path
        d="M0,52 C320,92 520,32 820,65 C1120,99 1320,42 1440,59 L1440,75 C1320,58 1120,115 820,81 C520,48 320,108 0,68 Z"
        fill="url(#greenWaveGrad)"
      />
      <defs>
        <linearGradient id="saffronWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF9933" />
          <stop offset="50%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#E05A2B" />
        </linearGradient>
        <linearGradient id="greenWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0D6E38" />
          <stop offset="50%" stopColor="#138808" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

/**
 * Architectural Monuments Skyline Silhouette SVG
 */
export const MonumentSkyline: React.FC<{ className?: string; opacity?: number }> = ({ className = '', opacity = 0.18 }) => (
  <svg
    viewBox="0 0 1200 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMax meet"
    className={`w-full pointer-events-none select-none ${className}`}
    style={{ opacity }}
  >
    {/* India Gate */}
    <g transform="translate(40, 20)">
      <rect x="10" y="30" width="10" height="90" fill="currentColor" />
      <rect x="60" y="30" width="10" height="90" fill="currentColor" />
      <rect x="0" y="20" width="80" height="15" fill="currentColor" />
      <path d="M20 120 L20 70 Q40 50 60 70 L60 120 Z" fill="none" stroke="currentColor" strokeWidth="4" />
      <rect x="15" y="5" width="50" height="15" fill="currentColor" />
    </g>

    {/* Taj Mahal Silhouette */}
    <g transform="translate(180, 0)">
      {/* Minarets */}
      <rect x="0" y="30" width="5" height="110" fill="currentColor" />
      <circle cx="2.5" cy="27" r="4" fill="currentColor" />
      <rect x="195" y="30" width="5" height="110" fill="currentColor" />
      <circle cx="197.5" cy="27" r="4" fill="currentColor" />
      {/* Base */}
      <rect x="30" y="70" width="140" height="70" fill="currentColor" />
      {/* Center Arch */}
      <path d="M80 140 L80 95 Q100 80 120 95 L120 140 Z" fill="#FAF8F5" />
      {/* Main Dome */}
      <path d="M75 70 C75 25, 125 25, 125 70 Z" fill="currentColor" />
      <path d="M100 5 L100 25" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="100" cy="5" r="2.5" fill="currentColor" />
      {/* Small Domes */}
      <path d="M50 70 C50 50, 70 50, 70 70 Z" fill="currentColor" />
      <path d="M130 70 C130 50, 150 50, 150 70 Z" fill="currentColor" />
    </g>

    {/* Sanchi Stupa */}
    <g transform="translate(420, 45)">
      <path d="M10 95 C10 40, 110 40, 110 95 Z" fill="currentColor" />
      <rect x="50" y="25" width="20" height="15" fill="currentColor" />
      <line x1="60" y1="5" x2="60" y2="25" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="60" cy="10" rx="12" ry="3" fill="currentColor" />
      <ellipse cx="60" cy="15" rx="8" ry="2.5" fill="currentColor" />
    </g>

    {/* Konark Sun Temple Wheel */}
    <g transform="translate(580, 40)">
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" fill="none" />
      <circle cx="50" cy="50" r="14" fill="currentColor" />
      {/* 8 Main Spokes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
        <line
          key={idx}
          x1="50"
          y1="50"
          x2={50 + 42 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 42 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="3.5"
        />
      ))}
    </g>

    {/* Red Fort Lahore Gate */}
    <g transform="translate(730, 20)">
      <rect x="0" y="50" width="160" height="70" fill="currentColor" />
      {/* Battlements */}
      {[0, 18, 36, 54, 72, 90, 108, 126, 144].map((x, i) => (
        <rect key={i} x={x} y="40" width="10" height="12" fill="currentColor" />
      ))}
      {/* Octagonal Towers */}
      <rect x="15" y="20" width="25" height="100" fill="currentColor" />
      <path d="M15 20 C15 5, 40 5, 40 20 Z" fill="currentColor" />
      <rect x="120" y="20" width="25" height="100" fill="currentColor" />
      <path d="M120 20 C120 5, 145 5, 145 20 Z" fill="currentColor" />
      {/* Arch */}
      <path d="M65 120 L65 75 Q80 60 95 75 L95 120 Z" fill="#FAF8F5" />
    </g>

    {/* Dravidian Temple Gopuram */}
    <g transform="translate(940, 10)">
      <polygon points="15,130 30,30 90,30 105,130" fill="currentColor" />
      {/* Tier lines */}
      <line x1="26" y1="50" x2="94" y2="50" stroke="#FAF8F5" strokeWidth="2.5" />
      <line x1="22" y1="70" x2="98" y2="70" stroke="#FAF8F5" strokeWidth="2.5" />
      <line x1="18" y1="95" x2="102" y2="95" stroke="#FAF8F5" strokeWidth="2.5" />
      {/* Kalash tops */}
      <rect x="35" y="20" width="50" height="10" rx="3" fill="currentColor" />
      {[42, 50, 60, 70, 78].map((x, i) => (
        <circle key={i} cx={x} cy="16" r="3" fill="currentColor" />
      ))}
      <path d="M50 130 L50 95 Q60 85 70 95 L70 130 Z" fill="#FAF8F5" />
    </g>

    {/* Ground base line */}
    <rect x="0" y="140" width="1200" height="10" fill="currentColor" />
  </svg>
);

/**
 * Stylized India Map Graphic with Saffron-White-Green Gradient
 */
export const IndiaMapGraphic: React.FC<{ className?: string }> = ({ className = 'w-48 h-56' }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 300 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="indiaMapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF9933" />
          <stop offset="48%" stopColor="#F59E0B" />
          <stop offset="52%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      {/* Simplified Stylized India Map Path */}
      <path
        d="M 125,18 
           C 140,8 160,8 175,22 
           C 188,35 195,50 180,68 
           C 195,78 220,70 235,85 
           C 250,100 270,110 280,130 
           C 285,145 270,160 250,155 
           C 230,150 215,160 200,175 
           C 210,195 215,220 205,245 
           C 195,270 170,300 150,335 
           C 135,305 115,270 100,240 
           C 85,215 75,190 70,165 
           C 60,150 45,140 35,130 
           C 25,120 40,105 60,110 
           C 75,115 90,95 105,75 
           C 115,60 115,35 125,18 Z"
        fill="url(#indiaMapGrad)"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Animated Pin at Heart of India */}
      <g transform="translate(145, 160)">
        <circle cx="0" cy="0" r="14" fill="#FFFFFF" fillOpacity="0.4" className="animate-ping" />
        <circle cx="0" cy="0" r="8" fill="#FFFFFF" />
        <circle cx="0" cy="0" r="4.5" fill="#E05A2B" />
      </g>
      {/* Subtle regional dots */}
      <circle cx="115" cy="85" r="3" fill="#FFFFFF" opacity="0.9" />
      <circle cx="185" cy="140" r="3" fill="#FFFFFF" opacity="0.9" />
      <circle cx="95" cy="180" r="3" fill="#FFFFFF" opacity="0.9" />
      <circle cx="140" cy="270" r="3" fill="#FFFFFF" opacity="0.9" />
      <circle cx="230" cy="120" r="3" fill="#FFFFFF" opacity="0.9" />
    </svg>
  </div>
);

/**
 * Reusable 4-item Stats Bar matching screenshot design
 */
export const StatsCounterBar: React.FC<{
  item1?: { count: string; label: string };
  item2?: { count: string; label: string };
  item3?: { count: string; label: string };
  item4?: { count: string; label: string };
  className?: string;
}> = ({
  item1 = { count: '1,200+', label: 'Verified Heritage Places' },
  item2 = { count: '36', label: 'States & UTs' },
  item3 = { count: '200+', label: 'Cultural Experiences' },
  item4 = { count: '100%', label: 'Authenticated Data' },
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 ${className}`}>
      {/* Stat 1 */}
      <div className="flex items-center gap-3.5 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l9 5H3l9-5z" />
          </svg>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif leading-tight">
            {item1.count}
          </div>
          <div className="text-xs font-medium text-stone-600">
            {item1.label}
          </div>
        </div>
      </div>

      {/* Stat 2 */}
      <div className="flex items-center gap-3.5 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif leading-tight">
            {item2.count}
          </div>
          <div className="text-xs font-medium text-stone-600">
            {item2.label}
          </div>
        </div>
      </div>

      {/* Stat 3 */}
      <div className="flex items-center gap-3.5 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200/60">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif leading-tight">
            {item3.count}
          </div>
          <div className="text-xs font-medium text-stone-600">
            {item3.label}
          </div>
        </div>
      </div>

      {/* Stat 4 */}
      <div className="flex items-center gap-3.5 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200/60">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif leading-tight">
            {item4.count}
          </div>
          <div className="text-xs font-medium text-stone-600">
            {item4.label}
          </div>
        </div>
      </div>
    </div>
  );
};

export const VerifiedBadge: React.FC<{ status?: string; className?: string }> = ({
  status = 'VERIFIED',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wider ${className}`}
    >
      <svg className="w-3 h-3 text-emerald-600 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>{status}</span>
    </span>
  );
};
