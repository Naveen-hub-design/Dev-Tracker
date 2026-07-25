import React, { useMemo } from 'react';
import Card from '../ui/Card';
import FadeIn from './FadeIn';
import AnimatedNumber from './AnimatedNumber';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Code, Award, BarChart3 } from 'lucide-react';

const DIFF_COLORS = {
  easy: { bar: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  medium: { bar: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
  hard: { bar: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
};

function SectionSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-36 mb-5" />
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[1, 2].map((i) => (
          <div key={i} className="text-center space-y-1">
            <Skeleton className="h-7 w-14 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="flex justify-between mb-1"><Skeleton className="h-3 w-12" /><Skeleton className="h-3 w-10" /></div>
            <Skeleton className="h-2.5 w-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function DifficultyBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const colors = DIFF_COLORS[color];

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${colors.text}`}>{label}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} font-medium`}>{pct}%</span>
        </div>
        <span className="text-xs font-bold text-slate-900 tabular-nums">{count}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function LeetCodeSection({ data, loading }) {
  if (loading) return <SectionSkeleton />;

  if (!data) {
    return (
      <Card>
        <EmptyState
          icon={Code}
          title="No LeetCode data"
          description="Connect your LeetCode account to see analytics."
        />
      </Card>
    );
  }

  return (
    <FadeIn>
      <Card>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">LeetCode Analytics</h3>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 tabular-nums"><AnimatedNumber value={data.solved || 0} /></p>
            <p className="text-[11px] text-slate-500 mt-0.5">Problems Solved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {data.ranking ? <AnimatedNumber value={data.ranking} /> : '—'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Ranking</p>
          </div>
        </div>

        <div className="space-y-3.5 mb-5">
          <DifficultyBar label="Easy" count={data.easy || 0} total={data.solved || 1} color="easy" />
          <DifficultyBar label="Medium" count={data.medium || 0} total={data.solved || 1} color="medium" />
          <DifficultyBar label="Hard" count={data.hard || 0} total={data.solved || 1} color="hard" />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-600">Acceptance Rate</span>
          </div>
          <span className="text-sm font-bold text-slate-900 tabular-nums">{data.acceptanceRate || 0}%</span>
        </div>
      </Card>
    </FadeIn>
  );
}

export default React.memo(LeetCodeSection);
