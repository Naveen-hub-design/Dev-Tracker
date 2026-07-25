import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

function ChatInput({ onSend, isTyping }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isTyping) return;
    onSend(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm px-4 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
        <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isTyping ? 'AI is thinking...' : 'Ask about your career...'}
          disabled={isTyping}
          className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none disabled:opacity-50"
        />
        <motion.button
          type="submit"
          disabled={!text.trim() || isTyping}
          className="p-2 rounded-xl bg-blue-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          whileTap={{ scale: 0.92 }}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </form>
  );
}

export default React.memo(ChatInput);
