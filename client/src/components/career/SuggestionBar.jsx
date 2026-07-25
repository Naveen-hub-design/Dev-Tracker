import React from 'react';
import { motion } from 'framer-motion';

function SuggestionPill({ suggestion, onClick }) {
  return (
    <motion.button
      onClick={() => onClick(suggestion.prompt)}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all shadow-sm whitespace-nowrap"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="text-base">{suggestion.icon}</span>
      <span className="font-medium text-xs">{suggestion.label}</span>
    </motion.button>
  );
}

function SuggestionBar({ suggestions, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {suggestions.map((s, i) => (
        <SuggestionPill key={i} suggestion={s} onClick={onSelect} />
      ))}
    </div>
  );
}

export default React.memo(SuggestionBar);
