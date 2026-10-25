import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareerAssistant } from '../hooks/useCareerAssistant';
import {
  ChatMessage, ChatInput, ChatSidebar, SuggestionBar,
  TypingIndicator, WelcomeCard, ATSScanner, MockInterviewSimulator,
} from '../components/career';
import { MessageSquare, FileSearch, Sparkles, Award } from 'lucide-react';

export default function CareerAssistantPage() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'ats' | 'interview'

  const {
    messages, isTyping, sendMessage, scrollRef, SUGGESTIONS,
    runATSScan, atsResult, isScanningATS, atsError, clearATSResult,
  } = useCareerAssistant();

  useEffect(() => {
    if (activeTab === 'chat' && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, activeTab, scrollRef]);

  const showWelcome = messages.length === 1;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-8 transition-colors">
      {/* Tab Switcher Header */}
      <div className="px-4 lg:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              DevTrack AI Intelligence
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Live Career Guidance, ATS Resume Matching & FAANG Mock Interviews
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Career Coach</span>
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ats'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Resume ATS Matcher</span>
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'interview'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Mock Interview</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? (
          <div className="flex h-full overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0">
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">
                {showWelcome ? (
                  <WelcomeCard onSuggestion={sendMessage} />
                ) : (
                  messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
                )}
                {isTyping && <TypingIndicator />}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 lg:px-6 py-3 space-y-3">
                {showWelcome && <SuggestionBar suggestions={SUGGESTIONS} onSelect={sendMessage} />}
                <ChatInput onSend={sendMessage} isTyping={isTyping} />
              </div>
            </div>

            <ChatSidebar onSend={sendMessage} />
          </div>
        ) : activeTab === 'ats' ? (
          <div className="h-full overflow-y-auto p-4 lg:p-8 max-w-5xl mx-auto">
            <ATSScanner
              onScan={runATSScan}
              result={atsResult}
              loading={isScanningATS}
              error={atsError}
              onClear={clearATSResult}
            />
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4 lg:p-8 max-w-5xl mx-auto">
            <MockInterviewSimulator />
          </div>
        )}
      </div>
    </div>
  );
}
