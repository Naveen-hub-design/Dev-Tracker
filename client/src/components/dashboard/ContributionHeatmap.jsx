import CalendarHeatmap from 'react-calendar-heatmap';
import ChartCard from '../ui/ChartCard';
import EmptyState from '../ui/EmptyState';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Activity } from 'lucide-react';

function HeatmapSkeleton() {
  return (
    <ChartCard title="Activity (Last 6 Months)">
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-28 w-full" />
    </ChartCard>
  );
}

export default function ContributionHeatmap({ data = [], loading, empty }) {
  if (loading) return <HeatmapSkeleton />;

  if (empty || data.length === 0) {
    return (
      <ChartCard title="Activity (Last 6 Months)">
        <EmptyState
          icon={Activity}
          title="No contribution data"
          description="Connect your GitHub account to see your activity heatmap."
        />
      </ChartCard>
    );
  }

  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  return (
    <ChartCard title="Unified Coding Activity (Last 6 Months)">
      <CalendarHeatmap
        startDate={sixMonthsAgo}
        endDate={today}
        values={data}
        classForValue={(value) => {
          if (!value || !value.count || value.count <= 0) return 'color-empty';
          const count = value.count || 0;
          if (count <= 3) return 'color-scale-1';
          if (count <= 6) return 'color-scale-2';
          if (count <= 9) return 'color-scale-3';
          return 'color-scale-4';
        }}
        titleForValue={(value) => {
          if (!value || !value.count) return 'No activity';
          const d = value.details;
          if (d) {
            const parts = [];
            if (d.github) parts.push(`${d.github} commit${d.github > 1 ? 's' : ''}`);
            if (d.leetcode) parts.push(`${d.leetcode} LC solve${d.leetcode > 1 ? 's' : ''}`);
            if (d.codeforces) parts.push(`${d.codeforces} CF contest${d.codeforces > 1 ? 's' : ''}`);
            if (d.codechef) parts.push(`${d.codechef} CC contest${d.codechef > 1 ? 's' : ''}`);
            const detailStr = parts.length > 0 ? ` (${parts.join(', ')})` : '';
            return `${value.date}: ${value.count} contribution${value.count > 1 ? 's' : ''}${detailStr}`;
          }
          return `${value.date}: ${value.count} contribution${value.count > 1 ? 's' : ''}`;
        }}
      />
    </ChartCard>
  );
}
