import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram, Youtube, Twitter, Facebook, ArrowRight, Check
} from 'lucide-react';
import {
  VirasatBrand, TricolourRibbonWave, MonumentSkyline
} from '../shared/TricolourBranding';

export const SimpleFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-[#FFFDF9] border-t border-stone-200 mt-16 select-none overflow-hidden">
      {/* Top Monument Silhouette & Tricolour Ribbon Border matching screenshot */}
      <div className="relative pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 opacity-20 text-[#D4AF37] pointer-events-none">
          <MonumentSkyline opacity={0.25} />
        </div>
        <TricolourRibbonWave className="-mt-8" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-stone-200">
          {/* Column 1: Logo & Mission (3.5 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <VirasatBrand />
            </Link>
            <p className="text-xs text-stone-600 italic leading-relaxed max-w-sm">
              "Preserving our heritage today, for a culturally enriched tomorrow."
            </p>

            {/* Social Icons matching screenshot */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:text-[#E05A2B] hover:border-[#E05A2B] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:text-[#E05A2B] hover:border-[#E05A2B] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:text-[#E05A2B] hover:border-[#E05A2B] transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:text-[#E05A2B] hover:border-[#E05A2B] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Explore (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 font-serif tracking-wider uppercase">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link to="/" className="hover:text-[#E05A2B] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/discover" className="hover:text-[#E05A2B] transition-colors">
                  Discover India
                </Link>
              </li>
              <li>
                <Link to="/heritage" className="hover:text-[#E05A2B] transition-colors">
                  Heritage Places
                </Link>
              </li>
              <li>
                <Link to="/festivals" className="hover:text-[#E05A2B] transition-colors">
                  Festivals & Traditions
                </Link>
              </li>
              <li>
                <Link to="/arts-crafts" className="hover:text-[#E05A2B] transition-colors">
                  Arts & Crafts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: More (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 font-serif tracking-wider uppercase">
              More
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link to="/performing-arts" className="hover:text-[#E05A2B] transition-colors">
                  Performing Arts
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-[#E05A2B] transition-colors">
                  Cultural Experiences
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-[#E05A2B] transition-colors">
                  Cultural Map
                </Link>
              </li>
              <li>
                <Link to="/itinerary" className="hover:text-[#E05A2B] transition-colors">
                  Itinerary Planner
                </Link>
              </li>
              <li>
                <Link to="/ai-guide" className="hover:text-[#E05A2B] transition-colors">
                  AI Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: About (1.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 font-serif tracking-wider uppercase">
              About
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link to="/about" className="hover:text-[#E05A2B] transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E05A2B] transition-colors">
                  Data Sources
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E05A2B] transition-colors">
                  Contributors
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E05A2B] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E05A2B] transition-colors">
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Stay Connected (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 font-serif tracking-wider uppercase">
              Stay Connected
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Get updates on new heritage places, stories and features.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-200 outline-none focus:border-[#E05A2B] shadow-2xs font-medium"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-[#E05A2B] hover:bg-[#D04E20] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Rights Note */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <div>
            © {new Date().getFullYear()} VIRASAT. Smart India Hackathon (SIH26197). All rights reserved.
          </div>
          <div>
            Grounded in ASI, Ministry of Culture, and GI Registry Records.
          </div>
        </div>
      </div>
    </footer>
  );
};
