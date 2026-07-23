import { useMemo } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { useUser } from '../context/UserContext';
import { demoGitHub } from '../api/github';
import { demoLeetCode } from '../api/leetcode';
import { calculateJobMatchScore } from '../utils/jobMatchScore';
import { generateActionPlan } from '../utils/helpers';
import { getBadgeColor } from '../utils/helpers';
import JobMatchRing from '../components/JobMatchRing';

const breakdownLabels = {
  leetcodeSolved: 'LeetCode Problems',
  hardProblems: 'Hard Problems',
  githubRepos: 'GitHub Repos',
  githubCommits: 'GitHub Commits',
  projects: 'React/Node Projects',
  streak: 'Weekly Streak',
};

const breakdownMax = {
  leetcodeSolved: 20,
  hardProblems: 15,
  githubRepos: 15,
  githubCommits: 15,
  projects: 20,
  streak: 10,
};

export default function JobMatchPage() {
  const { githubUser } = useUser();
  const { data: gitData, loading } = useGitHub();

  const gitHubData = useMemo(() => {
    if (gitData) return gitData;
    if (!githubUser) return demoGitHub;
    return null;
  }, [gitData, githubUser]);

  const leetCodeData = demoLeetCode;

  const jobMatch = useMemo(() => {
    if (!gitHubData) return null;
    return calculateJobMatchScore(
      {
        public_repos: gitHubData.public_repos,
        totalCommits: gitHubData.totalCommits,
        repos: gitHubData.repos,
        commitActivity: gitHubData.commitActivity,
      },
      leetCodeData
    );
  }, [gitHubData]);

  const actionPlan = useMemo(() => {
    if (!jobMatch) return [];
    return generateActionPlan(jobMatch.totalScore, jobMatch.breakdown);
  }, [jobMatch]);

  const getStrengthLabel = (score, max) => {
    const pct = score / max;
    if (pct >= 0.8) return { label: 'Strong', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (pct >= 0.4) return { label: 'Moderate', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Weak', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Job Match Score</h1>
        <p className="text-sm text-slate-500 mt-1">See how ready you are for top tech companies</p>
      </div>

      {!jobMatch ? (
        <div className="card text-center py-12">
          <p className="text-slate-500">Connect a GitHub account to see your job match score</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative flex items-center justify-center">
              <JobMatchRing score={jobMatch.totalScore} size={220} strokeWidth={14} loading={loading} />
            </div>

            <div className="card">
              <h3 className="section-title">Score Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(jobMatch.breakdown).map(([key, value]) => {
                  const max = breakdownMax[key] || 10;
                  const strength = getStrengthLabel(value, max);
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700">{breakdownLabels[key] || key}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${strength.color}`}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-700"
                          style={{
                            width: `${(value / Math.max(max, 1)) * 100}%`,
                            backgroundColor: value >= max * 0.8 ? '#10B981' : value >= max * 0.4 ? '#F59E0B' : '#EF4444',
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{value}/{max} pts</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">Company Readiness</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobMatch.companyReadiness.map((company) => (
                <div key={company.company} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-slate-900">{company.company}</h4>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getBadgeColor(company.status)}`}>
                      {company.status}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, (jobMatch.totalScore / company.threshold) * 100)}%`,
                        backgroundColor: company.status === 'Ready' ? '#10B981' : company.status === 'Almost' ? '#F59E0B' : '#EF4444',
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    {jobMatch.totalScore}/{company.threshold} needed
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">This Week's Action Plan</h3>
            <p className="text-xs text-slate-400 mb-3">Focus on these areas to improve your score</p>
            <div className="space-y-3">
              {actionPlan.length > 0 ? (
                actionPlan.map((plan, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-violet-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-medium shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-700">{plan}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">
                  Great job! You're scoring well across all areas. Keep maintaining your streak.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
