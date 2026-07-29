import React, { useState, useEffect } from 'react';
import { FileText, Brain, Clock, Sparkles, Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle, Search, Trophy, ShieldCheck, Zap } from 'lucide-react';

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

  // Automation video player state
  const [activeWebhook, setActiveWebhook] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const webhookScenes = [
    {
      id: 1,
      title: 'Webhook 1: Fetching Live Internet Data',
      badge: 'Live Search',
      narration: 'Webhook 1 fetches live data from the internet.',
      accent: 'border-cyan-500/80 shadow-cyan-500/20 text-cyan-400',
      bgGlow: 'from-cyan-900/30 to-slate-900',
    },
    {
      id: 2,
      title: 'Webhook 2: Auditing Reviews & Stress-Testing Options',
      badge: 'Stress-Testing',
      narration: 'Webhook 2 audits reviews and stress-tests every option.',
      accent: 'border-emerald-500/80 shadow-emerald-500/20 text-emerald-400',
      bgGlow: 'from-emerald-900/30 to-slate-900',
    },
    {
      id: 3,
      title: 'Webhook 3: Best Output Selected & Finalized',
      badge: 'Finalized',
      narration: 'Webhook 3 finalizes and selects the best output.',
      accent: 'border-amber-500/80 shadow-amber-500/20 text-amber-400',
      bgGlow: 'from-amber-900/30 to-slate-900',
    }
  ];

  // Speech synthesis for automation video
  useEffect(() => {
    if (!isPlaying || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (!isMuted) {
      const current = webhookScenes[activeWebhook];
      const utterance = new SpeechSynthesisUtterance(current.narration);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [activeWebhook, isPlaying, isMuted]);

  // Video progress timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeWebhook < webhookScenes.length - 1) {
            setActiveWebhook((w) => w + 1);
            return 0;
          } else {
            setActiveWebhook(0);
            return 0;
          }
        }
        return prev + 1.25;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isPlaying, activeWebhook, webhookScenes.length]);

  return (
    <section id="how-it-works" className="py-20 bg-[#fafaf9] border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
        
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

        {/* How Automation Works Video Section */}
        <div className="pt-10 space-y-8 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Live Webhook Execution
            </div>
            <h3 className="font-handwritten text-4xl sm:text-5xl font-bold text-[#181e29]">
              How Automation works
            </h3>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              See how autonomous webhooks continuously search live data, audit ratings, and select the optimal decision output.
            </p>
          </div>

          {/* Interactive Whiteboard Video Frame */}
          <div className="bg-[#111827] rounded-3xl border-2 border-slate-800 p-4 sm:p-8 shadow-2xl overflow-hidden relative text-left">
            
            {/* Top Navigation Bar / Webhook Steps */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-slate-300 uppercase tracking-widest font-bold">
                  Council Automation Pipeline
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                {webhookScenes.map((sc, idx) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setActiveWebhook(idx);
                      setProgress(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeWebhook === idx
                        ? 'bg-[#b59268] text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Webhook {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className={`w-full aspect-video rounded-2xl border-2 bg-gradient-to-b ${webhookScenes[activeWebhook].bgGlow} ${webhookScenes[activeWebhook].accent} transition-all duration-500 relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 shadow-xl`}>
              
              {/* Scene Watermark Overlay */}
              <div className="flex items-center justify-between z-10">
                <div className="bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-xl border border-slate-700/80 text-white font-sans font-bold text-sm sm:text-base shadow-md flex items-center gap-2">
                  <span className="text-amber-400">⚡</span>
                  <span>{webhookScenes[activeWebhook].title}</span>
                </div>
                <span className="text-xs font-mono text-slate-300 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700">
                  Step {activeWebhook + 1} / 3
                </span>
              </div>

              {/* Animated Scene SVG Visuals */}
              <div className="my-auto py-4 flex items-center justify-center">
                {activeWebhook === 0 && (
                  <svg className="w-full max-w-xl h-44 sm:h-56" viewBox="0 0 600 240" fill="none">
                    {/* Desk & Computer Screen */}
                    <rect x="150" y="50" width="300" height="130" rx="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" className="shadow-lg" />
                    <rect x="165" y="65" width="270" height="100" rx="8" fill="#0f172a" />
                    
                    {/* Search Bar Animation */}
                    <rect x="185" y="80" width="230" height="28" rx="14" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" />
                    <text x="200" y="98" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      Google searching live internet... 🔍
                    </text>
                    
                    {/* Network Nodes */}
                    <circle cx="210" cy="130" r="6" fill="#38bdf8" className="animate-ping" />
                    <circle cx="270" cy="140" r="5" fill="#38bdf8" />
                    <circle cx="340" cy="125" r="7" fill="#38bdf8" />
                    <circle cx="390" cy="135" r="5" fill="#38bdf8" />
                    <line x1="210" y1="130" x2="270" y2="140" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4" />
                    <line x1="270" y1="140" x2="340" y2="125" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4" />
                    <line x1="340" y1="125" x2="390" y2="135" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4" />

                    {/* Stick Figure Operator */}
                    <circle cx="100" cy="110" r="16" stroke="#f8fafc" strokeWidth="2.5" fill="#0f172a" />
                    <line x1="100" y1="126" x2="100" y2="175" stroke="#f8fafc" strokeWidth="2.5" />
                    <line x1="100" y1="140" x2="150" y2="150" stroke="#f8fafc" strokeWidth="2.5" />
                    <line x1="100" y1="175" x2="80" y2="210" stroke="#f8fafc" strokeWidth="2.5" />
                    <line x1="100" y1="175" x2="120" y2="210" stroke="#f8fafc" strokeWidth="2.5" />

                    {/* Second Collaborator */}
                    <circle cx="500" cy="110" r="16" stroke="#f8fafc" strokeWidth="2.5" fill="#0f172a" />
                    <line x1="500" y1="126" x2="500" y2="175" stroke="#f8fafc" strokeWidth="2.5" />
                    <line x1="500" y1="140" x2="450" y2="150" stroke="#f8fafc" strokeWidth="2.5" />
                    <line x1="500" y1="175" x2="480" y2="210" stroke="#f8fafc" strokeWidth="2.5" />
                    <line x1="500" y1="175" x2="520" y2="210" stroke="#f8fafc" strokeWidth="2.5" />

                    {/* Table Surface */}
                    <line x1="40" y1="185" x2="560" y2="185" stroke="#475569" strokeWidth="4" />
                  </svg>
                )}

                {activeWebhook === 1 && (
                  <svg className="w-full max-w-xl h-44 sm:h-56" viewBox="0 0 600 240" fill="none">
                    {/* Review & Audit Board */}
                    <rect x="120" y="30" width="360" height="150" rx="12" fill="#064e3b" stroke="#10b981" strokeWidth="3" />
                    <rect x="140" y="45" width="320" height="120" rx="8" fill="#022c22" />

                    {/* Analyst Review Cards */}
                    <rect x="155" y="55" width="130" height="40" rx="6" fill="#065f46" />
                    <text x="165" y="72" fill="#34d399" fontSize="10" fontFamily="sans-serif" fontWeight="bold">ANALYST REVIEWS</text>
                    <text x="165" y="88" fill="#a7f3d0" fontSize="9" fontFamily="sans-serif">Rating: ★★★★★ (98%)</text>

                    {/* Trade-off Matrix */}
                    <rect x="310" y="55" width="130" height="40" rx="6" fill="#065f46" />
                    <text x="320" y="72" fill="#34d399" fontSize="10" fontFamily="sans-serif" fontWeight="bold">TRADE-OFF AUDIT</text>
                    <text x="320" y="88" fill="#a7f3d0" fontSize="9" fontFamily="sans-serif">Risk Score: 2.1% Low</text>

                    {/* Stress Testing Progress */}
                    <rect x="155" y="108" width="280" height="22" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                    <rect x="155" y="108" width="210" height="22" rx="4" fill="#10b981" />
                    <text x="210" y="123" fill="#022c22" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      STRESS-TESTING OPTIONS 75%
                    </text>

                    {/* Auditor Stick Figure with Magnifying Glass */}
                    <circle cx="70" cy="110" r="16" stroke="#10b981" strokeWidth="2.5" fill="#022c22" />
                    <line x1="70" y1="126" x2="70" y2="175" stroke="#10b981" strokeWidth="2.5" />
                    <line x1="70" y1="140" x2="110" y2="105" stroke="#10b981" strokeWidth="2.5" />
                    <circle cx="115" cy="100" r="12" stroke="#34d399" strokeWidth="2" fill="none" />
                    <line x1="70" y1="175" x2="50" y2="210" stroke="#10b981" strokeWidth="2.5" />
                    <line x1="70" y1="175" x2="90" y2="210" stroke="#10b981" strokeWidth="2.5" />
                  </svg>
                )}

                {activeWebhook === 2 && (
                  <svg className="w-full max-w-xl h-44 sm:h-56" viewBox="0 0 600 240" fill="none">
                    {/* Glass Whiteboard Flowchart */}
                    <rect x="100" y="30" width="400" height="150" rx="14" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="3" />
                    
                    {/* Winner Trophy Banner */}
                    <circle cx="300" cy="65" r="22" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                    <text x="300" y="72" textAnchor="middle" fontSize="20">🏆</text>

                    {/* Flowchart Diagram Nodes */}
                    <rect x="140" y="105" width="90" height="36" rx="6" fill="#312e81" stroke="#818cf8" strokeWidth="1.5" />
                    <text x="185" y="127" textAnchor="middle" fill="#e0e7ff" fontSize="10" fontWeight="bold">Strategy A</text>

                    <rect x="255" y="105" width="90" height="36" rx="6" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
                    <text x="300" y="127" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Best Choice ✓</text>

                    <rect x="370" y="105" width="90" height="36" rx="6" fill="#312e81" stroke="#818cf8" strokeWidth="1.5" />
                    <text x="415" y="127" textAnchor="middle" fill="#e0e7ff" fontSize="10" fontWeight="bold">Strategy B</text>

                    {/* Connection lines */}
                    <line x1="230" y1="123" x2="255" y2="123" stroke="#fbbf24" strokeWidth="2" />
                    <line x1="345" y1="123" x2="370" y2="123" stroke="#fbbf24" strokeWidth="2" />

                    {/* Celebratory Stick Figures */}
                    <circle cx="60" cy="110" r="14" stroke="#fbbf24" strokeWidth="2.5" fill="#1e1b4b" />
                    <line x1="60" y1="124" x2="60" y2="165" stroke="#fbbf24" strokeWidth="2.5" />
                    <line x1="60" y1="135" x2="35" y2="115" stroke="#fbbf24" strokeWidth="2.5" />
                    <line x1="60" y1="135" x2="85" y2="115" stroke="#fbbf24" strokeWidth="2.5" />

                    <circle cx="540" cy="110" r="14" stroke="#fbbf24" strokeWidth="2.5" fill="#1e1b4b" />
                    <line x1="540" y1="124" x2="540" y2="165" stroke="#fbbf24" strokeWidth="2.5" />
                    <line x1="540" y1="135" x2="515" y2="115" stroke="#fbbf24" strokeWidth="2.5" />
                    <line x1="540" y1="135" x2="565" y2="115" stroke="#fbbf24" strokeWidth="2.5" />
                  </svg>
                )}
              </div>

              {/* Subtitle Banner */}
              <div className="bg-slate-950/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-800 text-center shadow-lg z-10">
                <p className="font-handwritten text-xl sm:text-2xl text-white font-semibold">
                  &ldquo;{webhookScenes[activeWebhook].narration}&rdquo;
                </p>
              </div>

            </div>

            {/* Video Controls Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
              {/* Playback controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveWebhook(0);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  title="Restart Automation Video"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Scrubbing Bar */}
              <div className="flex-1 max-w-md mx-2 bg-slate-800 rounded-full h-2 relative overflow-hidden cursor-pointer"
                   onClick={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const pct = ((e.clientX - rect.left) / rect.width) * 100;
                     setProgress(pct);
                   }}>
                <div
                  className="bg-amber-400 h-full transition-all duration-75 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Webhook Step Indicator */}
              <div className="flex items-center gap-2 font-mono text-slate-400 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Automated Proof Engine Active</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

