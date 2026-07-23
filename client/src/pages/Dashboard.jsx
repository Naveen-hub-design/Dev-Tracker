import { useGitHub } from '../hooks/useGitHub';
import { useUser } from '../context/UserContext';
import { demoGitHub } from '../api/github';
import { demoLeetCode } from '../api/leetcode';
import { calculateJobMatchScore } from '../utils/jobMatchScore';
import { generateWeeklyReport } from '../utils/helpers';
import MetricCard from '../components/MetricCard';
import ActivityHeatmap from '../components/ActivityHeatmap';
import SkillBar from '../components/SkillBar';
import StreakTracker from '../components/StreakTracker';
import { Flame, CheckCircle, GitCommit, Target } from 'lucide-react';
import { useMemo } from 'react';

export default function Dashboard() {
  const { githubUser } = useUser();
  const { data: gitData, loading: gitLoading } = useGitHub();

  const gitHubData = useMemo(() => {
    if (gitData) return gitData;
    if (!githubUser) return demoGitHub;
    return null;
  }, [gitData, githubUser]);

  const leetCodeData = demoLeetCode;

  const jobMatch = useMemo(() => {
    if (!gitHubData) return null;
    return calculateJobMatchScore(
      { public_repos: gitHubData.public_repos, totalCommits: gitHubData.totalCommits, repos: gitHubData.repos, commitActivity: gitHubData.commitActivity },
      leetCodeData
    );
  }, [gitHubData]);

  const weeklyReport = useMemo(() => {
    return generateWeeklyReport(gitHubData, leetCodeData);
  }, [gitHubData]);

  const skills = useMemo(() => {
    if (!gitHubData) return [];
    const langs = gitHubData.languages || {};
    const totalLangs = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
    return [
      { name: 'JavaScript', level: Math.round((langs.JavaScript || 0) / totalLangs * 100) || 70, color: '#F59E0B' },
      { name: 'React', level: Math.round((langs.React || 0) / totalLangs * 100) || 50, color: '#3B82F6' },
      { name: 'Node.js', level: Math.round(((langs.JavaScript || 0) + (langs.Python || 0)) / totalLangs * 100) || 45, color: '#10B981' },
      { name: 'SQL', level: 40, color: '#8B5CF6' },
      { name: 'DSA', level: leetCodeData.total > 100 ? 75 : leetCodeData.total > 50 ? 55 : 30, color: '#EF4444' },
      { name: 'System Design', level: 35, color: '#EC4899' },
    ];
  }, [gitHubData]);

  const streakData = useMemo(() => ({
    days: [],
    stats: {
      currentStreak: gitHubData?.commitActivity?.filter(c => c > 0).slice(-7).length || 5,
      longestStreak: 12,
      totalActive: gitHubData?.commitActivity?.reduce((a, b) => a + (b > 0 ? 1 : 0), 0) || 21,
    }
  }), [gitHubData]);

  const isLoading = gitLoading && !!githubUser;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          {githubUser ? `Showing data for @${githubUser}` : 'Enter a GitHub username to connect'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Current Streak"
          value={streakData.stats.currentStreak}
          icon={Flame}
          color="text-amber-500"
          badge={{ text: `${streakData.stats.currentStreak} days`, color: 'bg-amber-100 text-amber-700' }}
          loading={isLoading}
        />
        <MetricCard
          label="Problems Solved"
          value={leetCodeData.total}
          icon={CheckCircle}
          color="text-emerald-500"
          badge={{ text: `${leetCodeData.easy}E / ${leetCodeData.medium}M / ${leetCodeData.hard}H`, color: 'bg-emerald-100 text-emerald-700' }}
        />
        <MetricCard
          label="Total Commits"
          value={gitHubData?.totalCommits || 0}
          icon={GitCommit}
          color="text-blue-500"
          badge={{ text: `Last 6 months`, color: 'bg-blue-100 text-blue-700' }}
          loading={isLoading}
        />
        <MetricCard
          label="Job Match"
          value={`${jobMatch?.totalScore || 0}%`}
          icon={Target}
          color="text-purple-500"
          badge={{ text: jobMatch?.companyReadiness?.[2]?.status || 'N/A', color: 'bg-purple-100 text-purple-700' }}
        />
      </div>

      <ActivityHeatmap loading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillBar skills={skills} loading={isLoading} />
        <StreakTracker data={streakData} loading={isLoading} />
      </div>

      <div className="card">
        <h3 className="section-title">Weekly Report</h3>
        <p className="text-xs text-slate-400 mb-3">AI-generated recommendations based on your activity</p>
        <div className="space-y-3">
          {weeklyReport.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-slate-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
