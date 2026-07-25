import React, { useMemo } from 'react';
import FadeIn from './FadeIn';
import { Flame, CheckCircle, GitBranch, Star, GitCommit, Target } from 'lucide-react';

const CARDS = [
  { key: 'streak', label: 'Coding Streak', Icon: Flame, ring: 'ring-amber-500/10', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  { key: 'solved', label: 'Problems Solved', Icon: CheckCircle, ring: 'ring-emerald-500/10', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { key: 'repos', label: 'Repositories', Icon: GitBranch, ring: 'ring-blue-500/10', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { key: 'stars', label: 'GitHub Stars', Icon: Star, ring: 'ring-yellow-500/10', iconBg: 'bg-yellow-50', iconColor: 'text-yellow-600' },
  { key: 'commits', label: 'Total Commits', Icon: GitCommit, ring: 'ring-purple-500/10', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { key: 'goal', label: 'Weekly Goal', Icon: Target, ring: 'ring-rose-500/10', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
];

function QuickStatCard({ card, value, sub, loading }) {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ring-1 ${card.ring} ${card.iconBg}`}>
          <card.Icon className={`w-4 h-4 ${card.iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
        {loading ? (
          <span className="inline-block h-7 w-14 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse" />
        ) : value}
      </p>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{sub}</p>
    </div>
  );
}

function QuickStats({ dashboard, loading }) {
  const gh = dashboard?.github;
  const lc = dashboard?.leetcode;
  const hr = dashboard?.hackerrank;
  const goal = dashboard?.weeklyGoal;

  const streak = useMemo(() => {
    const activity = gh?._raw?.commitActivity;
    if (!activity) return 0;
    let count = 0;
    for (let i = activity.length - 1; i >= 0; i--) {
      if (activity[i] > 0) count++;
      else break;
    }
    return count;
  }, [gh]);

  const totalSolved = (lc?.solved || 0) + (hr?.solved || 0);

  const values = useMemo(() => ({
    streak,
    solved: totalSolved,
    repos: gh?.repositories || 0,
    stars: gh?.stars || 0,
    commits: gh?.commits || 0,
    goal: goal ? `${goal.completed}/${goal.target}` : '—',
  }), [streak, totalSolved, gh, goal]);

  const subs = useMemo(() => ({
    streak: `${streak} consecutive day${streak !== 1 ? 's' : ''}`,
    solved: `${lc?.solved || 0} LC${hr?.solved ? ` + ${hr.solved} HR` : ''}`,
    repos: `${gh?.followers || 0} followers`,
    stars: `Across ${gh?.repositories || 0} repos`,
    commits: `Last 6 months`,
    goal: `${goal?.percentage || 0}% complete`,
  }), [streak, lc, hr, gh, goal]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
      {CARDS.map((card, i) => (
        <FadeIn key={card.key} delay={i * 50}>
          <QuickStatCard card={card} value={values[card.key]} sub={subs[card.key]} loading={loading} />
        </FadeIn>
      ))}
    </div>
  );
}

export default React.memo(QuickStats);
