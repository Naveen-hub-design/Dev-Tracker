import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Target, Calendar } from 'lucide-react';

function GoalBar({ label, completed, target, color, icon: Icon }) {
  const pct = target > 0 ? Math.min(Math.round((completed / target) * 100), 100) : 0;
  const barColor = pct >= 70 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-xs font-bold text-slate-900 tabular-nums">{pct}%</span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="text-[11px] text-slate-400 mt-1.5 tabular-nums">{completed} / {target} completed</p>
    </div>
  );
}

function LCGoalTracker({ data }) {
  const weekly = useMemo(() => {
    if (!data?.weeklyProgress?.length) return { completed: 0, target: 10 };
    const lastWeek = data.weeklyProgress[data.weeklyProgress.length - 1] || 0;
    const avg = Math.round(data.weeklyProgress.reduce((a, b) => a + b, 0) / data.weeklyProgress.length);
    return { completed: lastWeek, target: Math.max(avg + 3, lastWeek, 5) };
  }, [data?.weeklyProgress]);

  const monthly = useMemo(() => {
    if (!data?.weeklyProgress?.length) return { completed: 0, target: 40 };
    const total = data.weeklyProgress.reduce((a, b) => a + b, 0);
    return { completed: total, target: Math.max(total + 10, 40) };
  }, [data?.weeklyProgress]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card>
        <SectionHeader title="Goal Tracker" subtitle="Track your progress" />
        <div className="mt-5 space-y-6">
          <GoalBar label="Weekly Goal" completed={weekly.completed} target={weekly.target} color="text-blue-500" icon={Target} />
          <GoalBar label="Monthly Goal" completed={monthly.completed} target={monthly.target} color="text-purple-500" icon={Calendar} />
        </div>
      </Card>
    </motion.div>
  );
}

export default React.memo(LCGoalTracker);
