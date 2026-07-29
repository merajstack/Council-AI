import React from 'react';
import { Rocket, Play, ArrowRight, Brain, Globe, BarChart3, Sparkles, MessageSquare, Search } from 'lucide-react';
import { CouncilLogo } from './CouncilLogo';

interface HeroSectionProps {
  onOpenStudio: () => void;
  onWatchDemo: () => void;
  onSelectPrompt?: (prompt: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenStudio,
  onWatchDemo,
  onSelectPrompt,
}) => {
  return (
    <section id="hero" className="relative py-12 lg:py-20 overflow-hidden bg-graph-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/90 border border-amber-200/90 rounded-full w-fit">
              <span className="text-[11px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-amber-700 fill-amber-700/20" />
                🚀 Multi-Agent AI Decision System
              </span>
            </div>

            {/* Handwritten Main Heading matching Patrick Hand */}
            <h1 className="font-handwritten text-5xl sm:text-6xl md:text-7xl font-bold text-[#181e29] leading-[1.08] tracking-wide">
              Ask a question.{' '}
              <br className="hidden sm:inline" />
              Watch the Council{' '}
              <span className="marker-highlight text-[#181e29]">
                debate it.
              </span>
            </h1>

            {/* Body Copy */}
            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Most AI tools give single-model answers. <strong className="text-slate-900 font-semibold">Council AI</strong> orchestrates autonomous specialist agents to debate, stress-test, and synthesize high-stakes operational decisions.
            </p>
            <p className="font-sans text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl">
              One query in — a proof-backed decision canvas out: clear consensus, strategic risk trade-offs, and step-by-step visual diagrams.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenStudio}
                className="btn-dark px-7 py-3.5 rounded-2xl font-sans font-semibold text-base flex items-center gap-2.5 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Consult the Council</span>
                <ArrowRight className="w-4 h-4 text-[#ebdcb9]" />
              </button>

              <button
                onClick={onWatchDemo}
                className="px-7 py-3.5 rounded-2xl font-sans font-semibold text-base text-slate-800 bg-white border-2 border-slate-900/80 hover:bg-slate-50 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                <Play className="w-4 h-4 fill-slate-800 text-slate-800" />
                <span>Watch live debate</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Product Preview Mockup matching Image 1 */}
          <div className="lg:col-span-6 relative">
            
            {/* Playful Floating Hand-Drawn Icons */}
            {/* Brain Icon Top-Left */}
            <div className="absolute -top-6 -left-4 z-20 bg-amber-100 p-2.5 rounded-2xl border-2 border-slate-800 shadow-md transform -rotate-12 animate-bounce duration-1000">
              <Brain className="w-6 h-6 text-amber-700" />
            </div>

            {/* Bar Chart Top-Right */}
            <div className="absolute -top-4 -right-2 z-20 bg-sky-100 p-2.5 rounded-2xl border-2 border-slate-800 shadow-md transform rotate-12">
              <BarChart3 className="w-6 h-6 text-sky-700" />
            </div>

            {/* Globe Bottom-Left */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-emerald-100 p-2.5 rounded-2xl border-2 border-slate-800 shadow-md transform rotate-6">
              <Globe className="w-6 h-6 text-emerald-700" />
            </div>

            {/* App Mockup Frame */}
            <div
              onClick={onOpenStudio}
              className="card-handcrafted p-2 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.01] group relative bg-white overflow-hidden"
              title="Click to open Council AI Studio"
            >
              {/* Window Bar Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/80 bg-slate-50/80 rounded-t-xl">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <span>app.councilai.studio</span>
                </div>
                <div className="text-[11px] font-sans text-slate-500 bg-amber-100/80 text-amber-900 px-2 py-0.5 rounded-full font-medium">
                  Live Preview
                </div>
              </div>

              {/* Inner Split View matching Image 1 */}
              <div className="grid grid-cols-12 min-h-[340px] bg-white rounded-b-xl border border-slate-100 text-left text-xs">
                
                {/* Mini Left Sidebar */}
                <div className="col-span-4 bg-slate-50/70 p-3 border-r border-slate-200/80 space-y-3">
                  <CouncilLogo size="sm" showText={true} />
                  
                  <div className="bg-white border border-slate-200 rounded-lg p-1.5 font-medium text-slate-700 flex items-center gap-1.5 shadow-2xs">
                    <span className="text-slate-400">+</span>
                    <span>New chat</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 px-1 font-medium">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-slate-400" /> Active Chats
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full text-[10px]">Live</span>
                  </div>

                  <div className="relative">
                    <Search className="w-3 h-3 absolute left-2 top-2 text-slate-400" />
                    <input
                      readOnly
                      placeholder="Search chats"
                      className="w-full pl-6 pr-2 py-1 rounded bg-white border border-slate-200 text-[10px] text-slate-500"
                    />
                  </div>

                  <div className="pt-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider px-1">
                    Recent
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-1 rounded bg-slate-200/60 font-medium text-slate-800">
                      <span className="truncate">Credit scores work</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                    <div className="flex items-center justify-between p-1 text-slate-500 truncate">
                      <span className="truncate">Water cycle diagram</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Mini Workspace Right */}
                <div className="col-span-8 p-4 flex flex-col justify-between bg-graph-paper-dense">
                  <div className="text-center space-y-2 pt-2">
                    <div className="mx-auto w-10 h-10 rounded-full bg-[#fdfbf7] border border-[#d4c5b1] flex items-center justify-center shadow-2xs">
                      <CouncilLogo size="sm" showText={false} />
                    </div>
                    <h3 className="font-sans font-bold text-slate-900 text-base">
                      What should Council AI debate?
                    </h3>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-tight">
                      Council AI orchestrates specialist agents to debate strategies, stress-test risks, and build proof-backed decision blueprints.
                    </p>
                  </div>

                  {/* Input Mockup Box */}
                  <div className="bg-white border-1.5 border-slate-300 rounded-xl p-2.5 shadow-xs space-y-2 my-2">
                    <div className="text-slate-400 text-xs italic">
                      Ask Council AI to debate a question...
                    </div>
                    <div className="flex items-center justify-between pt-2 text-[10px]">
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <span>✨ Multi-agent decision synthesis</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                        ↑
                      </div>
                    </div>
                  </div>

                  {/* Quick Prompts */}
                  <div className="flex flex-wrap gap-1 justify-center pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectPrompt) onSelectPrompt("Should my startup raise funding or bootstrap?");
                        else onOpenStudio();
                      }}
                      className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] text-slate-600 hover:border-slate-400 transition-colors"
                    >
                      ✨ Should my startup raise funding or bootstrap?
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectPrompt) onSelectPrompt("Create a 90-day execution plan.");
                        else onOpenStudio();
                      }}
                      className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] text-slate-600 hover:border-slate-400 transition-colors"
                    >
                      ✨ Create a 90-day execution plan.
                    </button>
                  </div>
                </div>

              </div>

              {/* Hover Overlay Hint */}
              <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <span className="btn-beige px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Launch Studio App
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
