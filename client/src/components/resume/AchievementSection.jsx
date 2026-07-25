import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import { Award, Star, Code2, Flame, Trophy } from 'lucide-react';

const ICONS = [Award, Star, Code2, Flame, Trophy];

function AchievementSection({ achievements, codingProfiles }) {
  const items = achievements || [];
  const cp = codingProfiles || {};

  return (
    <div className="space-y-4">
      <SectionHeader title="Achievements" subtitle="Your coding accomplishments" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((achievement, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
              <div className="p-1.5 rounded-lg bg-amber-50 ring-1 ring-amber-500/10">
                <Icon className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">{achievement}</span>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-3 mt-2">
        {cp.github?.username && (
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-center">
            <p className="text-lg font-bold text-slate-900">{cp.github.commits}</p>
            <p className="text-[10px] text-slate-400">GitHub Commits</p>
          </div>
        )}
        {cp.leetcode?.username && (
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-center">
            <p className="text-lg font-bold text-slate-900">{cp.leetcode.solved}</p>
            <p className="text-[10px] text-slate-400">LC Problems</p>
          </div>
        )}
        {cp.hackerrank?.username && (
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-center">
            <p className="text-lg font-bold text-slate-900">{cp.hackerrank.solved}</p>
            <p className="text-[10px] text-slate-400">HR Problems</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(AchievementSection);
