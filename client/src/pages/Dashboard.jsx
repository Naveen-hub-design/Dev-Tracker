import { useGitHub } from '../hooks/useGitHub';
import { useUser } from '../context/UserContext';
import { calculateJobMatchScore } from '../utils/jobMatchScore';
import { generateWeeklyReport } from '../utils/helpers';
import PageContainer from '../components/ui/PageContainer';
import {
  MetricCards,
  ContributionHeatmap,
  SkillBreakdown,
  StreakOverview,
  WeeklyRecommendations,
  ScoreGauge,
} from '../components/dashboard';
import { useMemo } from 'react';

export default function Dashboard() {
  const { githubUser } = useUser();
  const { data: gitData, loading: gitLoading } = useGitHub();

  const gitHubData = useMemo(() => gitData || null, [gitData]);

  const jobMatch = useMemo(() => {
    if (!gitHubData) return null;
    return calculateJobMatchScore(
      {
        public_repos: gitHubData.public_repos,
        totalCommits: gitHubData.totalCommits,
        repos: gitHubData.repos,
        commitActivity: gitHubData.commitActivity,
      },
      null
    );
  }, [gitHubData]);

  const weeklyReport = useMemo(
    () => generateWeeklyReport(gitHubData, null),
    [gitHubData]
  );

  const skills = useMemo(() => {
    if (!gitHubData) return [];
    const langs = gitHubData.languages || {};
    const totalLangs = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
    return [
      { name: 'JavaScript', level: Math.round(((langs.JavaScript || 0) / totalLangs) * 100) || 0, color: '#F59E0B' },
      { name: 'React', level: Math.round(((langs.React || 0) / totalLangs) * 100) || 0, color: '#3B82F6' },
      { name: 'Node.js', level: Math.round((((langs.JavaScript || 0) + (langs.Python || 0)) / totalLangs) * 100) || 0, color: '#10B981' },
      { name: 'Python', level: Math.round(((langs.Python || 0) / totalLangs) * 100) || 0, color: '#8B5CF6' },
      { name: 'CSS', level: Math.round(((langs.CSS || 0) / totalLangs) * 100) || 0, color: '#EC4899' },
    ].filter((s) => s.level > 0);
  }, [gitHubData]);

  const streakStats = useMemo(() => {
    if (!gitHubData) return null;
    const activity = gitHubData.commitActivity || [];
    return {
      currentStreak: activity.filter((c) => c > 0).slice(-7).length,
      longestStreak: Math.max(...activity, 0),
      totalActive: activity.reduce((a, b) => a + (b > 0 ? 1 : 0), 0),
    };
  }, [gitHubData]);

  const streakDays = useMemo(() => {
    if (!gitHubData?.commitActivity) return [];
    const activity = gitHubData.commitActivity;
    return activity.slice(-28).map((count, i) => ({
      date: `day-${i}`,
      count,
      active: count > 0,
    }));
  }, [gitHubData]);

  const contributionData = useMemo(() => {
    if (!gitHubData?.commitActivity) return [];
    const today = new Date();
    return gitHubData.commitActivity.slice(-180).map((count, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (180 - i));
      return {
        date: date.toISOString().slice(0, 10),
        count,
      };
    });
  }, [gitHubData]);

  const hasData = !!gitHubData;
  const isLoading = gitLoading && !!githubUser;

  const subtitle = useMemo(() => {
    if (isLoading) return 'Loading your data...';
    if (githubUser && hasData) return `Showing data for @${githubUser}`;
    if (githubUser) return `Fetching data for @${githubUser}...`;
    return 'Connect your GitHub account to get started';
  }, [isLoading, githubUser, hasData]);

  return (
    <PageContainer title="Dashboard" subtitle={subtitle}>
      <MetricCards
        streakData={streakStats}
        leetcodeData={null}
        githubData={gitHubData}
        jobMatch={jobMatch}
        loading={isLoading}
      />

      <ContributionHeatmap
        data={contributionData}
        loading={isLoading}
        empty={!hasData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillBreakdown
          skills={skills}
          loading={isLoading}
          empty={!hasData}
        />
        <StreakOverview
          days={streakDays}
          stats={streakStats}
          loading={isLoading}
          empty={!hasData}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyRecommendations
          recommendations={weeklyReport}
          loading={isLoading}
          empty={!hasData}
        />
        <ScoreGauge
          score={jobMatch?.totalScore ?? 0}
          companyReadiness={jobMatch?.companyReadiness ?? []}
          loading={isLoading}
          empty={!hasData}
        />
      </div>
    </PageContainer>
  );
}
