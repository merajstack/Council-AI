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
    <div className="w-full max-w-5xl mx-auto my-6 space-y-6 text-left font-pencil animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-[#e8ddcc] pb-4">
        <div className="flex items-center gap-2 font-pencil">
          <span className="inline-flex items-center gap-1.5 bg-[#f7f3ec] border border-[#d6c7b2] text-[#3d2c1d] px-3.5 py-1 rounded-full text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#8c6842]" />
            Consensus Decision Report
          </span>
          {data.confidence && (
            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-full text-sm font-bold">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              Confidence: {data.confidence}
            </span>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border-2 border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 font-pencil">
        
        {/* Question Title */}
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="inline-block px-3 py-0.5 rounded-md bg-[#ebdcb9] text-[#3d2c1d] text-xs font-pencil uppercase font-bold tracking-wider">
            User Question
          </div>
          <h2 className="text-3xl sm:text-4xl font-pencil font-bold text-slate-900 leading-tight">
            &ldquo;{question}&rdquo;
          </h2>
        </div>

        {/* 1. Context Summary */}
        {data.summary && (
          <div className="p-5 bg-[#fdfbf7] border border-[#e8ddcc] rounded-xl space-y-2">
            <div className="text-sm font-pencil uppercase font-bold text-[#735338] flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-[#8c6842]" /> Strategic Context & Synthesis
            </div>
            <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-pencil">
              {data.summary}
            </p>
          </div>
        )}

        {/* 2. Recommendation Banner */}
        {data.recommendation && (
          <div className="p-5 bg-[#3d2c1d] text-white rounded-xl space-y-1.5 shadow-md font-pencil">
            <div className="text-xs font-pencil uppercase font-bold text-[#ebdcb9] flex items-center gap-1.5">
              <Send className="w-4 h-4 text-[#b59268]" /> Primary Recommendation
            </div>
            <p className="text-lg sm:text-xl text-slate-100 font-bold leading-snug font-pencil">
              {data.recommendation}
            </p>
          </div>
        )}

        {/* 3. Supporting Arguments vs Counter Arguments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-pencil">
          
          {/* Supporting Arguments */}
          {data.supporting_arguments && data.supporting_arguments.length > 0 && (
            <div className="p-4 bg-[#f7f3ec] border border-[#d6c7b2] rounded-xl space-y-2">
              <div className="text-sm font-pencil uppercase font-bold text-[#3d2c1d] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#8c6842]" /> Supporting Arguments & Proof Points
              </div>
              <ul className="text-sm sm:text-base text-[#2b1b10] space-y-1.5 list-disc pl-5 font-pencil">
                {data.supporting_arguments.map((arg, i) => (
                  <li key={i}>{arg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Counter Arguments & Risks */}
          {data.counter_arguments && data.counter_arguments.length > 0 && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <div className="text-sm font-pencil uppercase font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" /> Strategic Risks & Counter Arguments
              </div>
              <ul className="text-sm sm:text-base text-amber-950 space-y-1.5 list-disc pl-5 font-pencil">
                {data.counter_arguments.map((arg, i) => (
                  <li key={i}>{arg}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* 4. Alternatives & Trade-offs */}
        {(data.alternatives?.length || data.tradeoffs?.length) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-pencil">
            {data.alternatives && data.alternatives.length > 0 && (
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <div className="text-sm font-pencil uppercase font-bold text-blue-900 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-blue-700" /> Viable Alternatives Evaluated
                </div>
                <ul className="text-sm sm:text-base text-blue-950 space-y-1.5 list-disc pl-5 font-pencil">
                  {data.alternatives.map((alt, i) => (
                    <li key={i}>{alt}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.tradeoffs && data.tradeoffs.length > 0 && (
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
                <div className="text-sm font-pencil uppercase font-bold text-purple-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-purple-700" /> Critical Trade-Offs
                </div>
                <ul className="text-sm sm:text-base text-purple-950 space-y-1.5 list-disc pl-5 font-pencil">
                  {data.tradeoffs.map((tradeoff, i) => (
                    <li key={i}>{tradeoff}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        {/* 5. Expert Council & Devil's Advocate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-pencil">
          
          {/* Expert Council */}
          {data.expert_council && data.expert_council.length > 0 && (
            <div className="p-4 bg-[#fdfbf7] border border-[#e8ddcc] rounded-xl space-y-3">
              <div className="text-sm font-pencil uppercase font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-700" /> Expert Council Opinions
              </div>
              <div className="space-y-2">
                {data.expert_council.map((item, i) => {
                  if (typeof item === 'string') {
                    return <p key={i} className="text-sm text-slate-800 bg-white p-2.5 rounded-lg border border-[#e8ddcc] font-pencil">{item}</p>;
                  }
                  return (
                    <div key={i} className="p-3 bg-white rounded-lg border border-[#e8ddcc] space-y-1 text-sm font-pencil">
                      <div className="font-bold text-slate-900">{item.expert || item.role || 'Council Expert'}</div>
                      <p className="text-slate-700">{item.perspective}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Devil's Advocate */}
          {data.devils_advocate && data.devils_advocate.length > 0 && (
            <div className="p-4 bg-[#fdfbf7] border border-[#e8ddcc] rounded-xl space-y-3">
              <div className="text-sm font-pencil uppercase font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-700" /> Devil&apos;s Advocate Critique
              </div>
              <div className="space-y-2">
                {data.devils_advocate.map((item, i) => {
                  if (typeof item === 'string') {
                    return <p key={i} className="text-sm text-slate-800 bg-white p-2.5 rounded-lg border border-[#e8ddcc] font-pencil">{item}</p>;
                  }
                  return (
                    <div key={i} className="p-3 bg-white rounded-lg border border-[#e8ddcc] space-y-1 text-sm font-pencil">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{item.point}</span>
                        {item.riskLevel && (
                          <span className="px-2 py-0.5 text-xs bg-rose-100 text-rose-900 rounded font-bold font-pencil">
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
          <div className="p-5 bg-[#fdfbf7] border border-[#e8ddcc] rounded-xl space-y-3 font-pencil">
            <div className="text-sm font-pencil uppercase font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#8c6842]" /> 90-Day Execution Roadmap
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.roadmap.map((step, i) => {
                if (typeof step === 'string') {
                  return (
                    <div key={i} className="p-3 bg-white rounded-xl border border-[#e8ddcc] text-sm font-pencil">
                      <span className="font-bold text-[#3d2c1d]">Phase {i + 1}:</span> {step}
                    </div>
                  );
                }
                return (
                  <div key={i} className="p-3 bg-white rounded-xl border border-[#e8ddcc] space-y-1 text-sm font-pencil">
                    <div className="font-pencil text-xs text-[#735338] font-bold uppercase">{step.phase}</div>
                    <div className="font-bold text-slate-900">{step.title}</div>
                    <p className="text-slate-700 text-xs leading-relaxed">{step.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. Knowledge Graph */}
        {data.knowledge_graph && data.knowledge_graph.length > 0 && (
          <div className="p-5 bg-[#2b1b10] text-white rounded-xl space-y-2 font-pencil">
            <div className="text-sm font-pencil uppercase font-bold text-[#ebdcb9] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#b59268]" /> Knowledge Graph Connections
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-pencil">
              {data.knowledge_graph.map((item, i) => {
                if (typeof item === 'string') {
                  return <span key={i} className="bg-[#3d2c1d] px-3 py-1 rounded-md text-[#ebdcb9] border border-[#735338]">{item}</span>;
                }
                return (
                  <div key={i} className="bg-[#3d2c1d] px-3 py-1 rounded-md text-[#ebdcb9] border border-[#735338] flex items-center gap-1.5 font-pencil">
                    <span className="font-bold">{item.entity}</span>
                    <span className="text-[#b59268] italic text-xs">&rarr; {item.relation} &rarr;</span>
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
