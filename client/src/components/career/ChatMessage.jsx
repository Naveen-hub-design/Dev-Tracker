import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
        isUser ? 'bg-gradient-to-tr from-orange-500 to-amber-500 shadow-xs' : 'bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 shadow-xs'
      }`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>
      <div className={`max-w-[75%] min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-md shadow-xs'
            : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-md dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
        }`}>
          {message.isWelcome ? (
            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }} />
          )}
        </div>
        {message.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {t}
              </span>
            ))}
          </div>
        )}
        <p className={`text-[10px] text-slate-400 mt-1 ${isUser ? 'text-right' : ''}`}>{time}</p>
      </div>
    </motion.div>
  );
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-slate-100">$1</strong>')
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-mono">$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-100 rounded-lg p-3 my-2 text-xs font-mono overflow-x-auto"><code>$2</code></pre>')
    .replace(/\n/g, '<br />');
}

export default React.memo(ChatMessage);
