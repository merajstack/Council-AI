import React from 'react';
import { Brain, Palette, FileCheck, Tv, Compass, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      title: 'Multi-Agent Intelligence',
      body: 'Multiple specialized AI experts independently analyze your problem, challenge each other\'s assumptions, and converge on stronger recommendations.',
      icon: <Brain className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50/80',
    },
    {
      title: 'Visual Reasoning',
      body: 'Transform complex strategies into interactive diagrams, decision trees, and execution maps that are easy to understand and present.',
      icon: <Palette className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50/80',
    },
    {
      title: 'Evidence-Backed Answers',
      body: 'Every recommendation is grounded in supporting evidence with traceable sources, citations, and contextual references.',
      icon: <FileCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50/80',
    },
    {
      title: 'Real-Time Deliberation',
      body: 'Watch agents collaborate, debate trade-offs, and refine solutions live before reaching a final consensus.',
      icon: <Tv className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50/80',
    },
    {
      title: 'Strategic Planning Engine',
      body: 'Generate roadmaps, risk assessments, implementation plans, and decision frameworks tailored to your objective.',
      icon: <Compass className="w-5 h-5 text-amber-700" />,
      bg: 'bg-amber-50/80',
    },
    {
      title: 'Transparent Decision Process',
      body: 'Inspect every reasoning step, supporting argument, and confidence score instead of relying on a black-box answer.',
      icon: <Eye className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50/80',
    },
    {
      title: 'Enterprise Reliability',
      body: 'Designed for repeatable, auditable, and consistent decision support across teams and high-impact workflows.',
      icon: <ShieldCheck className="w-5 h-5 text-slate-800" />,
      bg: 'bg-slate-100/80',
    },
  ];

  return (
    <section id="features" className="py-20 bg-graph-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
        
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#b59268]" /> Council Capabilities
          </div>
          <h2 className="font-handwritten text-5xl sm:text-6xl font-bold text-[#181e29]">
            Built for decisions that matter.
          </h2>
          <p className="font-sans text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            Purpose-built multi-agent framework designed for stress-tested decision support and visual proof synthesis.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {features.map((item, index) => (
            <div
              key={index}
              className={`card-handcrafted p-7 bg-white hover:shadow-md transition-all duration-200 space-y-4 ${
                index === 6 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border border-slate-200/60 ${item.bg}`}>
                {item.icon}
              </div>

              <div className="space-y-2">
                <h3 className="font-sans text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

