import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PageContainer from '../components/ui/PageContainer';
import { useCareerAssistant } from '../hooks/useCareerAssistant';
import {
  ChatMessage, ChatInput, ChatSidebar, SuggestionBar,
  TypingIndicator, WelcomeCard,
} from '../components/career';

export default function CareerAssistantPage() {
  const {
    messages, isTyping, sendMessage, scrollRef, SUGGESTIONS,
  } = useCareerAssistant();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, scrollRef]);

  const showWelcome = messages.length === 1;

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-8 transition-colors">
      <div className="flex flex-1 overflow-hidden">
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
    </div>
  );
}
