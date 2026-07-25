import { useState, useCallback } from 'react';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { useAnalyticsData } from '../features/analytics/hooks/useAnalyticsData';
import {
  AnalyticsHeader,
  OverviewCards,
  TrendChart,
  GitHubAnalytics,
  LeetCodeAnalytics,
  RadarSkills,
  AchievementsTimeline,
  RecommendationPanel,
} from '../components/analytics';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

function ErrorState({ error, onRetry }) {
  return (
    <div className="space-y-6">
      <AnalyticsHeader dateRange="30d" onDateRangeChange={() => {}} onRefresh={onRetry} loading={false} />
      <EmptyState
        icon={AlertTriangle}
        title={error.message}
        description={
          error.type === 'auth'
            ? 'Please log in again to view analytics.'
            : 'Something went wrong while loading analytics.'
        }
        action={
          <Button onClick={onRetry} variant="primary" size="sm">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        }
      />
    </div>
  );
}

function handleExportCSV() {
  const link = document.createElement('a');
  link.href = 'data:text/csv;charset=utf-8,Date,GitHub,LeetCode,Total\n';
  link.download = 'devtrack-analytics.csv';
  link.click();
}

function handleExportPDF() {
  window.print();
}

export default function Analytics() {
  const { dashboard, loading, error, refetch } = useDashboard();
  const [dateRange, setDateRange] = useState('30d');

  const analyticsData = useAnalyticsData(dashboard, dateRange);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (error) {
    return <ErrorState error={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="space-y-8">
      <AnalyticsHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onRefresh={handleRefresh}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        loading={loading}
      />

      <OverviewCards dashboard={dashboard} loading={loading} />

      <TrendChart data={analyticsData?.timeSeries || []} loading={loading} />

      <GitHubAnalytics
        data={dashboard}
        monthlyData={analyticsData?.monthlySeries || []}
        loading={loading}
      />

      <LeetCodeAnalytics data={dashboard} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RadarSkills skills={analyticsData?.skills || []} loading={loading} />
        <AchievementsTimeline achievements={analyticsData?.achievements || []} loading={loading} />
      </div>

      <RecommendationPanel
        recommendations={dashboard?.recommendations || []}
        loading={loading}
      />
    </div>
  );
}
