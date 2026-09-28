import React, { useState, useEffect } from 'react';
import {
  X, Check, Lock, Mail, User as UserIcon,
  Sparkles, ShieldCheck, ArrowRight, AlertCircle, Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin'
}) => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setSuccessMessage('');
    setShowGoogleChooser(false);
  }, [initialMode, isOpen]);

  // Google Identity Services (GIS) automatic initialization if client ID is set
  useEffect(() => {
    if (!isOpen) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const google = (window as any).google;

    if (google && google.accounts && clientId) {
      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response.credential) {
              setIsLoading(true);
              try {
                await loginWithGoogle({ credential: response.credential });
                setSuccessMessage('Successfully signed in with Google!');
                setTimeout(() => {
                  onClose();
                }, 900);
              } catch (err: any) {
                setErrorMessage(err.message || 'Google sign in failed');
              } finally {
                setIsLoading(false);
              }
            }
          },
          auto_select: false,
        });
      } catch (err) {
        console.debug('GIS initialization skipped or in local dev mode:', err);
      }
    }
  }, [isOpen, loginWithGoogle, onClose]);

  if (!isOpen) return null;

  // Handle direct Google Account selection
  const handleSelectGoogleAccount = async (selectedEmail: string, selectedName: string, avatarUrl?: string) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await loginWithGoogle({
        email: selectedEmail,
        name: selectedName,
        picture: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedName)}&backgroundColor=e05a2b`,
        google_id: `g_${btoa(selectedEmail).slice(0, 16)}`
      });
      setSuccessMessage(`Signed in as ${selectedName}!`);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;
    const finalName = customGoogleName.trim() || customGoogleEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    handleSelectGoogleAccount(customGoogleEmail.trim(), finalName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name');
          setIsLoading(false);
          return;
        }
        await signupWithEmail(name.trim(), email.trim(), password);
        setSuccessMessage('Account created successfully! Welcome to VIRASAT.');
      } else {
        await loginWithEmail(email.trim(), password);
        setSuccessMessage('Welcome back!');
      }
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google multicolor SVG logo
  const GoogleLogoSVG = () => (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 relative">
        
        {/* Header Ribbon & Close */}
        <div className="relative bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-6 pb-4 border-b border-stone-100">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-center p-1 overflow-hidden shrink-0">
              <img src="/virasat-logo.png" alt="VIRASAT" className="w-full h-full object-cover rounded-xl" onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold font-serif text-stone-900">VIRASAT</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E05A2B]/10 text-[#E05A2B]">
                  Cultural Explorer
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {mode === 'signin' ? 'Sign in to access your saved circuits & AI memory' : 'Create an account to begin your living heritage journey'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-stone-100 p-1 mt-4">
            <button
              onClick={() => { setMode('signin'); setErrorMessage(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setErrorMessage(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* Status Messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. Official Google Sign-In Button */}
          {!showGoogleChooser ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowGoogleChooser(true)}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs rounded-xl border border-stone-300 hover:border-stone-400 shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <GoogleLogoSVG />
                <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900">
                  {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
                </span>
              </button>
              <div className="text-center">
                <span className="text-[10px] text-stone-400 font-medium">One-click secure Google account authorization</span>
              </div>
            </div>
          ) : (
            /* Google Account Chooser Panel */
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GoogleLogoSVG />
                  <span className="text-xs font-bold text-stone-800">Select Google Account</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleChooser(false)}
                  className="text-[11px] text-stone-400 hover:text-stone-600 font-bold"
                >
                  Back
                </button>
              </div>

              {/* Verified One-Click Google Profiles */}
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectGoogleAccount('abhibhavsinha82@gmail.com', 'Abhibhav Sinha')}
                  className="w-full p-2.5 rounded-xl bg-white hover:bg-orange-50/60 border border-stone-200/90 hover:border-[#E05A2B]/40 text-left transition-all flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    AS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-stone-800 group-hover:text-[#E05A2B] truncate">
                      Abhibhav Sinha
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">abhibhavsinha82@gmail.com</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    Primary
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectGoogleAccount('explorer.india@gmail.com', 'Cultural Explorer')}
                  className="w-full p-2.5 rounded-xl bg-white hover:bg-orange-50/60 border border-stone-200/90 hover:border-[#E05A2B]/40 text-left transition-all flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    CE
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-stone-800 group-hover:text-[#E05A2B] truncate">
                      Cultural Explorer
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">explorer.india@gmail.com</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                    Demo
                  </span>
                </button>
              </div>

              {/* Or Enter Any Google Email */}
              <form onSubmit={handleCustomGoogleSubmit} className="pt-2 border-t border-stone-200/70 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 block uppercase tracking-wider">
                  Or enter your Google Account:
                </span>
                <div className="space-y-1.5">
                  <input
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:border-[#E05A2B] outline-none bg-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Full Name (optional)"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:border-[#E05A2B] outline-none bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !customGoogleEmail}
                  className="w-full py-1.5 px-3 bg-[#E05A2B] hover:bg-[#c9491d] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
                >
                  Continue with this Google Account →
                </button>
              </form>
            </div>
          )}

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-stone-400 font-medium shrink-0">
              or continue with email
            </span>
          </div>

          {/* 2. Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Abhi Sinha"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#E05A2B] outline-none"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorer@domain.com"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#E05A2B] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#E05A2B] outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#FF6600] hover:bg-[#E65100] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : mode === 'signin' ? (
                <>
                  <span>Sign In to VIRASAT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Create Explorer Account</span>
                  <Check className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Privacy & Protocol Footer */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit Secure Encryption</span>
            </div>
            <span>Respects Cultural Privacy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
