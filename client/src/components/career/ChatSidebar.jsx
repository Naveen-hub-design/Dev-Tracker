import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Map, Target, Code2, BookOpen, Briefcase, Award, BarChart3, FileText, Lightbulb, Trophy } from 'lucide-react';

const ACTIONS = [
  { id: 'roadmap', icon: Map, label: 'Roadmap', color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'skillgap', icon: Target, label: 'Skill Gap', color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'interview', icon: Code2, label: 'Interview', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'resume', icon: FileText, label: 'Resume', color: 'text-violet-600', bg: 'bg-violet-50' },
  { id: 'projects', icon: Briefcase, label: 'Projects', color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'learning', icon: BookOpen, label: 'Learning', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'tips', icon: Lightbulb, label: 'Tips', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'placement', icon: BarChart3, label: 'Readiness', color: 'text-teal-600', bg: 'bg-teal-50' },
  { id: 'mock', icon: Code2, label: 'Mock Interview', color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'courses', icon: Award, label: 'Certifications', color: 'text-orange-600', bg: 'bg-orange-50' },
];

const PROMPTS = {
  roadmap: 'Show me a career roadmap for becoming a senior full-stack developer',
  skillgap: 'Analyze my current skills and identify gaps for my target role',
  interview: 'Help me prepare for my next technical interview',
  resume: 'Review my resume and suggest improvements',
  projects: 'Suggest portfolio projects that would impress recruiters',
  learning: 'Recommend a learning path for mastering system design',
  tips: 'Give me 5 coding tips that senior developers swear by',
  placement: 'Assess my placement readiness based on my current profile',
  mock: 'Start a mock technical interview with me',
  courses: 'Recommend the best courses and certifications for web development',
};

function ChatSidebar({ onSend }) {
  return (
    <div className="hidden lg:block w-64 shrink-0 border-l border-slate-100 dark:border-slate-800 p-4 overflow-y-auto">
      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
      <div className="space-y-1.5">
        {ACTIONS.map((a, i) => (
          <motion.button
            key={a.id}
            onClick={() => onSend(PROMPTS[a.id])}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <div className={`w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <a.icon className={`w-4 h-4 ${a.color}`} />
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{a.label}</span>
          </motion.button>
        ))}
      </div>
      <div className="mt-6 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/30">
        <Trophy className="w-5 h-5 text-blue-500 mb-2" />
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Pro Tip</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Ask specific questions for better answers. Try: "What skills do I need for a Google L4 role?"</p>
      </div>
    </div>
  );
}

export default React.memo(ChatSidebar);
