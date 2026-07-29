import React from 'react';
import {
  Brain,
  CheckCircle2,
  ShieldAlert,
  Send,
  Sparkles,
  GitBranch,
  Layers,
  Scale,
  Award,
  Users,
  AlertTriangle
} from 'lucide-react';

export interface FinalReportProps {
  question: string;
  data: {
    recommendation?: string;
    confidence?: string;
    summary?: string;
    supporting_arguments?: string[];
    counter_arguments?: string[];
    alternatives?: string[];
    tradeoffs?: string[];
    roadmap?: { phase: string; title: string; detail: string }[] | string[];
    expert_council?: { expert?: string; role?: string; perspective?: string }[] | string[];
    devils_advocate?: { point?: string; riskLevel?: string }[] | string[];
    knowledge_graph?: { entity?: string; relation?: string; target?: string }[] | string[];
  };
}

export const FinalReport: React.FC<FinalReportProps> = ({ question, data }) => {
  if (!data) return null;

  return (
    <div className="w-full max-w-5xl mx-auto my-6 space-y-6 text-left font-sans animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-mono font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Consensus Decision Report
          </span>
          {data.confidence && (
            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full text-xs font-mono font-medium">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Confidence: {data.confidence}
            </span>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border-2 border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Question Title */}
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-mono uppercase font-bold tracking-wider">
            User Question
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            &ldquo;{question}&rdquo;
          </h2>
        </div>

        {/* 1. Context Summary */}
        {data.summary && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="text-xs font-mono uppercase font-bold text-slate-500 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-indigo-600" /> Strategic Context & Synthesis
            </div>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-sans">
              {data.summary}
            </p>
          </div>
        )}

        {/* 2. Recommendation Banner */}
        {data.recommendation && (
          <div className="p-5 bg-[#181e29] text-white rounded-xl space-y-1.5 shadow-md">
            <div className="text-xs font-mono uppercase font-bold text-amber-300 flex items-center gap-1.5">
              <Send className="w-4 h-4 text-amber-400" /> Primary Recommendation
            </div>
            <p className="text-base sm:text-lg text-slate-100 font-semibold leading-snug">
              {data.recommendation}
            </p>
          </div>
        )}

        {/* 3. Supporting Arguments vs Counter Arguments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Supporting Arguments */}
          {data.supporting_arguments && data.supporting_arguments.length > 0 && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="text-xs font-mono uppercase font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Supporting Arguments & Proof Points
              </div>
              <ul className="text-xs sm:text-sm text-emerald-950 space-y-1.5 list-disc pl-4">
                {data.supporting_arguments.map((arg, i) => (
                  <li key={i}>{arg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Counter Arguments & Risks */}
          {data.counter_arguments && data.counter_arguments.length > 0 && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <div className="text-xs font-mono uppercase font-bold text-amber-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Strategic Risks & Counter Arguments
              </div>
              <ul className="text-xs sm:text-sm text-amber-950 space-y-1.5 list-disc pl-4">
                {data.counter_arguments.map((arg, i) => (
                  <li key={i}>{arg}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* 4. Alternatives & Trade-offs */}
        {(data.alternatives?.length || data.tradeoffs?.length) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.alternatives && data.alternatives.length > 0 && (
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <div className="text-xs font-mono uppercase font-bold text-blue-800 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-blue-600" /> Viable Alternatives Evaluated
                </div>
                <ul className="text-xs sm:text-sm text-blue-950 space-y-1.5 list-disc pl-4">
                  {data.alternatives.map((alt, i) => (
                    <li key={i}>{alt}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.tradeoffs && data.tradeoffs.length > 0 && (
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
                <div className="text-xs font-mono uppercase font-bold text-purple-800 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-purple-600" /> Critical Trade-Offs
                </div>
                <ul className="text-xs sm:text-sm text-purple-950 space-y-1.5 list-disc pl-4">
                  {data.tradeoffs.map((tradeoff, i) => (
                    <li key={i}>{tradeoff}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        {/* 5. Expert Council & Devil's Advocate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Expert Council */}
          {data.expert_council && data.expert_council.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="text-xs font-mono uppercase font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-600" /> Expert Council Opinions
              </div>
              <div className="space-y-2">
                {data.expert_council.map((item, i) => {
                  if (typeof item === 'string') {
                    return <p key={i} className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">{item}</p>;
                  }
                  return (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1 text-xs">
                      <div className="font-bold text-slate-900">{item.expert || item.role || 'Council Expert'}</div>
                      <p className="text-slate-600">{item.perspective}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Devil's Advocate */}
          {data.devils_advocate && data.devils_advocate.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="text-xs font-mono uppercase font-bold text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Devil&apos;s Advocate Critique
              </div>
              <div className="space-y-2">
                {data.devils_advocate.map((item, i) => {
                  if (typeof item === 'string') {
                    return <p key={i} className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">{item}</p>;
                  }
                  return (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{item.point}</span>
                        {item.riskLevel && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-rose-100 text-rose-800 rounded font-mono">
                            {item.riskLevel} Risk
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* 6. Execution Roadmap */}
        {data.roadmap && data.roadmap.length > 0 && (
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="text-xs font-mono uppercase font-bold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" /> 90-Day Execution Roadmap
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.roadmap.map((step, i) => {
                if (typeof step === 'string') {
                  return (
                    <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-emerald-800">Phase {i + 1}:</span> {step}
                    </div>
                  );
                }
                return (
                  <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="font-mono text-[10px] text-emerald-700 font-bold uppercase">{step.phase}</div>
                    <div className="font-bold text-slate-900">{step.title}</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{step.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. Knowledge Graph */}
        {data.knowledge_graph && data.knowledge_graph.length > 0 && (
          <div className="p-4 bg-emerald-950 text-white rounded-xl space-y-2">
            <div className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Knowledge Graph Connections
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {data.knowledge_graph.map((item, i) => {
                if (typeof item === 'string') {
                  return <span key={i} className="bg-emerald-900/80 px-2.5 py-1 rounded-md text-emerald-200 border border-emerald-800">{item}</span>;
                }
                return (
                  <div key={i} className="bg-emerald-900/80 px-2.5 py-1 rounded-md text-emerald-200 border border-emerald-800 flex items-center gap-1.5">
                    <span className="font-bold">{item.entity}</span>
                    <span className="text-emerald-400 font-sans italic text-[11px]">&rarr; {item.relation} &rarr;</span>
                    <span className="font-bold">{item.target}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
