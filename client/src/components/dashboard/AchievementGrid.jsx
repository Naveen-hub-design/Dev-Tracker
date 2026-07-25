import React, { useMemo } from 'react';
import Card from '../ui/Card';
import FadeIn from './FadeIn';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Trophy, Flame, Star, Code, GitBranch, Target, Award, Lock, Zap } from 'lucide-react';

const ACHIEVEMENTS = [
  { id: 'first-commit', title: 'First Commit', desc: 'Pushed your first commit', Icon: GitBranch, check: (d) => (d?.github?.commits || 0) > 0 },
  { id: 'problem-solver', title: 'Problem Solver', desc: 'Solved 50+ problems', Icon: Code, check: (d) => ((d?.leetcode?.solved || 0) + (d?.hackerrank?.solved || 0)) >= 50 },
  { id: 'century-club', title: 'Century Club', desc: 'Solved 100+ problems', Icon: Trophy, check: (d) => ((d?.leetcode?.solved || 0) + (d?.hackerrank?.solved || 0)) >= 100 },
  { id: 'star-collector', title: 'Star Collector', desc: 'Earned 50+ stars', Icon: Star, check: (d) => (d?.github?.stars || 0) >= 50 },
  { id: 'streak-master', title: 'Streak Master', desc: '7+ day coding streak', Icon: Flame, check: (d) => {
    const a = d?.github?._raw?.commitActivity;
    if (!a) return false;
    let c = 0;
    for (let i = a.length - 1; i >= 0; i--) { if (a[i] > 0) c++; else break; }
    return c >= 7;
  }},
  { id: 'hard-hitter', title: 'Hard Hitter', desc: 'Solved 10+ hard problems', Icon: Zap, check: (d) => (d?.leetcode?.hard || 0) >= 10 },
  { id: 'repo-owner', title: 'Repo Owner', desc: 'Created 10+ repositories', Icon: Target, check: (d) => (d?.github?.repositories || 0) >= 10 },
  { id: 'polyglot', title: 'Polyglot', desc: 'Used 3+ programming languages', Icon: Award, check: (d) => Object.keys(d?.github?.languages || {}).length >= 3 },
];

function AchSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </Card>
  );
}

function AchievementCard({ achievement, unlocked }) {
  return (
    <div className={`relative p-3 rounded-xl border transition-all duration-200 ${
      unlocked
        ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
        : 'bg-slate-50 border-slate-100 opacity-60'
    }`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
        unlocked ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
      }`}>
        {unlocked ? <achievement.Icon className="w-4.5 h-4.5" /> : <Lock className="w-4 h-4" />}
      </div>
      <p className={`text-xs font-semibold ${unlocked ? 'text-slate-900' : 'text-slate-500'}`}>{achievement.title}</p>
      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{achievement.desc}</p>
      {unlocked && (
        <div className="absolute top-2 right-2">
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Unlocked</span>
        </div>
      )}
    </div>
  );
}

function AchievementGrid({ dashboard, loading }) {
  const unlocked = useMemo(() => {
    if (!dashboard) return new Set();
    return new Set(ACHIEVEMENTS.filter((a) => a.check(dashboard)).map((a) => a.id));
  }, [dashboard]);

  if (loading) return <AchSkeleton />;

  return (
    <FadeIn>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Achievements</h3>
          <span className="text-[11px] text-slate-500 font-medium">{unlocked.size}/{ACHIEVEMENTS.length} unlocked</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map((ach) => (
            <AchievementCard key={ach.id} achievement={ach} unlocked={unlocked.has(ach.id)} />
          ))}
        </div>
      </Card>
    </FadeIn>
  );
}

export default React.memo(AchievementGrid);
