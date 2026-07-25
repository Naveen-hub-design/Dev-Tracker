import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { Calendar, GitCommit, Code2, Clock, TrendingUp, TrendingDown } from 'lucide-react';

function WeeklySummary({ weeklyData, goals }) {
  const totals = useMemo(() => {
    const commits = weeklyData.reduce((s, d) => s + d.commits, 0);
    const problems = weeklyData.reduce((s, d) => s + d.problems, 0);
    const hours = Math.round(weeklyData.reduce((s, d) => s + d.hours, 0) * 10) / 10;
    const bestDay = weeklyData.reduce((best, d) => (d.commits + d.problems) > (best.commits + best.problems) ? d : best, weeklyData[0]);
    return { commits, problems, hours, bestDay };
  }, [weeklyData]);

  const items = [
    { label: 'Commits', value: totals.commits, goal: goals.weekly.commits, icon: GitCommit, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Problems', value: totals.problems, goal: goals.weekly.problems, icon: Code2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Hours', value: totals.hours, goal: goals.weekly.hours, icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-900">Weekly Summary</h3>
        </div>
        <div className="space-y-3">
          {items.map((it) => {
            const pct = Math.min(100, Math.round((it.value / Math.max(1, it.goal)) * 100));
            const met = pct >= 100;
            return (
              <div key={it.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span className={`w-6 h-6 rounded-md ${it.bg} flex items-center justify-center`}>
                      <it.icon className={`w-3 h-3 ${it.color}`} />
                    </span>
                    {it.label}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{it.value} / {it.goal}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${met ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-slate-50 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Best Day:</span> {totals.bestDay?.name} ({totals.bestDay?.commits + totals.bestDay?.problems} activities)
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(WeeklySummary);
