import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { FeatureGrid } from './components/FeatureGrid';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { StudioApp } from './components/StudioApp';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'studio'>('landing');
  const [initialPrompt, setInitialPrompt] = useState('');

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
          handleOpenStudio('Ask a question. Watch the Council debate it.');
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

    </div>
  );
}


