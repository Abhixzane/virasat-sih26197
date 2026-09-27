import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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

const AppContent: React.FC = () => {
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#0B192C]">
      {/* Top Navbar */}
      <TopNavbar onOpenSearch={handleOpenSearch} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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
            path="/festivals"
            element={<FestivalsPage onExploreRelated={handleExploreRelated} />}
          />
          <Route
            path="/arts-crafts"
            element={<ArtsCraftsPage onExploreRelated={handleExploreRelated} />}
          />
          <Route
            path="/performing-arts"
            element={<PerformingArtsPage onExploreRelated={handleExploreRelated} />}
          />
          <Route
            path="/experiences"
            element={<ExperiencesPage onExploreRelated={handleExploreRelated} />}
          />
          <Route
            path="/stories"
            element={<StoriesPage onExploreRelated={handleExploreRelated} />}
          />
          <Route
            path="/map"
            element={<CulturalMapPage onExploreRelated={handleExploreRelated} />}
          />
          <Route path="/ai-guide" element={<AIGuidePage />} />
          <Route
            path="/itinerary"
            element={<ItineraryPage onExploreRelated={handleExploreRelated} />}
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

      {/* Simple Footer */}
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
