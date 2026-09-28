import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { TopNavbar } from './components/layout/TopNavbar';
import { SimpleFooter } from './components/layout/SimpleFooter';
import { UniversalSearchModal } from './components/search/UniversalSearchModal';
import { ConnectedIntelligenceModal } from './components/cultural/ConnectedIntelligenceModal';

import { HomePage } from './pages/Home';
import { DiscoverPage } from './pages/Discover';
import { HeritagePage } from './pages/Heritage';
import { FestivalsPage } from './pages/Festivals';
import { ArtsCraftsPage } from './pages/ArtsCrafts';
import { PerformingArtsPage } from './pages/PerformingArts';
import { ExperiencesPage } from './pages/Experiences';
import { StoriesPage } from './pages/Stories';
import { CulturalMapPage } from './pages/CulturalMap';
import { AIGuidePage } from './pages/AIGuide';
import { ItineraryPage } from './pages/Itinerary';
import { AboutPage } from './pages/About';
import { SearchPage } from './pages/Search';
import { EntityDetailPage } from './pages/EntityDetailPage';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeRelatedRecord, setActiveRelatedRecord] = useState<{ type: string; id: string } | null>(null);

  const handleOpenSearch = () => setIsSearchOpen(true);
  const handleCloseSearch = () => setIsSearchOpen(false);

  const handleExploreRelated = (type: string, id: string) => {
    setActiveRelatedRecord({ type, id });
  };

  const handleCloseRelated = () => {
    setActiveRelatedRecord(null);
  };

  const handleSelectSearchResult = (type: string, id: string) => {
    setActiveRelatedRecord({ type, id });
  };

  const handleOpenAIChat = (prompt: string) => {
    navigate(`/ai-guide?prompt=${encodeURIComponent(prompt)}`);
  };

  // Section 5.2: Hide FAB on AI Guide page itself and on Cultural Map page to avoid covering map controls
  const isMapOrChat = location.pathname.startsWith('/ai-guide') ||
    location.pathname.startsWith('/cultural-map') ||
    location.pathname.startsWith('/map');

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#161616] overflow-x-hidden">
      {/* Top Navbar strictly conformed to Section 5.1 */}
      <TopNavbar onOpenSearch={handleOpenSearch} />

      {/* Main Content Area: Full width on Home, extra-wide for Cultural Map, boxed on other internal pages */}
      <main className={`flex-1 w-full ${
        location.pathname === '/'
          ? ''
          : location.pathname.startsWith('/cultural-map') ||
            location.pathname.startsWith('/map') ||
            location.pathname.startsWith('/arts-crafts')
          ? 'max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-12'
          : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12'
      }`}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenSearch={handleOpenSearch}
                onExploreRelated={handleExploreRelated}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />
          <Route
            path="/discover"
            element={
              <DiscoverPage
                onExploreRelated={handleExploreRelated}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />
          <Route
            path="/heritage"
            element={<HeritagePage onExploreRelated={handleExploreRelated} />}
          />
          <Route
            path="/heritage/:slug"
            element={
              <EntityDetailPage
                entityType="heritage"
                onExploreRelated={handleExploreRelated}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />
          <Route
            path="/festivals"
            element={<FestivalsPage onExploreRelated={handleExploreRelated} />}
          />
          <Route
            path="/festivals/:slug"
            element={
              <EntityDetailPage
                entityType="festival"
                onExploreRelated={handleExploreRelated}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />
          <Route
            path="/arts-crafts"
            element={<ArtsCraftsPage onExploreRelated={handleExploreRelated} />}
          />
          <Route
            path="/arts-crafts/:slug"
            element={
              <EntityDetailPage
                entityType="craft"
                onExploreRelated={handleExploreRelated}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />
          <Route
            path="/performing-arts"
            element={<PerformingArtsPage onExploreRelated={handleExploreRelated} />}
          />
          <Route
            path="/performing-arts/:slug"
            element={
              <EntityDetailPage
                entityType="performing_art"
                onExploreRelated={handleExploreRelated}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />
          <Route
            path="/experiences"
            element={<ExperiencesPage onExploreRelated={handleExploreRelated} />}
          />
          <Route
            path="/experiences/:id"
            element={
              <EntityDetailPage
                entityType="experience"
                onExploreRelated={handleExploreRelated}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />
          <Route
            path="/stories"
            element={<StoriesPage onExploreRelated={handleExploreRelated} />}
          />
          <Route
            path="/cultural-map"
            element={<CulturalMapPage onExploreRelated={handleExploreRelated} />}
          />
          {/* Alias /map to /cultural-map */}
          <Route
            path="/map"
            element={<Navigate to="/cultural-map" replace />}
          />
          <Route
            path="/itinerary"
            element={<ItineraryPage onExploreRelated={handleExploreRelated} />}
          />
          <Route path="/ai-guide" element={<AIGuidePage />} />
          <Route
            path="/search"
            element={
              <SearchPage
                onExploreRelated={handleExploreRelated}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="*"
            element={
              <HomePage
                onOpenSearch={handleOpenSearch}
                onExploreRelated={handleExploreRelated}
                onOpenAIChat={handleOpenAIChat}
              />
            }
          />
        </Routes>
      </main>

      {/* Persistent Floating Action Button (FAB) for AI Guide (Matches Reference Design) */}
      {!isMapOrChat && (
        <Link
          to="/ai-guide"
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 pl-2 pr-3.5 py-2 bg-[#138808] hover:bg-[#0F6D07] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group border-2 border-white/90 select-none"
          title="Ask VIRASAT AI Cultural Guide"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden bg-white p-0.5 shadow-2xs shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
            <img src="/virasat-logo.png" alt="VIRASAT" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="text-xs font-bold tracking-tight">Ask VIRASAT AI</span>
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 via-amber-300 to-rose-400 p-0.5 flex items-center justify-center shrink-0">
            <Sparkles className="w-2.5 h-2.5 text-white fill-white" />
          </div>
        </Link>
      )}

      {/* Shared Footer */}
      <SimpleFooter />

      {/* Global Modals */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        onSelectResult={handleSelectSearchResult}
      />

      <ConnectedIntelligenceModal
        isOpen={Boolean(activeRelatedRecord)}
        recordType={activeRelatedRecord?.type || null}
        recordId={activeRelatedRecord?.id || null}
        onClose={handleCloseRelated}
        onSelectNode={(type, id) => setActiveRelatedRecord({ type, id })}
        onOpenAIChat={handleOpenAIChat}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
