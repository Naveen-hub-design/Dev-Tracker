import MetricCard from '../MetricCard';
import { Flame, CheckCircle, GitCommit, Target } from 'lucide-react';

export default function MetricCards({ streakData, leetcodeData, githubData, jobMatch, loading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Current Streak"
        value={streakData?.currentStreak ?? 0}
        icon={Flame}
        color="text-amber-500"
        badge={{
          text: `${streakData?.currentStreak ?? 0} days`,
          color: 'bg-amber-50 text-amber-700',
        }}
        loading={loading}
      />
      <MetricCard
        label="Problems Solved"
        value={leetcodeData?.total ?? 0}
        icon={CheckCircle}
        color="text-emerald-500"
        badge={{
          text: `${leetcodeData?.easy ?? 0}E / ${leetcodeData?.medium ?? 0}M / ${leetcodeData?.hard ?? 0}H`,
          color: 'bg-emerald-50 text-emerald-700',
        }}
        loading={loading}
      />
      <MetricCard
        label="Total Commits"
        value={githubData?.totalCommits ?? 0}
        icon={GitCommit}
        color="text-blue-500"
        badge={{ text: 'Last 6 months', color: 'bg-blue-50 text-blue-700' }}
        loading={loading}
      />
      <MetricCard
        label="Job Match"
        value={`${jobMatch?.totalScore ?? 0}%`}
        icon={Target}
        color="text-purple-500"
        badge={{
          text: jobMatch?.companyReadiness?.[2]?.status ?? 'N/A',
          color: 'bg-purple-50 text-purple-700',
        }}
        loading={loading}
      />
    </div>
  );
}
