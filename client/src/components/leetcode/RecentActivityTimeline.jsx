import React, { useMemo } from 'react';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { Skeleton } from '../ui/LoadingSkeleton';
import { TrendingUp, BookOpen, Calendar } from 'lucide-react';

function RecentActivityTimeline({ data, loading }) {
  const activities = useMemo(() => {
    if (!data) return [];
    const items = [];

    if (data.total > 0) {
      items.push({
        id: 'total',
        icon: BookOpen,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        title: `${data.total} problems solved`,
        subtitle: `${data.easy} easy · ${data.medium} medium · ${data.hard} hard`,
      });
    }

    if (data.weeklyProgress?.length > 0) {
      const latest = data.weeklyProgress[data.weeklyProgress.length - 1];
      const prev = data.weeklyProgress.length > 1 ? data.weeklyProgress[data.weeklyProgress.length - 2] : 0;
      const trend = latest - prev;
      items.push({
        id: 'latest-week',
        icon: TrendingUp,
        color: trend >= 0 ? 'text-emerald-500' : 'text-red-500',
        bg: trend >= 0 ? 'bg-emerald-50' : 'bg-red-50',
        title: `${latest} problems this week`,
        subtitle: trend >= 0 ? `+${trend} from last week` : `${trend} from last week`,
      });
    }

    if (data.topics?.length > 0) {
      const strongest = data.topics.reduce((a, b) => a.solved > b.solved ? a : b);
      items.push({
        id: 'strongest-topic',
        icon: Calendar,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        title: `Strongest: ${strongest.name}`,
        subtitle: `${strongest.solved} problems solved`,
      });
    }

    return items.slice(0, 4);
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

export default React.memo(RecentActivityTimeline);
