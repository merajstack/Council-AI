import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CtaBannerProps {
  onOpenStudio: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenStudio }) => {
  return (
    <section className="py-16 bg-[#fafaf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#181e29] rounded-3xl p-10 sm:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl border border-slate-800 text-white">
          
          {/* Subtle Decorative Background Circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#b59268]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-amber-200 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#ebdcb9]" />
              <span>Multi-Agent Decision & Visual Engine</span>
            </div>

            <h2 className="font-handwritten text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-wide text-white">
              The next high-stakes question you face — <br className="hidden sm:inline" />
              <span className="text-[#ebdcb9]">let Council AI debate it.</span>
            </h2>

            <p className="font-sans text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
              Transform complex operational dilemmas into clear, proof-backed decision blueprints and interactive visual strategy maps.
            </p>
          </div>

          {/* Button */}
          <div className="pt-2 relative z-10 flex justify-center">
            <button
              onClick={onOpenStudio}
              className="bg-white text-[#181e29] hover:bg-slate-50 font-sans font-bold text-base px-8 py-3.5 rounded-full shadow-[0_4px_0_0_#d1d5db] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Open the studio</span>
              <ArrowRight className="w-4 h-4 text-[#181e29]" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
