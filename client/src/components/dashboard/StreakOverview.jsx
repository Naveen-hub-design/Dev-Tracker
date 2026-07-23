import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Flame, Zap, Calendar } from 'lucide-react';

function StreakSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array.from({ length: 28 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-md" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center space-y-1">
            <Skeleton className="h-6 w-10 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function getDayColor(count) {
  if (count <= 2) return 'bg-green-200';
  if (count <= 5) return 'bg-green-400';
  if (count <= 8) return 'bg-green-500';
  return 'bg-green-600';
}

export default function StreakOverview({ days = [], stats, loading, empty }) {
  if (loading) return <StreakSkeleton />;

  if (empty || !stats) {
    return (
      <Card>
        <EmptyState
          icon={Flame}
          title="No streak data"
          description="Start contributing to build your coding streak."
        />
      </Card>
    );
  }

  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Streak Tracker (28 Days)</h3>
      <div className="grid grid-cols-7 gap-1 mb-5">
        {weekLabels.map((label) => (
          <div key={label} className="text-center text-[10px] text-slate-400 font-medium">
            {label}
          </div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`w-full aspect-square rounded-md transition-colors ${
              day.active ? getDayColor(day.count) : 'bg-slate-100'
            }`}
            title={`${day.date}: ${day.count} contributions`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-lg font-bold text-slate-900">{stats.currentStreak}</span>
          </div>
          <p className="text-[11px] text-slate-500">Current Streak</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-purple-500 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-lg font-bold text-slate-900">{stats.longestStreak}</span>
          </div>
          <p className="text-[11px] text-slate-500">Longest</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-500 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-lg font-bold text-slate-900">{stats.totalActive}</span>
          </div>
          <p className="text-[11px] text-slate-500">Active Days</p>
        </div>
      </div>
    </Card>
  );
}
