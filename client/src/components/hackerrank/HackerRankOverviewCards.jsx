import React, { useMemo } from 'react';
import Card from '../ui/Card';
import { MetricCardSkeleton } from '../ui/LoadingSkeleton';
import { CheckCircle, Shield, Code, Award } from 'lucide-react';

const METRICS = [
  { key: 'totalSolved', label: 'Problems Solved', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
  { key: 'badge', label: 'Badge Level', icon: Shield, color: 'text-green-500', bg: 'bg-green-50' },
  { key: 'languages', label: 'Languages', icon: Code, color: 'text-purple-500', bg: 'bg-purple-50' },
  { key: 'badges', label: 'Badges Earned', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
];

function HackerRankOverviewCards({ data, loading }) {
  const values = useMemo(() => {
    if (!data) return {};
    return {
      totalSolved: data.totalSolved || 0,
      badge: data.hackerBadge || 'None',
      languages: (data.languages || []).length,
      badges: (data.badges || []).length,
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

export default React.memo(HackerRankOverviewCards);
