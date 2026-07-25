import React, { useMemo } from 'react';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Award, Code, Clock, Globe } from 'lucide-react';

function ActivityTimeline({ data, loading }) {
  const activities = useMemo(() => {
    if (!data) return [];
    const items = [];

    if (data.totalSolved > 0) {
      items.push({
        id: 'total',
        icon: Code,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        title: `${data.totalSolved} problems solved`,
        subtitle: `${data.problemsSolved?.easy || 0} easy · ${data.problemsSolved?.medium || 0} medium · ${data.problemsSolved?.hard || 0} hard`,
      });
    }

    if (data.hackerBadge && data.hackerBadge !== 'None') {
      items.push({
        id: 'badge',
        icon: Award,
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        title: `Earned ${data.hackerBadge} badge`,
        subtitle: `HackerRank score: ${data.hackerRank}`,
      });
    }

    if (data.languages?.length > 0) {
      const top = data.languages[0];
      items.push({
        id: 'top-lang',
        icon: Code,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        title: `Top language: ${top.name}`,
        subtitle: `${top.percentage}% usage · ${top.count} challenges`,
      });
    }

    if (data.badges?.length > 0) {
      items.push({
        id: 'badges',
        icon: Award,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        title: `${data.badges.length} badges earned`,
        subtitle: data.badges.slice(0, 3).map((b) => b.name).join(', '),
      });
    }

    if (data.lastActive) {
      items.push({
        id: 'last-active',
        icon: Clock,
        color: 'text-slate-500',
        bg: 'bg-slate-50',
        title: 'Last active',
        subtitle: data.lastActive,
      });
    }

    return items.slice(0, 5);
  }, [data]);

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader title="Recent Activity" subtitle="Latest updates" />
      {activities.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No recent activity</p>
      ) : (
        <div className="mt-4 space-y-4" role="list" aria-label="Activity timeline">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-center gap-3" role="listitem">
                <div className={`p-2 rounded-lg ${item.bg} ${item.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                  <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default React.memo(ActivityTimeline);
