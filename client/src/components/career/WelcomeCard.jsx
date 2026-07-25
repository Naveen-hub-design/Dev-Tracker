import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Bot, Sparkles } from 'lucide-react';

function WelcomeCard({ onSuggestion }) {
  const features = [
    { icon: '🗺️', title: 'Career Roadmaps', desc: 'Personalized growth plans' },
    { icon: '🎯', title: 'Skill Gaps', desc: 'What to learn next' },
    { icon: '💼', title: 'Interview Prep', desc: 'Technical + behavioral' },
    { icon: '📝', title: 'Resume Review', desc: 'Make it stand out' },
    { icon: '🚀', title: 'Project Ideas', desc: 'Portfolio-worthy builds' },
    { icon: '📚', title: 'Learning Paths', desc: 'Courses & resources' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto text-center py-8"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/20">
        <Bot className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">AI Career Assistant</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
        Your personal career coach. Ask me anything about interviews, skills, projects, or career growth.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all cursor-pointer text-left"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => onSuggestion(`Tell me about ${f.title.toLowerCase()}`)}
          >
            <span className="text-xl">{f.icon}</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1.5">{f.title}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default React.memo(WelcomeCard);
