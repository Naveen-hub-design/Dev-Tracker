import { useState, useCallback } from 'react';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { useAnalyticsData } from '../features/analytics/hooks/useAnalyticsData';
import {
  AnalyticsHeader,
  OverviewCards,
  TrendChart,
  GitHubAnalytics,
  LeetCodeAnalytics,
  CompetitiveProgrammingAnalytics,
  RadarSkills,
  AchievementsTimeline,
  RecommendationPanel,
  UnifiedActivityHeatmap,
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

function exportAnalyticsCSV(analyticsData, dashboard) {
  const points = analyticsData?.timeSeries || [];
  const ghTotal = dashboard?.github?.commits || 0;
  const lcTotal = dashboard?.leetcode?.solved || 0;
  const cfRating = dashboard?.codeforces?.rating || dashboard?.codeforces?.profile?.rating || 0;
  const ccRating = dashboard?.codechef?.currentRating || dashboard?.codechef?.rating || 0;
  const ccStars = dashboard?.codechef?.stars || '1★';

  const headers = ['Date', 'GitHub Commits', 'LeetCode Problems', 'Total Day Activity', 'Codeforces Rating', 'CodeChef Rating', 'CodeChef Stars'];
  const rows = points.map((p) => [
    p.date,
    p.github || 0,
    p.leetcode || 0,
    p.total || 0,
    cfRating,
    ccRating,
    `"${ccStars}"`,
  ]);

  const csvContent = [
    `# DevTrack Comprehensive Multi-Platform Analytics Export`,
    `# Export Date: ${new Date().toISOString()}`,
    `# GitHub Commits: ${ghTotal} | LeetCode Solved: ${lcTotal} | Codeforces Rating: ${cfRating} | CodeChef Rating: ${ccRating} (${ccStars})`,
    headers.join(','),
    ...rows.map((r) => r.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `devtrack-analytics-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

  const handleExportCSV = useCallback(() => {
    exportAnalyticsCSV(analyticsData, dashboard);
  }, [analyticsData, dashboard]);

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

      <UnifiedActivityHeatmap dashboard={dashboard} />

      <GitHubAnalytics
        data={dashboard}
        monthlyData={analyticsData?.monthlySeries || []}
        loading={loading}
      />

      <LeetCodeAnalytics data={dashboard} loading={loading} />

      <CompetitiveProgrammingAnalytics data={dashboard} loading={loading} />

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
