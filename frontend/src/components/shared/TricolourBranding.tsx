import React from 'react';

export const VirasatLogoMark: React.FC<{ className?: string; size?: number }> = ({ className = 'w-9 h-9', size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={size ? { width: size, height: size } : undefined}
    className={`${className} shrink-0 select-none`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="virasatArchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF671F" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#046A38" />
      </linearGradient>
      <linearGradient id="goldKalash" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <path
      d="M24 4 L28 10 L38 15 L38 42 L10 42 L10 15 L20 10 Z"
      fill="url(#virasatArchGrad)"
    />
    <circle cx="24" cy="5" r="2.2" fill="url(#goldKalash)" />
    <path d="M24 2 L24 4.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="13" y="14" width="22" height="2.5" rx="1" fill="#FFFFFF" opacity="0.9" />
    <rect x="15" y="18" width="18" height="1.8" rx="0.8" fill="#FDE68A" opacity="0.95" />
    <path d="M17 42 L17 28 C17 23, 21 21, 24 21 C27 21, 31 23, 31 28 L31 42 Z" fill="#FFFFFF" />
    <path d="M19 42 L19 29 C19 25, 21.5 23.5, 24 23.5 C26.5 23.5, 29 25, 29 29 L29 42 Z" fill="#FAF8F5" />
    <circle cx="24" cy="30" r="3.2" stroke="#000080" strokeWidth="0.8" fill="none" opacity="0.85" />
    <circle cx="24" cy="30" r="0.8" fill="#000080" />
    <rect x="7" y="42" width="34" height="2.5" rx="1.2" fill="#046A38" />
  </svg>
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
      className={`flex items-center gap-2.5 text-left group select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`${
          isSm ? 'w-8 h-8' : isLg ? 'w-11 h-11' : 'w-10 h-10'
        } rounded-xl bg-white border border-[#EFE8DF] shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform p-1`}
      >
        <VirasatLogoMark className={isSm ? 'w-7 h-7' : isLg ? 'w-9 h-9' : 'w-8 h-8'} />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif font-bold tracking-tight leading-tight ${
              isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl'
            } ${variant === 'dark' ? 'text-white' : 'text-[#0B192C]'}`}
          >
            VIRASAT
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F]" />
        </div>
        <span
          className={`text-[10px] font-medium tracking-tight ${
            variant === 'dark' ? 'text-stone-300' : 'text-stone-500'
          }`}
        >
          Indian Cultural Heritage Platform
        </span>
      </div>
    </div>
  );
};

export const TricolourTopBar: React.FC = () => (
  <div className="w-full h-[3px] bg-gradient-to-r from-[#FF671F] via-[#D97706] to-[#046A38]" />
);
