import React, { useEffect, useRef, useState } from 'react';

export interface AgentGraphProps {
  completedStages: Set<string>;
  isPipelineActive: boolean;
  onReset?: () => void;
  lastQuestion?: string;
}

interface NodeDef {
  id: string;
  label: string;
  icon: string;
  pos: [number, number]; // [x%, y%]
  stage: string;
}

const NODES: NodeDef[] = [
  { id: 'goal', label: 'Primary Goal', icon: 'flag', pos: [50, 10], stage: 'goal' },
  { id: 'res1', label: 'Market Analysis', icon: 'travel_explore', pos: [25, 30], stage: 'research' },
  { id: 'res2', label: 'Technical Feasibility', icon: 'biotech', pos: [50, 30], stage: 'research' },
  { id: 'res3', label: 'User Persona', icon: 'group', pos: [75, 30], stage: 'research' },
  { id: 'evidence', label: 'Evidence Synthesis', icon: 'fact_check', pos: [35, 50], stage: 'evidence' },
  { id: 'credibility', label: 'Source Verification', icon: 'verified', pos: [65, 50], stage: 'credibility' },
  { id: 'kg', label: 'Knowledge Graph', icon: 'hub', pos: [50, 70], stage: 'knowledge_graph' },
  { id: 'council', label: 'Expert Council', icon: 'forum', pos: [35, 85], stage: 'expert_council' },
  { id: 'advocate', label: "Devil's Advocate", icon: 'gavel', pos: [65, 85], stage: 'devils_advocate' },
  { id: 'consensus', label: 'Final Consensus', icon: 'handshake', pos: [50, 95], stage: 'consensus' },
];

const CONNECTIONS: [string, string][] = [
  ['goal', 'res1'], ['goal', 'res2'], ['goal', 'res3'],
  ['res1', 'evidence'], ['res2', 'evidence'], ['res2', 'credibility'], ['res3', 'credibility'],
  ['evidence', 'kg'], ['credibility', 'kg'],
  ['kg', 'council'], ['kg', 'advocate'],
  ['council', 'consensus'], ['advocate', 'consensus']
];

export const AgentGraph: React.FC<AgentGraphProps> = ({
  completedStages,
  isPipelineActive,
  onReset,
  lastQuestion
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 420 });
  const [showStillWorking, setShowStillWorking] = useState(false);

  // Timer for >60s stall warning after "goal" but before "consensus"
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    const hasGoal = completedStages.has('goal');
    const hasConsensus = completedStages.has('consensus');

    if (hasGoal && !hasConsensus && isPipelineActive) {
      timeoutId = setTimeout(() => {
        setShowStillWorking(true);
      }, 60000); // 60 seconds
    } else {
      setShowStillWorking(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [completedStages, isPipelineActive]);

  // Handle ResizeObserver for responsive SVG edge drawing
  useEffect(() => {
    if (!containerRef.current) return;

    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width || 800, height: rect.height || 420 });
      }
    };

    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Helper to check if a specific node is completed
  const isNodeCompleted = (node: NodeDef) => {
    return completedStages.has(node.stage);
  };

  // Helper to determine if a node is currently active (processing)
  const isNodeActive = (node: NodeDef) => {
    if (isNodeCompleted(node)) return false;
    if (!isPipelineActive) return false;

    if (node.stage === 'goal') return isPipelineActive && !completedStages.has('goal');
    if (node.stage === 'research') return completedStages.has('goal') && !completedStages.has('research');
    if (node.stage === 'evidence') return completedStages.has('research') && !completedStages.has('evidence');
    if (node.stage === 'credibility') return completedStages.has('research') && !completedStages.has('credibility');
    if (node.stage === 'knowledge_graph') return (completedStages.has('evidence') || completedStages.has('credibility')) && !completedStages.has('knowledge_graph');
    if (node.stage === 'expert_council') return completedStages.has('knowledge_graph') && !completedStages.has('expert_council');
    if (node.stage === 'devils_advocate') return completedStages.has('knowledge_graph') && !completedStages.has('devils_advocate');
    if (node.stage === 'consensus') return (completedStages.has('expert_council') || completedStages.has('devils_advocate')) && !completedStages.has('consensus');

    return false;
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-4 space-y-4 font-sans text-left">
      
      {/* Header section with typographic texture */}
      <div className="flex items-end justify-between px-2">
        <div className="flex flex-col">
          <span className="font-mono text-[11px] text-[#735338] uppercase tracking-widest font-bold mb-1">
            Process Visualization
          </span>
          <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">
            Neural Orchestration Graph
          </h2>
          {lastQuestion && (
            <p className="text-xs text-slate-500 font-mono mt-0.5 max-w-md truncate">
              Query: &ldquo;{lastQuestion}&rdquo;
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#f7f3ec] border border-[#d6c7b2] px-3 py-1 rounded-full text-xs font-mono">
            <div className={`w-2 h-2 rounded-full ${isPipelineActive ? 'bg-[#b59268] animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-[#3d2c1d] font-medium uppercase">
              {isPipelineActive ? 'PIPELINE RUNNING' : 'SYSTEM IDLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Graph Viewport Card */}
      <div
        ref={containerRef}
        className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-[#e8ddcc] h-[440px] w-full"
      >
        {/* Soft radial glow backgrounds */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#b59268]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-[#3d2c1d]/5 rounded-full blur-3xl pointer-events-none" />

        {/* SVG Layer for Connections/Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <filter id="glow-edge" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {CONNECTIONS.map(([fromId, toId], idx) => {
            const fromNode = NODES.find((n) => n.id === fromId);
            const toNode = NODES.find((n) => n.id === toId);

            if (!fromNode || !toNode) return null;

            const x1 = (fromNode.pos[0] / 100) * dimensions.width;
            const y1 = (fromNode.pos[1] / 100) * dimensions.height;
            const x2 = (toNode.pos[0] / 100) * dimensions.width;
            const y2 = (toNode.pos[1] / 100) * dimensions.height;

            const toCompleted = isNodeCompleted(toNode);
            const toActive = isNodeActive(toNode);

            let strokeColor = '#d6c7b2';
            let strokeDash = '2,4';
            let opacity = '0.5';
            let animated = false;

            if (toCompleted) {
              strokeColor = '#3d2c1d'; // Completed Warm Dark Brown
              strokeDash = 'none';
              opacity = '1';
            } else if (toActive) {
              strokeColor = '#b59268'; // Active Warm Gold / Bronze
              strokeDash = '4,4';
              opacity = '1';
              animated = true;
            }

            return (
              <line
                key={`edge-${fromId}-${toId}-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth={toCompleted || toActive ? 2.5 : 1.5}
                strokeDasharray={strokeDash}
                strokeLinecap="round"
                opacity={opacity}
                filter={toActive ? 'url(#glow-edge)' : undefined}
              >
                {animated && (
                  <animate
                    attributeName="stroke-dashoffset"
                    from="20"
                    to="0"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                )}
              </line>
            );
          })}
        </svg>

        {/* Nodes Layer */}
        <div className="absolute inset-0 w-full h-full z-10">
          {NODES.map((node) => {
            const completed = isNodeCompleted(node);
            const active = isNodeActive(node);

            let nodeStyles = 'bg-white text-slate-500 border border-slate-200 opacity-50 shadow-xs';

            if (completed) {
              nodeStyles = 'bg-[#3d2c1d] text-white border-[#3d2c1d] shadow-md shadow-amber-950/20 scale-100';
            } else if (active) {
              nodeStyles = 'bg-[#ebdcb9] text-[#3d2c1d] border-[#b59268] scale-105 shadow-lg ring-2 ring-[#b59268]/40 animate-pulse font-semibold';
            }

            return (
              <div
                key={node.id}
                className={`node absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all duration-500 cursor-default select-none ${nodeStyles}`}
                style={{
                  left: `${node.pos[0]}%`,
                  top: `${node.pos[1]}%`,
                }}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {node.icon}
                </span>
                <span className="font-mono text-xs whitespace-nowrap tracking-tight">
                  {node.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 text-xs text-slate-600">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3d2c1d] shadow-xs" />
            <span className="font-mono text-[11px] font-medium text-slate-700">Validated</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#b59268] animate-pulse" />
            <span className="font-mono text-[11px] font-medium text-slate-700">Processing</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#d6c7b2]" />
            <span className="font-mono text-[11px] font-medium text-slate-500">Queued</span>
          </div>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-slate-500 hover:text-[#3d2c1d] transition-colors font-mono text-[11px] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset Graph</span>
          </button>
        )}
      </div>

      {/* Still Working Message Banner if > 60s without consensus */}
      {showStillWorking && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-mono flex items-center gap-2.5 animate-fade-in shadow-xs">
          <span className="material-symbols-outlined text-amber-600 animate-spin text-[18px]">
            progress_activity
          </span>
          <span>
            Complex multi-agent evaluation in progress — still working on synthesizing final consensus...
          </span>
        </div>
      )}

    </div>
  );
};
