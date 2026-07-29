import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { FeatureGrid } from './components/FeatureGrid';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { StudioApp } from './components/StudioApp';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { WhiteboardPlayer } from './components/WhiteboardPlayer';
import { EXAMPLE_VIDEOS } from './data/examples';
import { WhiteboardVideo, GoogleUser } from './types';
import { auth, onAuthStateChanged, firebaseSignOut } from './lib/firebase';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'studio'>('landing');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [demoVideo, setDemoVideo] = useState<WhiteboardVideo | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem('council_google_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const user: GoogleUser = {
          id: fbUser.uid,
          email: fbUser.email || `${fbUser.uid}@council.ai`,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Council User',
          picture: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fbUser.email || fbUser.uid)}`,
          verifiedEmail: fbUser.emailVerified || true,
        };
        setGoogleUser(user);
        localStorage.setItem('council_google_user', JSON.stringify(user));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore signout errors
    }
    localStorage.removeItem('council_google_user');
    setGoogleUser(null);
    setCurrentView('landing');
  };

  const handleAuthSuccess = (user: GoogleUser) => {
    setGoogleUser(user);
    setIsAuthModalOpen(false);
    // Redirect authenticated user into Studio
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStudio = (prompt: string = '') => {
    if (prompt) setInitialPrompt(prompt);

    if (!googleUser) {
      // Require login before accessing studio
      setIsAuthModalOpen(true);
      return;
    }

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
    // Safety check: if user is not authenticated, kick back to auth / landing
    if (!googleUser) {
      setCurrentView('landing');
      setIsAuthModalOpen(true);
      return null;
    }

    return (
      <>
        <StudioApp
          onBackToLanding={() => setCurrentView('landing')}
          initialPrompt={initialPrompt}
          googleUser={googleUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
        <GoogleAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          currentUser={googleUser}
          onSignOut={handleSignOut}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-[#1e293b] font-sans antialiased selection:bg-[#ebdcb9] selection:text-[#181e29]">
      
      {/* Navigation Header */}
      <Navbar
        onOpenStudio={() => handleOpenStudio()}
        onNavigateSection={handleNavigateSection}
        googleUser={googleUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
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

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        currentUser={googleUser}
        onSignOut={handleSignOut}
      />

    </div>
  );
}

