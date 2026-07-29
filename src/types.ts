export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  verifiedEmail?: boolean;
}

export interface SVGDiagramElement {
  id: string;
  type: 'circle' | 'rect' | 'arrow' | 'text' | 'icon' | 'path' | 'badge' | 'node';
  x: number;
  y: number;
  width?: number;
  height?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  pathData?: string;
  iconType?: 'brain' | 'chart' | 'globe' | 'check' | 'document' | 'lock' | 'zap' | 'users' | 'shield' | 'trending';
  targetX?: number;
  targetY?: number;
  drawDelayMs?: number;
}

export interface WhiteboardScene {
  id: number;
  title: string;
  narration: string;
  durationSeconds: number;
  diagramTitle: string;
  elements: SVGDiagramElement[];
  agentInsight?: {
    scriptwriterNote: string;
    designerNote: string;
    proofData?: string;
  };
}

export interface MultiAgentDecisionData {
  contextSummary: string;
  strategicRisks: string[];
  proofPoints: string[];
  recommendedAction: string;
}

export interface WhiteboardVideo {
  id: string;
  title: string;
  prompt: string;
  category: 'Finance' | 'Science' | 'Operations' | 'AI & Tech' | 'Strategy & Governance' | 'Crypto & Banking' | 'General';
  aspectRatio: '16:9' | '9:16' | '1:1';
  totalDurationSeconds: number;
  scenes: WhiteboardScene[];
  multiAgentData?: MultiAgentDecisionData;
  createdAt: string;
  thumbnailColor?: string;
}

export interface ChatItem {
  id: string;
  title: string;
  prompt: string;
  createdAt: string;
  status: 'ready' | 'generating';
  video?: WhiteboardVideo;
}

export interface AgentProgressStep {
  id: string;
  agentName: string;
  role: 'Scriptwriter' | 'Visual Designer' | 'Voice Narrator' | 'Decision Analyst';
  status: 'pending' | 'active' | 'completed';
  message: string;
  progressPercent: number;
}
