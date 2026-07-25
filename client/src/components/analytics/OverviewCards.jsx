import Card from '../ui/Card';
import { Skeleton } from '../ui/LoadingSkeleton';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Github,
  Code2,
  Flame,
  Zap,
} from 'lucide-react';

const iconMap = {
  score: Target,
  github: Github,
  leetcode: Code2,
  weeklyGoal: Flame,
  streak: Zap,
};

const colorMap = {
  score: 'text-purple-500 bg-purple-50',
  github: 'text-blue-500 bg-blue-50',
  leetcode: 'text-emerald-500 bg-emerald-50',
  weeklyGoal: 'text-amber-500 bg-amber-50',
  streak: 'text-cyan-500 bg-cyan-50',
};

function TrendIcon({ trend }) {
  if (trend > 0) return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
  if (trend < 0) return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
}

function MiniSparkline({ data, color }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const w = 64;
  const h = 24;
  const step = w / (data.length - 1 || 1);

  const points = data.map((v, i) => `${i * step},${h - (v / max) * h}`).join(' ');

  return (
    <svg width={w} height={h} className="mt-2">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

function OverviewCardSkeleton() {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="h-5 w-24 mt-3" />
    </Card>
  );
}

export default function OverviewCards({ dashboard, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <OverviewCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const gh = dashboard?.github || {};
  const lc = dashboard?.leetcode || {};
  const wg = dashboard?.weeklyGoal || {};

  const cards = [
    {
      key: 'score',
      label: 'Developer Score',
      value: dashboard?.developerScore ?? 0,
      trend: 5,
      sparkline: [40, 45, 52, 58, 65, 72, dashboard?.developerScore ?? 0],
    },
    {
      key: 'github',
      label: 'GitHub Activity',
      value: gh.commits ?? 0,
      trend: gh.commits > 100 ? 12 : -3,
      sparkline: dashboard?.github?._raw?.commitActivity || [10, 20, 30, 25, 40, 35],
    },
    {
      key: 'leetcode',
      label: 'LeetCode Problems',
      value: lc.solved ?? 0,
      trend: lc.solved > 50 ? 8 : 2,
      sparkline: dashboard?.leetcode?._raw?.weeklyProgress || [5, 8, 6, 10, 7, 12],
    },
    {
      key: 'weeklyGoal',
      label: 'Weekly Goal',
      value: `${wg.completed ?? 0}/${wg.target ?? 25}`,
      trend: wg.percentage > 50 ? 6 : -2,
      sparkline: [5, 8, 12, 15, 18, wg.completed ?? 0],
    },
    {
      key: 'streak',
      label: 'Current Streak',
      value: `${Math.min(7, Math.round((wg.percentage ?? 0) / 15))}d`,
      trend: 0,
      sparkline: [3, 5, 4, 6, 5, Math.min(7, Math.round((wg.percentage ?? 0) / 15))],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = iconMap[card.key];
        return (
          <Card key={card.key}>
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
              </div>
              <div className={`p-2 rounded-xl ${colorMap[card.key]}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendIcon trend={card.trend} />
              <span className={`text-xs font-medium ${card.trend > 0 ? 'text-emerald-600' : card.trend < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                {card.trend > 0 ? '+' : ''}{card.trend}%
              </span>
              <span className="text-xs text-slate-400">vs last period</span>
            </div>
            <MiniSparkline data={card.sparkline} color={card.trend >= 0 ? '#10B981' : '#EF4444'} />
          </Card>
        );
      })}
    </div>
  );
}
