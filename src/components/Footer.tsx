import React from 'react';
import { CouncilLogo } from './CouncilLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-10 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left Logo */}
        <div className="flex items-center gap-3">
          <CouncilLogo size="sm" />
          <span className="text-xs text-slate-400 font-mono">|</span>
          <span className="text-xs text-slate-500 font-sans">
            © {new Date().getFullYear()} Council AI Inc.
          </span>
        </div>

        {/* Right Tagline */}
        <p className="font-sans text-xs sm:text-sm text-slate-500 italic">
          Useful videos that teach and explain.
        </p>

      </div>
    </footer>
  );
};
