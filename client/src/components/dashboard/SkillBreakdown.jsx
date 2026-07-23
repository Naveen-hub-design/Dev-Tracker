import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import { TrendingUp } from 'lucide-react';

function SkillSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-28 mb-5" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="flex justify-between mb-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function SkillBreakdown({ skills = [], loading, empty }) {
  if (loading) return <SkillSkeleton />;

  if (empty || skills.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={TrendingUp}
          title="No skill data"
          description="Connect your accounts to see your skill breakdown."
        />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Skill Level</h3>
      <div className="space-y-3.5">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-700">{skill.name}</span>
              <span className="text-xs text-slate-500 tabular-nums">{skill.level}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${skill.level}%`,
                  backgroundColor: skill.color || '#3B82F6',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
