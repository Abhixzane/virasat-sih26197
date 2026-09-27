import React from 'react';
import { Link } from 'react-router-dom';
import { VirasatBrand } from '../shared/TricolourBranding';
import { ShieldCheck, Heart, Landmark, Sparkles, MapPin } from 'lucide-react';

export const SimpleFooter: React.FC = () => {
  return (
    <footer className="bg-[#1C1917] text-stone-300 border-t border-stone-800 pt-12 pb-8 mt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {/* Col 1: Branding & Mission */}
          <div className="space-y-4 md:col-span-1">
            <VirasatBrand variant="dark" />
            <p className="text-xs text-stone-400 leading-relaxed">
              India's Living Cultural Heritage Discovery Platform. Built for SIH26197 with
              Connected Cultural Intelligence, uniting verified historical monuments, festivals,
              artisan traditions, and oral folklore.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 font-medium bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-900/60">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Grounded Archaeological Data</span>
            </div>
          </div>

          {/* Col 2: Exploration Links */}
          <div className="space-y-2.5 text-xs">
            <div className="text-stone-100 font-semibold tracking-wide uppercase text-[11px]">Cultural Discoveries</div>
            <ul className="space-y-1.5 text-stone-400">
              <li><Link to="/heritage" className="hover:text-amber-400 transition-colors">UNESCO & ASI Monuments</Link></li>
              <li><Link to="/festivals" className="hover:text-amber-400 transition-colors">Festivals & Living Traditions</Link></li>
              <li><Link to="/arts-crafts" className="hover:text-amber-400 transition-colors">GI Traditional Arts & Crafts</Link></li>
              <li><Link to="/performing-arts" className="hover:text-amber-400 transition-colors">Folk & Classical Performing Arts</Link></li>
              <li><Link to="/experiences" className="hover:text-amber-400 transition-colors">Artisan Walks & Rituals</Link></li>
            </ul>
          </div>

          {/* Col 3: Interactive Tools */}
          <div className="space-y-2.5 text-xs">
            <div className="text-stone-100 font-semibold tracking-wide uppercase text-[11px]">AI & Digital Tools</div>
            <ul className="space-y-1.5 text-stone-400">
              <li><Link to="/ai-guide" className="hover:text-amber-400 transition-colors">VIRASAT AI Cultural Guide</Link></li>
              <li><Link to="/map" className="hover:text-amber-400 transition-colors">Interactive Geographic Map</Link></li>
              <li><Link to="/itinerary" className="hover:text-amber-400 transition-colors">Cultural Itinerary Generator</Link></li>
              <li><Link to="/discover" className="hover:text-amber-400 transition-colors">Connected Cultural Intelligence</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">Architectural Integrity & Sources</Link></li>
            </ul>
          </div>

          {/* Col 4: Verified Sources */}
          <div className="space-y-2.5 text-xs">
            <div className="text-stone-100 font-semibold tracking-wide uppercase text-[11px]">Verified Provenance</div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              All coordinates, dates, and historical records are strictly sourced from official repositories including the Archaeological Survey of India (ASI), Ministry of Culture, and State Tourism Portals.
            </p>
            <div className="text-[11px] text-stone-500 pt-1">
              No fabricated records, synthetic government stamps, or unverified claims.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div>
            © {new Date().getFullYear()} VIRASAT. Smart India Hackathon (SIH26197). All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Preserving India's Heritage with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline mx-0.5" />
            <span>and Archaeological Rigor</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
