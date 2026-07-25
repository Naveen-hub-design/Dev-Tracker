import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import AnimatedNumber from '../dashboard/AnimatedNumber';
import { Code2, RefreshCw } from 'lucide-react';

function LCProfileHero({ data, onRefresh, loading }) {
  if (!data) return null;
  const pct = data.total > 0 ? Math.min(Math.round((data.total / 500) * 100), 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 dark:from-amber-900/20 dark:via-slate-900 dark:to-orange-900/20 pointer-events-none" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <span className="text-2xl font-bold text-white">
                {data.username?.charAt(0)?.toUpperCase() || 'L'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">@{data.username}</h1>
                <button
                  onClick={onRefresh}
                  disabled={loading}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50"
                  aria-label="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">LeetCode Problem Solver</p>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  <AnimatedNumber value={data.total || 0} duration={1200} />
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">problems solved</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <span className="text-emerald-600 font-medium">{data.easy || 0} Easy</span>
                <span className="text-amber-600 font-medium">{data.medium || 0} Medium</span>
                <span className="text-red-600 font-medium">{data.hard || 0} Hard</span>
              </div>
            </div>
            <div className="hidden sm:block text-right shrink-0">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Progress to 500</p>
              <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">{pct}%</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(LCProfileHero);
