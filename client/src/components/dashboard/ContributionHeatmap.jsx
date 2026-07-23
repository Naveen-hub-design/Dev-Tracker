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
    <ChartCard title="Activity (Last 6 Months)">
      <CalendarHeatmap
        startDate={sixMonthsAgo}
        endDate={today}
        values={data}
        classForValue={(value) => {
          if (!value) return 'fill-slate-100';
          const count = value.count || 0;
          if (count <= 0) return 'fill-slate-100';
          if (count <= 3) return 'color-scale-1';
          if (count <= 6) return 'color-scale-2';
          if (count <= 9) return 'color-scale-3';
          return 'color-scale-4';
        }}
        titleForValue={(value) => {
          if (!value) return 'No activity';
          return `${value.date}: ${value.count || 0} contributions`;
        }}
      />
    </ChartCard>
  );
}
