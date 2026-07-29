import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { FeatureGrid } from './components/FeatureGrid';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { StudioApp } from './components/StudioApp';
import { WhiteboardPlayer } from './components/WhiteboardPlayer';
import { EXAMPLE_VIDEOS } from './data/examples';
import { WhiteboardVideo } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'studio'>('landing');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [demoVideo, setDemoVideo] = useState<WhiteboardVideo | null>(null);

  const handleOpenStudio = (prompt: string = '') => {
    if (prompt) setInitialPrompt(prompt);
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (currentView === 'studio') {
    return (
      <StudioApp
        onBackToLanding={() => setCurrentView('landing')}
        initialPrompt={initialPrompt}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-[#1e293b] font-sans antialiased selection:bg-[#ebdcb9] selection:text-[#181e29]">
      
      {/* Navigation Header */}
      <Navbar
        onOpenStudio={() => handleOpenStudio()}
        onNavigateSection={handleNavigateSection}
      />

      {/* Hero Section */}
      <HeroSection
        onOpenStudio={() => handleOpenStudio()}
        onWatchDemo={() => {
          if (EXAMPLE_VIDEOS.length > 0) {
            setDemoVideo(EXAMPLE_VIDEOS[0]);
          } else {
            handleOpenStudio('Ask a question. Watch the Council debate it.');
          }
        }}
        onSelectPrompt={(prompt) => handleOpenStudio(prompt)}
      />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Feature Grid: Built to Explain */}
      <FeatureGrid />

      {/* CTA Banner */}
      <CtaBanner onOpenStudio={() => handleOpenStudio()} />

      {/* Footer */}
      <Footer />

      {/* Demo Video Modal */}
      {demoVideo && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <WhiteboardPlayer
              video={demoVideo}
              onClose={() => setDemoVideo(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
}

