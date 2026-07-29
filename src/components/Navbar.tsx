import React from 'react';
import { CouncilLogo } from './CouncilLogo';
import { Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenStudio: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenStudio,
  onNavigateSection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fcfcfd]/90 backdrop-blur-md border-b border-slate-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigateSection('hero')}
          className="cursor-pointer text-left focus:outline-none"
        >
          <CouncilLogo size="md" />
        </button>

        {/* Center/Right Nav Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 font-sans text-sm font-medium text-slate-700">
            <button
              onClick={() => onNavigateSection('how-it-works')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => onNavigateSection('demo')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Demo
            </button>
            <button
              onClick={() => onNavigateSection('features')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Multi-Agent Engine
            </button>
          </nav>

          {/* Action Button */}
          <button
            onClick={onOpenStudio}
            className="btn-beige px-5 py-2 rounded-full font-sans text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            Open the studio
          </button>
        </div>
      </div>
    </header>
  );
};

