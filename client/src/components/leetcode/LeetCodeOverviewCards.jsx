import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { MetricCardSkeleton } from '../ui/LoadingSkeleton';
import { CheckCircle, Brain, BarChart3, AlertTriangle } from 'lucide-react';

const METRICS = [
  { key: 'total', label: 'Total Solved', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
  { key: 'easy', label: 'Easy', icon: Brain, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { key: 'medium', label: 'Medium', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-50' },
  { key: 'hard', label: 'Hard', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
];

function LeetCodeOverviewCards({ data, loading }) {
  const values = useMemo(() => {
    if (!data) return {};
    return {
      total: data.total || 0,
      easy: data.easy || 0,
      medium: data.medium || 0,
      hard: data.hard || 0,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map(({ key, label, icon: Icon, color, bg }) => (
        <Card key={key}>
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">{values[key]}</p>
            </div>
            <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default React.memo(LeetCodeOverviewCards);
