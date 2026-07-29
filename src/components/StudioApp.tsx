import React, { useState, useEffect } from 'react';
import { CouncilLogo } from './CouncilLogo';
import { AgentGraph } from './AgentGraph';
import { FinalReport } from './FinalReport';
import { ChatItem } from '../types';
import {
  getSavedUserSession,
  saveConversationToSupabase,
  fetchConversationsFromSupabase,
} from '../lib/supabase';
import {
  Plus,
  Search,
  MessageSquare,
  ArrowUp,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface StudioAppProps {
  onBackToLanding: () => void;
  initialPrompt?: string;
}

export const StudioApp: React.FC<StudioAppProps> = ({
  onBackToLanding,
  initialPrompt = '',
}) => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState(initialPrompt);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWebhookInactiveToast, setShowWebhookInactiveToast] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Agent Graph & Pipeline state
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());
  const [isPipelineActive, setIsPipelineActive] = useState<boolean>(false);
  const [finalReportData, setFinalReportData] = useState<any>(null);

  // Fetch conversations from Supabase on mount
  useEffect(() => {
    const user = getSavedUserSession();
    fetchConversationsFromSupabase(user).then((savedChats) => {
      if (savedChats && savedChats.length > 0) {
        setChats(savedChats);
      }
    });
  }, []);

  const activeChat = chats.find(c => c.id === activeChatId);

  // Subscribe to SSE progress stream for real-time /progress events
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/progress-stream');

      eventSource.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.stage) {
            const validStages = [
              'goal',
              'research',
              'evidence',
              'credibility',
              'knowledge_graph',
              'expert_council',
              'devils_advocate',
              'consensus'
            ];

            const stageKey = payload.stage;
            if (validStages.includes(stageKey)) {
              setCompletedStages((prev) => {
                const next = new Set(prev);
                next.add(stageKey);
                return next;
              });

              if (stageKey === 'consensus') {
                setIsPipelineActive(false);
              }
            }
          }
        } catch (err) {
          // Ignore non-JSON or heartbeat events silently
        }
      };

      eventSource.onerror = () => {
        // Retry connection automatically
      };
    } catch (err) {
      console.warn('SSE stream unavailable, relying on POST /run response');
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  // Quick suggestions list
  const quickPrompts = [
    'Should my startup raise funding or bootstrap?',
    "What's the fastest way to validate my product idea?",
    'Compare two business strategies and recommend one.',
    'Identify the biggest risks in my project.',
    'Create a 90-day execution plan.',
  ];

  const handleStartNewChat = () => {
    setActiveChatId(null);
    setPromptInput('');
    setCompletedStages(new Set());
    setFinalReportData(null);
    setIsPipelineActive(false);
    setCurrentQuestion('');
  };

  const handleResetGraph = () => {
    setCompletedStages(new Set());
    setFinalReportData(null);
    setIsPipelineActive(false);
  };

  const handleSelectQuickPrompt = (prompt: string) => {
    setPromptInput(prompt);
    handleSubmitPrompt(prompt);
  };

  const handleSubmitPrompt = async (forcedPrompt?: string) => {
    const promptToUse = forcedPrompt || promptInput;
    if (!promptToUse.trim() || isGenerating) return;

    setIsGenerating(true);
    setCurrentQuestion(promptToUse);
    setCompletedStages(new Set()); // Start graph in idle state with all nodes dim
    setFinalReportData(null); // Render report ONLY after /run resolves
    setIsPipelineActive(true);

    try {
      let responseData: any = null;

      // Call Endpoint 1: POST /run with the question
      const response = await fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: promptToUse }),
      });

      if (response.ok) {
        responseData = await response.json();
      } else {
        // Fallback endpoint if /run is proxied differently
        const fbRes = await fetch('/api/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: promptToUse }),
        });
        if (fbRes.ok) {
          responseData = await fbRes.json();
        }
      }

      // Check webhook status
      if (!responseData?.webhookSent) {
        setShowWebhookInactiveToast(true);
      } else {
        setShowWebhookInactiveToast(false);
      }

      // Set final report data only after /run response arrives
      if (responseData) {
        setFinalReportData(responseData);

        const activeUser = getSavedUserSession();
        const newChatItem: ChatItem = {
          id: `chat-${Date.now()}`,
          title: promptToUse.length > 28 ? promptToUse.substring(0, 26) + '...' : promptToUse,
          prompt: promptToUse,
          createdAt: new Date().toISOString(),
          status: 'ready',
          video: responseData.video,
        };

        // Save conversation and chat_messages to Supabase
        saveConversationToSupabase(newChatItem, activeUser);

        setChats((prev) => [newChatItem, ...prev]);
        setActiveChatId(newChatItem.id);
      }

      setPromptInput('');
    } catch (err) {
      console.warn('Pipeline execution error:', err);
      setShowWebhookInactiveToast(true);
    } finally {
      setIsGenerating(false);
      setIsPipelineActive(false);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col md:flex-row text-left font-sans text-slate-800">
      
      {/* LEFT SIDEBAR matching Lumina Graph / Technical Minimalist design */}
      <aside className="w-full md:w-72 bg-[#f2f3ff] border-r border-slate-200/80 p-4 flex flex-col justify-between shrink-0 h-auto md:h-screen sticky top-0 z-30">
        
        <div className="space-y-4">
          
          {/* Header with Council Logo and Back button */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer group"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
              <CouncilLogo size="sm" badgeColor="#006c49" />
            </button>
            <button
              onClick={onBackToLanding}
              className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded bg-white border border-slate-200 cursor-pointer"
            >
              Home
            </button>
          </div>

          {/* New Question Button */}
          <button
            onClick={handleStartNewChat}
            className="w-full py-2.5 px-3 bg-white border border-emerald-200 rounded-xl font-medium text-[#006c49] flex items-center justify-start gap-2 shadow-2xs hover:border-[#006c49] hover:shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#006c49]" />
            <span className="text-sm font-semibold">New Question</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history"
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#006c49]"
            />
          </div>

          {/* Recent Question History */}
          <div className="space-y-1 pt-2">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 px-1 tracking-wider">
              Agent Pipeline Runs
            </div>

            {filteredChats.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs space-y-1">
                <MessageSquare className="w-6 h-6 mx-auto opacity-40" />
                <p>No queries run yet.</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setCurrentQuestion(chat.prompt);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      activeChatId === chat.id
                        ? 'bg-emerald-100/70 text-[#00422b] font-semibold border border-emerald-300'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate pr-2">{chat.title}</span>
                    <span className="w-2 h-2 rounded-full bg-[#006c49] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Navigation / Exit Studio */}
        <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-left cursor-pointer font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Return to Landing Page</span>
          </button>
        </div>

      </aside>

      {/* MAIN STUDIO WORKSPACE */}
      <main className="flex-1 bg-[#faf8ff] min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-between my-2 space-y-6">
          
          {/* TOP AREA: Icon & Tagline */}
          <div className="space-y-4 text-center pt-2">
            
            {/* Top Workspace Bar */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-[#006c49] tracking-wider">
                  Agent Graph Orchestrator
                </span>
              </div>
              {currentQuestion && (
                <button
                  onClick={handleStartNewChat}
                  className="text-xs font-semibold text-[#006c49] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← Ask another question
                </button>
              )}
            </div>

            {/* Icon & Brand Tagline Section */}
            <div className="space-y-3 py-4 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white border-2 border-[#006c49]/20 shadow-md flex items-center justify-center p-2 hover:scale-105 transition-transform">
                <CouncilLogo size="xl" showText={false} badgeColor="#006c49" />
              </div>
              
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#006c49] tracking-tight font-sans">
                  Council AI — Every AI. One Council.
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-sans">
                  Submit a prompt to run autonomous specialist agents across goal setting, research synthesis, evidence verification, knowledge graphs, and expert consensus.
                </p>
              </div>
            </div>

            {/* Quick Sample Scenario Pills */}
            {!currentQuestion && (
              <div className="space-y-2 max-w-2xl mx-auto pt-1">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                  Select a Sample Scenario
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickPrompts.map((promptText, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectQuickPrompt(promptText)}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-[#006c49] hover:bg-emerald-50/50 text-xs text-slate-700 hover:text-[#006c49] transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[11px] shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                      <span>{promptText}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* MIDDLE AREA: AGENT GRAPH & REPORT (DISPLAYED ONLY WHEN A PROMPT HAS BEEN SUBMITTED) */}
          {(currentQuestion.trim().length > 0 || isPipelineActive || completedStages.size > 0) && (
            <div className="space-y-6 w-full animate-fade-in my-4">
              
              {/* AGENT GRAPH ANIMATION COMPONENT */}
              <AgentGraph
                completedStages={completedStages}
                isPipelineActive={isPipelineActive || isGenerating}
                onReset={handleResetGraph}
                lastQuestion={currentQuestion}
              />

              {/* FINAL REPORT COMPONENT (Rendered only after POST /run resolves) */}
              {finalReportData && (
                <FinalReport
                  question={currentQuestion}
                  data={finalReportData}
                />
              )}

            </div>
          )}

          {/* BOTTOM AREA: CHATBOX / INPUT FORM */}
          <div className="w-full pt-4 pb-2">
            <div className="bg-white border-2 border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                <span>Submit Question to Agent Pipeline</span>
                <span className="text-[10px] text-[#006c49] uppercase">POST /run</span>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-[#f2f3ff]/40 space-y-3 focus-within:border-[#006c49] focus-within:ring-2 focus-within:ring-[#006c49]/20 transition-all">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitPrompt();
                    }
                  }}
                  placeholder="Type a question for the multi-agent graph pipeline..."
                  rows={2}
                  className="w-full resize-none border-none focus:outline-none bg-transparent text-slate-800 text-sm font-sans placeholder:text-slate-400"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="text-xs text-slate-400 font-mono">Press Enter to dispatch POST /run</span>
                  <button
                    onClick={() => handleSubmitPrompt()}
                    disabled={!promptInput.trim() || isGenerating}
                    className={`px-4 py-2 rounded-full font-mono text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 ${
                      promptInput.trim() && !isGenerating
                        ? 'bg-[#006c49] hover:bg-[#005236] shadow-md hover:scale-105'
                        : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Running Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit to /run</span>
                        <ArrowUp className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Webhook Inactive Popup Toast at bottom right */}
      {showWebhookInactiveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#181e29] text-white border border-slate-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all animate-fade-in">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-xs font-semibold tracking-wide text-slate-200 font-mono">Webhook inactive</span>
          <button
            onClick={() => setShowWebhookInactiveToast(false)}
            className="ml-2 text-slate-400 hover:text-white text-xs cursor-pointer p-0.5 rounded hover:bg-slate-800 transition-colors"
            title="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
};

