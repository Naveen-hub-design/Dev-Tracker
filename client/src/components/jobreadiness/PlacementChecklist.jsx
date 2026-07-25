import { motion } from 'framer-motion';
import { CheckCircle2, Circle, MapPin, Clock, BookOpen } from 'lucide-react';

export default function PlacementChecklist({ checklist, learningPath, strengths, weaknesses, missingSkills }) {
  const completedCount = checklist.filter((c) => c.done).length;
  const progress = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="space-y-6">
      {/* Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Placement Checklist</h3>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{completedCount}/{checklist.length} done</span>
        </div>

        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-5">
          <motion.div
            className="h-full rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {checklist.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-colors ${
                item.done
                  ? 'bg-emerald-50/60 dark:bg-emerald-900/10'
                  : 'bg-slate-50/60 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {item.done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
              )}
              <span className={`text-[13px] ${item.done ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Recommended Learning Path</h3>
        <div className="relative pl-6">
          <div className="absolute left-[9px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            {learningPath.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center ring-2 ring-white dark:ring-slate-900 z-10">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{step.step}</span>
                </div>
                <div className="rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{step.title}</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{step.timeline}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths / Weaknesses / Missing Skills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Strengths */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3">Strengths</h4>
          {strengths.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500">Keep building to identify strengths</p>
          ) : (
            <div className="space-y-2">
              {strengths.map((s) => (
                <div key={s.key} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">{s.label}</span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 ml-auto">{s.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h4 className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3">Areas to Improve</h4>
          {weaknesses.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500">No major weaknesses detected</p>
          ) : (
            <div className="space-y-2">
              {weaknesses.map((w) => (
                <div key={w.key} className="flex items-center gap-2 p-2 rounded-lg bg-red-50/50 dark:bg-red-900/10">
                  <Circle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">{w.label}</span>
                  <span className="text-[11px] font-bold text-red-500 dark:text-red-400 ml-auto">{w.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3">Missing Skills</h4>
          {missingSkills.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500">All key skills covered</p>
          ) : (
            <div className="space-y-2">
              {missingSkills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/50 dark:bg-amber-900/10">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">{skill}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
