import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Trophy, GitBranch, Code2, GitCommit, Medal } from 'lucide-react';

const colorMap = {
  blue: 'bg-blue-100 text-blue-600 border-blue-200',
  emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  purple: 'bg-purple-100 text-purple-600 border-purple-200',
  amber: 'bg-amber-100 text-amber-600 border-amber-200',
  red: 'bg-red-100 text-red-600 border-red-200',
};

const dotColorMap = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

function TimelineSkeleton() {
  return (
    <Card>
      <Skeleton className="h-5 w-36 mb-5" />
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <Skeleton className="h-3 w-3 rounded-full" />
              {i < 4 && <Skeleton className="w-0.5 h-12 mt-1" />}
            </div>
            <div className="flex-1 pb-2">
              <Skeleton className="h-4 w-36 mb-1.5" />
              <Skeleton className="h-3 w-48 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function AchievementsTimeline({ achievements = [], loading }) {
  if (loading) return <TimelineSkeleton />;

  if (achievements.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Trophy}
          title="No achievements yet"
          description="Start coding to earn achievements!"
        />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">Achievements</h3>
      <p className="text-xs text-slate-500 mb-5">Your milestones and accomplishments</p>
      <div className="space-y-0">
        {achievements.map((ach, i) => (
          <div key={i} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${dotColorMap[ach.color] || 'bg-slate-400'} ring-4 ring-white z-10`} />
              {i < achievements.length - 1 && (
                <div className="w-0.5 bg-slate-100 flex-1 min-h-[32px]" />
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                    {ach.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{ach.description}</p>
                </div>
                <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${colorMap[ach.color] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {ach.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
