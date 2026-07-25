import { motion } from 'framer-motion';
import { Github, Code2, FolderKanban, FileText, Brain, Award } from 'lucide-react';

const ICON_MAP = { Github, Code2, FolderKanban, FileText, Brain, Award };

const COLOR_MAP = {
  slate: { bar: 'bg-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' },
  amber: { bar: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
  blue: { bar: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
  purple: { bar: 'bg-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
  cyan: { bar: 'bg-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400' },
  emerald: { bar: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
};

function BreakdownDetail({ label, value, max, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-slate-500 dark:text-slate-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${COLOR_MAP[color]?.bar || 'bg-blue-500'}`}
          initial={{ width: 0 }}
          animate={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>
      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 w-8 text-right tabular-nums">{value}</span>
    </div>
  );
}

export default function ScoreBreakdown({ categories }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-5">Score Breakdown</h3>
      <div className="space-y-5">
        {categories.map((cat, i) => {
          const Icon = ICON_MAP[cat.icon] || Code2;
          const colors = COLOR_MAP[cat.color] || COLOR_MAP.slate;
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg}`}>
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{cat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{cat.weight}</span>
                      <span className={`text-sm font-bold tabular-nums ${colors.text}`}>{cat.score}/100</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
                    <motion.div
                      className={`h-full rounded-full ${colors.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.score}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                    />
                  </div>
                </div>
              </div>

              {/* Detail breakdowns */}
              {cat.key === 'github' && cat.breakdown && (
                <div className="ml-11 mt-2 space-y-1.5">
                  <BreakdownDetail label="Repos" value={cat.breakdown.repos} max={15} color={cat.color} />
                  <BreakdownDetail label="Commits" value={cat.breakdown.commits} max={300} color={cat.color} />
                  <BreakdownDetail label="Stars" value={cat.breakdown.stars} max={30} color={cat.color} />
                  <BreakdownDetail label="Languages" value={cat.breakdown.languages} max={5} color={cat.color} />
                </div>
              )}
              {cat.key === 'leetcode' && cat.breakdown && (
                <div className="ml-11 mt-2 space-y-1.5">
                  <BreakdownDetail label="Total" value={cat.breakdown.total} max={300} color={cat.color} />
                  <BreakdownDetail label="Easy" value={cat.breakdown.easy} max={150} color={cat.color} />
                  <BreakdownDetail label="Medium" value={cat.breakdown.medium} max={100} color={cat.color} />
                  <BreakdownDetail label="Hard" value={cat.breakdown.hard} max={50} color={cat.color} />
                </div>
              )}
              {cat.key === 'projects' && cat.breakdown && (
                <div className="ml-11 mt-2 space-y-1.5">
                  <BreakdownDetail label="Total" value={cat.breakdown.total} max={6} color={cat.color} />
                  <BreakdownDetail label="Completed" value={cat.breakdown.completed} max={4} color={cat.color} />
                  <BreakdownDetail label="Live" value={cat.breakdown.live} max={2} color={cat.color} />
                  <BreakdownDetail label="Tech Stack" value={cat.breakdown.techDiversity} max={8} color={cat.color} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
