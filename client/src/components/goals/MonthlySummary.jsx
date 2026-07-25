import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

function MonthlySummary({ monthlyData, goals }) {
  const stats = useMemo(() => {
    const now = new Date().getMonth();
    const current = monthlyData[now] || { commits: 0, problems: 0, hours: 0 };
    const prev = monthlyData[now - 1 >= 0 ? now - 1 : 11] || { commits: 0, problems: 0, hours: 0 };

    const delta = (curr, prv) => prv === 0 ? 0 : Math.round(((curr - prv) / prv) * 100);

    return {
      commits: { value: current.commits, goal: goals.monthly.commits, pct: Math.round((current.commits / Math.max(1, goals.monthly.commits)) * 100), change: delta(current.commits, prev.commits) },
      problems: { value: current.problems, goal: goals.monthly.problems, pct: Math.round((current.problems / Math.max(1, goals.monthly.problems)) * 100), change: delta(current.problems, prev.problems) },
      hours: { value: Math.round(current.hours * 10) / 10, goal: goals.monthly.hours, pct: Math.round((current.hours / Math.max(1, goals.monthly.hours)) * 100), change: delta(current.hours, prev.hours) },
    };
  }, [monthlyData, goals]);

  const ChangeIcon = ({ value }) => {
    if (value > 0) return <TrendingUp className="w-3 h-3 text-emerald-500" />;
    if (value < 0) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-slate-400" />;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-violet-500" />
          <h3 className="text-sm font-bold text-slate-900">Monthly Summary</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(stats).map(([key, s]) => (
            <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 capitalize">{key}</span>
                  <span className="text-xs text-slate-500">{s.value} / {s.goal}</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                  <motion.div
                    className={`h-full rounded-full ${s.pct >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, s.pct)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ChangeIcon value={s.change} />
                <span className={`text-xs font-semibold ${s.change > 0 ? 'text-emerald-600' : s.change < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                  {s.change > 0 ? '+' : ''}{s.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(MonthlySummary);
