import React, { useMemo } from 'react';
import Card from '../ui/Card';
import FadeIn from './FadeIn';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import { GitCommit, Code, GitBranch, Clock, ArrowUpRight } from 'lucide-react';

const TYPE_CONFIG = {
  github: { icon: GitCommit, color: 'text-blue-500', bg: 'bg-blue-50' },
  leetcode: { icon: Code, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  hackerrank: { icon: GitBranch, color: 'text-green-500', bg: 'bg-green-50' },
  default: { icon: ArrowUpRight, color: 'text-slate-500', bg: 'bg-slate-50' },
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function FeedSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
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

function ActivityFeed({ data, loading }) {
  const items = useMemo(() => {
    if (!data) return [];
    return data.slice(0, 8);
  }, [data]);

  if (loading) return <FeedSkeleton />;

  if (!items.length) {
    return (
      <Card>
        <EmptyState
          icon={Clock}
          title="No recent activity"
          description="Your recent commits and solved problems will appear here."
        />
      </Card>
    );
  }

  return (
    <FadeIn>
      <Card>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-3" role="list" aria-label="Activity feed">
          {items.map((item, i) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.default;
            const Icon = config.icon;
            return (
              <div key={i} className="flex items-start gap-3 group" role="listitem">
                <div className={`p-2 rounded-lg ${config.bg} ${config.color} shrink-0 mt-0.5`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.description}</p>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 mt-0.5 tabular-nums">{timeAgo(item.time)}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </FadeIn>
  );
}

export default React.memo(ActivityFeed);
