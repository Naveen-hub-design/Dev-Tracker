import React, { useMemo } from 'react';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Skeleton } from '../ui/LoadingSkeleton';

function SkillProgress({ data, loading }) {
  const skills = useMemo(() => {
    if (!data?.languages?.length) return [];
    return data.languages.slice(0, 6).map((lang) => ({
      name: lang.name,
      percentage: lang.percentage || 0,
      count: lang.count || 0,
    }));
  }, [data]);

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const barColors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-red-500', 'bg-purple-500', 'bg-pink-500',
  ];

  return (
    <Card>
      <SectionHeader title="Skill Progress" subtitle="Language proficiency" />
      {skills.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No skill data</p>
      ) : (
        <div className="mt-4 space-y-4" role="list" aria-label="Skill progress">
          {skills.map((skill, i) => (
            <div key={skill.name} role="listitem">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                <span className="text-xs text-slate-500">{skill.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColors[i % barColors.length]}`}
                  style={{ width: `${Math.min(100, skill.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default React.memo(SkillProgress);
