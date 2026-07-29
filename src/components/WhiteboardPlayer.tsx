import React, { useState, useEffect, useRef } from 'react';
import { WhiteboardVideo, WhiteboardScene } from '../types';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Download, Share2, Layers, CheckCircle, ShieldAlert, FileText, Sparkles, Maximize2, FastForward } from 'lucide-react';

interface WhiteboardPlayerProps {
  video: WhiteboardVideo;
  onClose?: () => void;
}

export const WhiteboardPlayer: React.FC<WhiteboardPlayerProps> = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>(video.aspectRatio || '16:9');
  const [activeTab, setActiveTab] = useState<'canvas' | 'script' | 'multiAgent'>('canvas');
  const [speechSynth, setSpeechSynth] = useState<SpeechSynthesisUtterance | null>(null);

  const currentScene: WhiteboardScene = video.scenes[currentSceneIndex] || video.scenes[0];

  // Speech synthesis effect when scene changes or play status changes
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (isPlaying && currentScene && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(currentScene.narration);
      utterance.rate = playbackSpeed;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        // Automatically move to next scene if available
        if (currentSceneIndex < video.scenes.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
          setSceneProgress(0);
        } else {
          setIsPlaying(false);
        }
      };

      setSpeechSynth(utterance);
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentSceneIndex, isPlaying, isMuted, playbackSpeed]);

  // Scene timer progress animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const sceneDuration = (currentScene?.durationSeconds || 12) * 1000;
    const intervalTime = 100 / (sceneDuration / (50 * playbackSpeed));

    const timer = setInterval(() => {
      setSceneProgress(prev => {
        if (prev >= 100) {
          if (currentSceneIndex < video.scenes.length - 1) {
            setCurrentSceneIndex(i => i + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + intervalTime;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIndex, currentScene, playbackSpeed, video.scenes.length]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    setSceneProgress(0);
    setIsPlaying(true);
  };

  const aspectClass = {
    '16:9': 'aspect-video max-w-4xl',
    '9:16': 'aspect-[9/16] max-w-sm',
    '1:1': 'aspect-square max-w-xl',
  }[aspectRatio];

  return (
    <div className="bg-white rounded-2xl border-1.5 border-slate-900 shadow-xl overflow-hidden text-left font-sans">
      
      {/* Player Top Navigation Bar */}
      <div className="bg-[#181e29] text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h3 className="font-sans font-bold text-sm text-white truncate max-w-md">
              {video.title}
            </h3>
            <span className="text-[11px] text-amber-200/80 font-mono">
              Scene {currentSceneIndex + 1} of {video.scenes.length}: {currentScene.title}
            </span>
          </div>
        </div>

        {/* Tab & Format Toggles */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 p-0.5 rounded-lg text-xs font-medium flex items-center">
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'canvas' ? 'bg-[#b59268] text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Canvas
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'script' ? 'bg-[#b59268] text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Script
            </button>
            {video.multiAgentData && (
              <button
                onClick={() => setActiveTab('multiAgent')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'multiAgent' ? 'bg-[#b59268] text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Proofs
              </button>
            )}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'canvas' && (
        <div className="bg-slate-900/5 p-4 sm:p-6 flex flex-col items-center justify-center">
          
          {/* Whiteboard Interactive Canvas Frame */}
          <div className={`w-full ${aspectClass} bg-graph-paper-dense rounded-xl border-2 border-slate-900 shadow-md relative overflow-hidden transition-all duration-300`}>
            
            {/* Top Scene Diagram Title */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
              <span className="font-handwritten text-xl font-bold text-slate-800 bg-white/90 px-3 py-0.5 rounded-lg border border-slate-300 shadow-2xs">
                ✏️ {currentScene.diagramTitle || currentScene.title}
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-white/90 px-2 py-0.5 rounded border border-slate-200">
                Council AI Render
              </span>
            </div>

            {/* SVG Interactive Drawing Elements Canvas */}
            <svg
              viewBox="0 0 800 360"
              className="w-full h-full p-6 pt-12"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Render Diagram Elements based on progress */}
              {currentScene.elements.map((elem, idx) => {
                const elemProgressThresh = (idx / currentScene.elements.length) * 80;
                const isDrawn = sceneProgress >= elemProgressThresh;

                if (!isDrawn) return null;

                if (elem.type === 'rect') {
                  return (
                    <g key={elem.id} className="transition-opacity duration-500 opacity-100">
                      <rect
                        x={elem.x}
                        y={elem.y}
                        width={elem.width || 200}
                        height={elem.height || 100}
                        rx="12"
                        fill={elem.fill || '#faf7f2'}
                        stroke={elem.color || '#1e293b'}
                        strokeWidth={elem.strokeWidth || 2}
                        strokeDasharray="1000"
                        className="animate-draw"
                      />
                    </g>
                  );
                }

                if (elem.type === 'node') {
                  return (
                    <g key={elem.id} className="transition-all duration-300 transform">
                      <rect
                        x={elem.x - 75}
                        y={elem.y}
                        width={150}
                        height={70}
                        rx="12"
                        fill="#ffffff"
                        stroke={elem.color || '#1e293b'}
                        strokeWidth="2"
                        className="shadow-2xs"
                      />
                      <text
                        x={elem.x}
                        y={elem.y + 30}
                        textAnchor="middle"
                        fill="#181e29"
                        fontSize="13"
                        fontWeight="700"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {elem.label}
                      </text>
                      {elem.sublabel && (
                        <text
                          x={elem.x}
                          y={elem.y + 50}
                          textAnchor="middle"
                          fill="#64748b"
                          fontSize="10"
                          fontFamily="Plus Jakarta Sans, sans-serif"
                        >
                          {elem.sublabel}
                        </text>
                      )}
                    </g>
                  );
                }

                if (elem.type === 'arrow') {
                  return (
                    <g key={elem.id}>
                      <line
                        x1={elem.x}
                        y1={elem.y}
                        x2={elem.targetX || elem.x + 100}
                        y2={elem.targetY || elem.y}
                        stroke={elem.color || '#b59268'}
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                      />
                      <polygon
                        points={`${(elem.targetX || elem.x + 100)},${(elem.targetY || elem.y) - 5} ${(elem.targetX || elem.x + 100) + 8},${(elem.targetY || elem.y)} ${(elem.targetX || elem.x + 100)},${(elem.targetY || elem.y) + 5}`}
                        fill={elem.color || '#b59268'}
                      />
                      {elem.label && (
                        <text
                          x={((elem.x + (elem.targetX || elem.x + 100)) / 2)}
                          y={((elem.y + (elem.targetY || elem.y)) / 2) - 8}
                          textAnchor="middle"
                          fill="#475569"
                          fontSize="11"
                          fontWeight="600"
                          fontFamily="Patrick Hand, cursive"
                        >
                          {elem.label}
                        </text>
                      )}
                    </g>
                  );
                }

                if (elem.type === 'badge') {
                  return (
                    <g key={elem.id}>
                      <rect
                        x={elem.x - 55}
                        y={elem.y}
                        width={110}
                        height={55}
                        rx="10"
                        fill={elem.color || '#3b82f6'}
                        opacity="0.12"
                      />
                      <rect
                        x={elem.x - 55}
                        y={elem.y}
                        width={110}
                        height={55}
                        rx="10"
                        stroke={elem.color || '#3b82f6'}
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <text
                        x={elem.x}
                        y={elem.y + 24}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="12"
                        fontWeight="800"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {elem.label}
                      </text>
                      {elem.sublabel && (
                        <text
                          x={elem.x}
                          y={elem.y + 42}
                          textAnchor="middle"
                          fill="#475569"
                          fontSize="10"
                          fontWeight="600"
                          fontFamily="Plus Jakarta Sans, sans-serif"
                        >
                          {elem.sublabel}
                        </text>
                      )}
                    </g>
                  );
                }

                if (elem.type === 'text') {
                  return (
                    <text
                      key={elem.id}
                      x={elem.x}
                      y={elem.y}
                      textAnchor="middle"
                      fill={elem.color || '#181e29'}
                      fontSize="18"
                      fontWeight="700"
                      fontFamily="Patrick Hand, cursive"
                    >
                      {elem.label}
                    </text>
                  );
                }

                return null;
              })}
            </svg>

            {/* Bottom Live Narration Subtitles Banner */}
            <div className="absolute bottom-3 left-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-300 shadow-sm text-center">
              <p className="font-handwritten text-lg sm:text-xl text-slate-900 leading-snug font-semibold">
                &ldquo;{currentScene.narration}&rdquo;
              </p>
            </div>

          </div>

          {/* Controls Bar */}
          <div className="w-full max-w-4xl mt-4 bg-white border border-slate-200/90 rounded-xl p-3 shadow-sm space-y-2">
            {/* Progress Scrubbing Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 cursor-pointer relative overflow-hidden"
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const pct = ((e.clientX - rect.left) / rect.width) * 100;
                   setSceneProgress(pct);
                 }}>
              <div
                className="bg-[#b59268] h-full transition-all duration-100 rounded-full"
                style={{ width: `${sceneProgress}%` }}
              />
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleRestart}
                  className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  title="Restart video"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="font-mono text-slate-500">
                  {Math.round(sceneProgress)}%
                </span>
              </div>

              {/* Aspect Ratio & Speed */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${aspectRatio === '16:9' ? 'bg-white font-bold shadow-2xs' : 'text-slate-500'}`}
                  >
                    16:9
                  </button>
                  <button
                    onClick={() => setAspectRatio('1:1')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${aspectRatio === '1:1' ? 'bg-white font-bold shadow-2xs' : 'text-slate-500'}`}
                  >
                    1:1
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${aspectRatio === '9:16' ? 'bg-white font-bold shadow-2xs' : 'text-slate-500'}`}
                  >
                    9:16
                  </button>
                </div>

                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="bg-slate-100 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 text-xs font-mono"
                >
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1.0x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2.0x</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Script & Voice Scene Breakdown Tab */}
      {activeTab === 'script' && (
        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#b59268]" /> Full Explainer Script
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              Total Scenes: {video.scenes.length}
            </span>
          </div>

          <div className="space-y-4">
            {video.scenes.map((scene, idx) => (
              <div
                key={scene.id}
                onClick={() => {
                  setCurrentSceneIndex(idx);
                  setSceneProgress(0);
                  setActiveTab('canvas');
                }}
                className={`p-4 rounded-xl border-1.5 transition-all cursor-pointer ${
                  currentSceneIndex === idx
                    ? 'border-[#b59268] bg-[#fdfbf7] shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-800 text-sm pb-1">
                  <span>Scene {idx + 1}: {scene.title}</span>
                  <span className="text-xs font-mono text-[#b59268] bg-amber-50 px-2 py-0.5 rounded">
                    ~{scene.durationSeconds}s
                  </span>
                </div>
                <p className="font-handwritten text-lg text-slate-700 pt-1">
                  &ldquo;{scene.narration}&rdquo;
                </p>
                {scene.agentInsight && (
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500 flex flex-col gap-1">
                    <span>🧠 <strong>Scriptwriter Note:</strong> {scene.agentInsight.scriptwriterNote}</span>
                    <span>🎨 <strong>Designer Layout:</strong> {scene.agentInsight.designerNote}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Agent Proofs & Decision Synthesis Tab */}
      {activeTab === 'multiAgent' && video.multiAgentData && (
        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#b59268]" /> Multi-Agent Strategic Proofs & Context
            </h4>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Verified Consensus
            </span>
          </div>

          {/* Context Summary */}
          <div className="bg-[#fdfbf7] border border-[#d4c5b1] rounded-xl p-4 space-y-1">
            <h5 className="font-bold text-slate-900 text-sm">Context Summary</h5>
            <p className="text-slate-700 text-sm leading-relaxed">
              {video.multiAgentData.contextSummary}
            </p>
          </div>

          {/* Strategic Risks vs Proof Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Strategic Risks */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-2">
              <h5 className="font-bold text-rose-900 text-sm flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> Operational Risks
              </h5>
              <ul className="space-y-1.5 text-xs text-rose-800">
                {video.multiAgentData.strategicRisks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Proof Points */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
              <h5 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Proof Points
              </h5>
              <ul className="space-y-1.5 text-xs text-emerald-800">
                {video.multiAgentData.proofPoints.map((proof, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{proof}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Recommended Action */}
          <div className="bg-slate-900 text-white rounded-xl p-4 space-y-1 border border-slate-800">
            <h5 className="font-bold text-amber-300 text-xs uppercase tracking-wider">
              Recommended Operational Action
            </h5>
            <p className="text-slate-200 text-sm font-medium">
              {video.multiAgentData.recommendedAction}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
