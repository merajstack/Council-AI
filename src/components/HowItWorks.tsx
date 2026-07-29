import React from 'react';
import { FileText, Brain, Clock, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 'Step 1',
      title: 'Ask Your Question',
      body: 'Describe your problem in plain English. Just ask naturally.',
      iconBg: 'bg-amber-100/90 text-amber-800 border-amber-300',
      icon: <FileText className="w-6 h-6" />,
      badge: 'Just ask →',
    },
    {
      step: 'Step 2',
      title: 'AI Experts Collaborate',
      body: 'Specialized AI agents analyze your question, challenge different ideas, and work together to find the best solution. Multiple perspectives. One answer.',
      iconBg: 'bg-orange-100/90 text-orange-800 border-orange-300',
      icon: <Brain className="w-6 h-6" />,
      badge: 'Multiple perspectives. One answer.',
    },
    {
      step: 'Step 3',
      title: 'Get a Clear Solution',
      body: 'Receive a well-structured answer with visual diagrams of progress, supporting evidence, and actionable next steps. Easy to understand. Ready to use.',
      iconBg: 'bg-yellow-100/90 text-yellow-800 border-yellow-300',
      icon: <Clock className="w-6 h-6" />,
      badge: 'Easy to understand. Ready to use.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#fafaf9] border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        {/* Section Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#b59268]" /> Simple Workflow
          </div>
          <h2 className="font-handwritten text-5xl sm:text-6xl font-bold text-[#181e29]">
            How it works
          </h2>
          <p className="font-sans text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            From a single strategic question to a multi-agent live debate and proof-backed decision canvas in seconds.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {steps.map((item, index) => (
            <div
              key={index}
              className="card-handcrafted p-8 bg-white flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative group"
            >
              <div className="space-y-6">
                {/* Header Icon + Step Badge */}
                <div className="flex items-center justify-between">
                  <div className={`p-3.5 rounded-2xl border-1.5 shadow-2xs ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    0{index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase font-bold text-[#b59268] tracking-wider">
                    {item.step}
                  </span>
                  <h3 className="font-sans text-2xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="font-sans text-slate-600 text-sm leading-relaxed pt-1">
                    {item.body}
                  </p>
                </div>
              </div>

              {/* Card Footer Tag */}
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>{item.badge}</span>
                <span className="text-[#b59268] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
