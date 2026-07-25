import React, { useMemo } from 'react';
import Card from '../ui/Card';
import FadeIn from './FadeIn';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Target, Calendar } from 'lucide-react';

function GoalSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-28 mb-4" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2.5 w-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function GoalBar({ label, completed, target, color, icon: Icon }) {
  const pct = target > 0 ? Math.min(Math.round((completed / target) * 100), 100) : 0;

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
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: pct >= 70 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444',
          }}
        />
      </div>
      <p className="text-[11px] text-slate-400 mt-1.5 tabular-nums">{completed} / {target} completed</p>
    </div>
  );
}

function GoalProgress({ weeklyGoal, loading }) {
  const monthly = useMemo(() => {
    if (!weeklyGoal) return { completed: 0, target: 100 };
    return {
      completed: Math.min((weeklyGoal.completed || 0) * 4, 100),
      target: 100,
    };
  }, [weeklyGoal]);

  if (loading) return <GoalSkeleton />;

  return (
    <FadeIn>
      <Card>
        <h3 className="text-sm font-semibold text-slate-900 mb-5">Goals</h3>
        <div className="space-y-6">
          <GoalBar
            label="Weekly Goal"
            completed={weeklyGoal?.completed || 0}
            target={weeklyGoal?.target || 25}
            color="text-blue-500"
            icon={Target}
          />
          <GoalBar
            label="Monthly Goal"
            completed={monthly.completed}
            target={monthly.target}
            color="text-purple-500"
            icon={Calendar}
          />
        </div>
      </Card>
    </FadeIn>
  );
}

export default React.memo(GoalProgress);
