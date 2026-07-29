import React, { useState, useEffect } from 'react';
import { CouncilLogo } from './CouncilLogo';
import { EXAMPLE_VIDEOS } from '../data/examples';
import { WhiteboardVideo, ChatItem, GoogleUser } from '../types';
import { WhiteboardPlayer } from './WhiteboardPlayer';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, onSnapshot, setDoc, doc } from 'firebase/firestore';
import {
  Plus,
  Search,
  MessageSquare,
  ArrowUp,
  Sparkles,
  ArrowLeft,
  User,
  LogOut,
  Brain,
  Palette,
  Mic,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface StudioAppProps {
  onBackToLanding: () => void;
  initialPrompt?: string;
  googleUser?: GoogleUser | null;
  onOpenAuthModal?: () => void;
}

export const StudioApp: React.FC<StudioAppProps> = ({
  onBackToLanding,
  initialPrompt = '',
  googleUser,
  onOpenAuthModal,
}) => {
  const [chats, setChats] = useState<ChatItem[]>([]);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState(initialPrompt);
  const [searchQuery, setSearchQuery] = useState('');
  const [graphPaper, setGraphPaper] = useState(true);
  const [selectedAspect, setSelectedAspect] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(0);

  const activeChat = chats.find(c => c.id === activeChatId);

  // Load real-time chats from Firestore for current user
  useEffect(() => {
    if (!googleUser) return;
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('userId', '==', googleUser.id));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedChats: ChatItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: data.id || docSnap.id,
            title: data.title,
            prompt: data.prompt,
            createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Just now',
            status: data.status || 'ready',
            video: data.video,
          };
        });
        setChats(loadedChats);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'chats');
      }
    );

    return () => unsubscribe();
  }, [googleUser]);

  // Quick suggestions list
  const quickPrompts = [
    'How do multi-agent decision models navigate high-stakes operational strategies?',
    'Evaluate credit risk trade-offs for enterprise liquidity',
    'How do stablecoin cross-border payments work under regulatory shifts?',
    'Should we dual-source semiconductor suppliers in 2026?',
    'Explain how credit scores work',
  ];

  const handleStartNewChat = () => {
    setActiveChatId(null);
    setPromptInput('');
  };

  const handleSelectQuickPrompt = (prompt: string) => {
    setPromptInput(prompt);
    handleSubmitPrompt(prompt);
  };

  const handleSubmitPrompt = async (forcedPrompt?: string) => {
    const promptToUse = forcedPrompt || promptInput;
    if (!promptToUse.trim() || isGenerating) return;

    if (!googleUser) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    setIsGenerating(true);
    setGenerationStep(1);

    // Multi-Agent Generation Stepper Animation
    setTimeout(() => setGenerationStep(2), 1200);
    setTimeout(() => setGenerationStep(3), 2400);

    try {
      let finalVideo: WhiteboardVideo;

      // Call backend API /api/generate-whiteboard (which posts to WEBHOOK_URL)
      const response = await fetch('/api/generate-whiteboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          aspectRatio: selectedAspect,
          user: googleUser ? {
            id: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
          } : { email: 'guest@council.ai', name: 'Guest User' }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        finalVideo = data.video;
      } else {
        throw new Error('Server generation error');
      }

      const newChatItem: ChatItem = {
        id: `chat-${Date.now()}`,
        title: promptToUse.length > 28 ? promptToUse.substring(0, 26) + '...' : promptToUse,
        prompt: promptToUse,
        createdAt: new Date().toISOString(),
        status: 'ready',
        video: finalVideo,
      };

      // Save to Firestore
      try {
        await setDoc(doc(db, 'chats', newChatItem.id), {
          id: newChatItem.id,
          userId: googleUser.id,
          title: newChatItem.title,
          prompt: newChatItem.prompt,
          createdAt: newChatItem.createdAt,
          status: 'ready',
          video: finalVideo,
        });
      } catch (fErr) {
        handleFirestoreError(fErr, OperationType.WRITE, `chats/${newChatItem.id}`);
      }

      setChats(prev => [newChatItem, ...prev]);
      setActiveChatId(newChatItem.id);
      setPromptInput('');
    } catch (err) {
      console.warn('API generation fallback to client synthesis:', err);
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const filteredChats = chats.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col md:flex-row text-left font-sans text-slate-800">
      
      {/* LEFT SIDEBAR matching Natural Tones design */}
      <aside className="w-full md:w-72 bg-[#f5f5f0] border-r border-slate-200/80 p-4 flex flex-col justify-between shrink-0 h-auto md:h-screen sticky top-0 z-30">
        
        <div className="space-y-4">
          
          {/* Header with Council Logo and Back button */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer group"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
              <CouncilLogo size="sm" />
            </button>
            <button
              onClick={onBackToLanding}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded bg-slate-50 border border-slate-200"
            >
              Home
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleStartNewChat}
            className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 flex items-center justify-start gap-2 shadow-2xs hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold">New chat</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats"
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#b59268]"
            />
          </div>

          {/* Recent Chat History */}
          <div className="space-y-1 pt-2">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 px-1 tracking-wider">
              Recent Explainer Chats
            </div>

            {filteredChats.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs space-y-1">
                <MessageSquare className="w-6 h-6 mx-auto opacity-40" />
                <p>No chats found.</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      activeChatId === chat.id
                        ? 'bg-slate-100 text-slate-900 font-semibold border border-slate-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate pr-2">{chat.title}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Bottom User Profile Card */}
        <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 truncate hover:opacity-80 transition-opacity text-left cursor-pointer"
            title={googleUser ? `Connected as ${googleUser.email}` : 'Click to Sign in with Google'}
          >
            {googleUser ? (
              <>
                <img
                  src={googleUser.picture}
                  alt={googleUser.name}
                  className="w-7 h-7 rounded-full border border-emerald-500 shrink-0"
                />
                <div className="truncate min-w-0">
                  <div className="font-bold text-slate-800 text-[11px] truncate flex items-center gap-1">
                    {googleUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{googleUser.email}</div>
                </div>
              </>
            ) : (
              <>
                <div className="w-7 h-7 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 font-bold shrink-0">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div className="truncate">
                  <span className="truncate font-semibold text-slate-800">Sign in with Google</span>
                  <div className="text-[10px] text-indigo-600 font-mono">Sync Telemetry</div>
                </div>
              </>
            )}
          </button>
          <button
            onClick={onBackToLanding}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Exit Studio"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>

      {/* MAIN STUDIO WORKSPACE */}
      <main className="flex-1 bg-graph-paper min-h-screen flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto">
        
        {/* If Active Chat selected -> Show Video Player */}
        {activeChat && activeChat.video ? (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleStartNewChat}
                className="text-xs font-semibold text-[#b59268] hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Back to Studio Prompt
              </button>
              <div className="text-xs font-mono text-slate-400">
                Created: {activeChat.createdAt}
              </div>
            </div>

            <WhiteboardPlayer video={activeChat.video} />
          </div>
        ) : (
          /* Empty Workspace view matching Image 2 */
          <div className="max-w-3xl mx-auto w-full my-auto space-y-8 text-center py-6">
            
            {/* Top Central Emblem / Eye Graphic */}
            <div className="mx-auto w-20 h-20 rounded-full bg-white border-2 border-[#181e29] shadow-md flex items-center justify-center">
              <CouncilLogo size="lg" showText={false} />
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3">
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                What should Council AI debate?
              </h2>
              <p className="font-sans text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Ask a question that needs strategic clarity. Council AI&apos;s autonomous specialist agents debate the scenario, stress-test risks, and build a proof-backed decision blueprint.
              </p>
            </div>

            {/* Interactive Prompt Input Box matching Image 2 */}
            <div className="card-handcrafted p-4 bg-white space-y-3 shadow-md focus-within:border-[#b59268] focus-within:ring-2 focus-within:ring-[#b59268]/20 transition-all text-left">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitPrompt();
                  }
                }}
                placeholder="Ask Council AI to debate a question..."
                rows={3}
                className="w-full resize-none border-none focus:outline-none text-slate-800 text-base font-sans placeholder:text-slate-400"
              />

              {/* Bottom Control Pills & Send Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGraphPaper(!graphPaper)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      graphPaper
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    Graph paper
                  </button>

                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-mono border border-slate-200">
                    <button
                      onClick={() => setSelectedAspect('16:9')}
                      className={`px-2 py-0.5 rounded ${selectedAspect === '16:9' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-500'}`}
                    >
                      16:9
                    </button>
                    <button
                      onClick={() => setSelectedAspect('1:1')}
                      className={`px-2 py-0.5 rounded ${selectedAspect === '1:1' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-500'}`}
                    >
                      1:1
                    </button>
                    <button
                      onClick={() => setSelectedAspect('9:16')}
                      className={`px-2 py-0.5 rounded ${selectedAspect === '9:16' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-500'}`}
                    >
                      9:16
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleSubmitPrompt()}
                  disabled={!promptInput.trim() || isGenerating}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white transition-all cursor-pointer ${
                    promptInput.trim() && !isGenerating
                      ? 'bg-[#181e29] hover:bg-slate-800 shadow-md hover:scale-105'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Multi-Agent Live Stepper Status during generation */}
            {isGenerating && (
              <div className="bg-white border-2 border-[#b59268] rounded-2xl p-6 shadow-xl space-y-4 text-left animate-fade-in">
                <div className="flex items-center gap-2 text-sm font-bold text-[#181e29]">
                  <Sparkles className="w-4 h-4 text-[#b59268] animate-spin" />
                  <span>Council AI Multi-Agent Engine actively debating...</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  
                  {/* Step 1 */}
                  <div className={`p-3 rounded-xl border transition-all ${
                    generationStep >= 1 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5" /> 1. Risk Analyst Agent</span>
                      {generationStep > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : generationStep === 1 && <Loader2 className="w-3 h-3 animate-spin" />}
                    </div>
                    <p className="text-[11px] leading-snug">Cross-examining proof points & market data...</p>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-3 rounded-xl border transition-all ${
                    generationStep >= 2 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> 2. Strategy Designer</span>
                      {generationStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : generationStep === 2 && <Loader2 className="w-3 h-3 animate-spin" />}
                    </div>
                    <p className="text-[11px] leading-snug">Laying out decision nodes & trade-off matrices...</p>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-3 rounded-xl border transition-all ${
                    generationStep >= 3 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5" /> 3. Consensus Synthesizer</span>
                      {generationStep === 3 && <Loader2 className="w-3 h-3 animate-spin" />}
                    </div>
                    <p className="text-[11px] leading-snug">Building verified proof-backed blueprint...</p>
                  </div>

                </div>
              </div>
            )}

            {/* Quick Prompt Suggestion Pills */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                Or try a suggested prompt
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickPrompts.map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectQuickPrompt(promptText)}
                    className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-400 text-xs text-slate-700 hover:text-slate-900 transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#b59268]" />
                    <span>{promptText}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
