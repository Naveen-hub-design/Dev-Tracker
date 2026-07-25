import { motion } from 'framer-motion';
import {
  Github, Code2, Brain, Briefcase, FolderKanban, FileText,
  BarChart3, Shield, Globe, Zap
} from 'lucide-react';

const CARDS = [
  { Icon: Github, label: 'GitHub Sync', sub: '24 repos tracked', x: '2%', y: '6%', w: 'w-36', color: 'from-slate-700 to-slate-800', iconColor: 'text-slate-200', delay: 0 },
  { Icon: Code2, label: '142 Solved', sub: 'LeetCode progress', x: '72%', y: '4%', w: 'w-36', color: 'from-amber-600/80 to-amber-700/80', iconColor: 'text-amber-100', delay: 0.3 },
  { Icon: Brain, label: 'AI Insights', sub: '3 new suggestions', x: '82%', y: '28%', w: 'w-36', color: 'from-rose-600/80 to-rose-700/80', iconColor: 'text-rose-100', delay: 0.6 },
  { Icon: Briefcase, label: 'Job Ready', sub: 'Score: 72/100', x: '2%', y: '50%', w: 'w-36', color: 'from-emerald-600/80 to-emerald-700/80', iconColor: 'text-emerald-100', delay: 0.9 },
  { Icon: FolderKanban, label: '8 Projects', sub: '3 live deployed', x: '78%', y: '55%', w: 'w-36', color: 'from-blue-600/80 to-blue-700/80', iconColor: 'text-blue-100', delay: 1.2 },
  { Icon: FileText, label: 'Resume Score', sub: '85/100', x: '8%', y: '78%', w: 'w-36', color: 'from-purple-600/80 to-purple-700/80', iconColor: 'text-purple-100', delay: 1.5 },
  { Icon: BarChart3, label: 'Analytics', sub: 'Weekly report ready', x: '70%', y: '78%', w: 'w-36', color: 'from-cyan-600/80 to-cyan-700/80', iconColor: 'text-cyan-100', delay: 1.8 },
];

export default function FloatingCards() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden xl:block">
      {CARDS.map((card, i) => (
        <motion.div
          key={i}
          className={`absolute ${card.w}`}
          style={{ left: card.x, top: card.y }}
          initial={{ opacity: 0, y: 15, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2 + card.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 0.5, -0.5, 0] }}
            transition={{ duration: 5 + card.delay * 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className={`bg-gradient-to-br ${card.color} rounded-xl p-2.5 shadow-lg shadow-black/20 border border-white/[0.08] backdrop-blur-sm`}>
              <div className="flex items-center gap-2">
                <card.Icon className={`w-3.5 h-3.5 ${card.iconColor} shrink-0`} />
                <div className="min-w-0">
                  <p className={`text-[10px] font-semibold ${card.iconColor} leading-none`}>{card.label}</p>
                  <p className="text-[7px] text-white/40 mt-0.5 leading-none">{card.sub}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
