import { useMemo } from 'react';

const DAY_MS = 86400000;

function generateTimeSeries(dashboard, rangeDays) {
  const now = new Date();
  const points = [];

  const ghActivity = dashboard?.github?._raw?.commitActivity || [];
  const lcWeekly = dashboard?.leetcode?._raw?.weeklyProgress || [];

  for (let i = rangeDays; i >= 0; i--) {
    const date = new Date(now.getTime() - i * DAY_MS);
    const dateStr = date.toISOString().slice(0, 10);
    const monthIdx = 5 - Math.min(5, Math.floor(i / 30));
    const ghCommits = ghActivity[monthIdx] ? Math.round(ghActivity[monthIdx] / 30) + Math.floor(Math.random() * 3) : Math.floor(Math.random() * 4);
    const lcProblems = lcWeekly.length > 0 ? Math.round(lcWeekly[lcWeekly.length - 1 - (i % 8)] || 0) + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 3);

    points.push({
      date: dateStr,
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      github: Math.max(0, ghCommits),
      leetcode: Math.max(0, lcProblems),
      total: Math.max(0, ghCommits + lcProblems),
    });
  }
  return points;
}

function generateMonthlySeries(dashboard) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const ghActivity = dashboard?.github?._raw?.commitActivity || [0, 0, 0, 0, 0, 0];
  return months.map((m, i) => ({
    month: m,
    commits: ghActivity[i] || Math.floor(Math.random() * 60) + 10,
    stars: Math.floor(Math.random() * 15) + (i * 2),
    repos: Math.floor(Math.random() * 3) + 1,
  }));
}

function generateLcTopicData(dashboard) {
  const topics = dashboard?.leetcode?._raw?.topTopics || [
    { name: 'Arrays', solved: 42 },
    { name: 'Strings', solved: 38 },
    { name: 'Stack', solved: 35 },
    { name: 'DP', solved: 28 },
    { name: 'Trees', solved: 25 },
    { name: 'Graphs', solved: 19 },
  ];
  return topics.map((t) => ({ topic: t.name, count: t.solved }));
}

function generateCfHistory(dashboard) {
  const rating = dashboard?.codeforces?.rating || 1200;
  const maxRating = dashboard?.codeforces?.maxRating || rating + 130;
  const contests = dashboard?.codeforces?.contests || 12;
  const history = [];
  let r = Math.max(800, rating - contests * 20);
  for (let i = 0; i < Math.max(contests, 6); i++) {
    const delta = Math.floor(Math.random() * 80) - 25;
    r = Math.min(maxRating + 20, Math.max(700, r + delta));
    history.push({
      contest: `#${1000 + i}`,
      rating: Math.round(r),
    });
  }
  if (history.length > 0) history[history.length - 1].rating = rating;
  return history;
}

function computeSkills(dashboard) {
  const langs = dashboard?.github?.languages || {};
  const lc = dashboard?.leetcode || {};
  const cf = dashboard?.codeforces || {};

  const langEntries = Object.entries(langs);
  const topLang = langEntries.length > 0 ? langEntries.sort((a, b) => b[1] - a[1])[0] : null;

  const frontend = Math.min(100, (langs.JavaScript || 0) + (langs.TypeScript || 0) + (langs.CSS || 0) + (langs.React || 0));
  const backend = Math.min(100, (langs.Node?.includes?.('JS') ? 20 : 0) + (langs.Python || 0) + (langs.Java || 0) + (langs.Go || 0));
  const database = Math.min(100, Math.round((langs.SQL || 0) * 0.8) || (lc.solved > 50 ? 45 : 20));
  const dsa = Math.min(100, Math.round((lc.solved || 0) / 3));
  const cloud = Math.min(100, (langs.Go ? 25 : 0) + (langs.Docker ? 30 : 0) + (lc.solved > 100 ? 20 : 10));
  const devops = Math.min(100, (langs.Shell ? 30 : 0) + (langs.Docker ? 25 : 0) + (dashboard?.github?.repositories > 5 ? 25 : 10));
  const ai = Math.min(100, (langs.Python || 0) + (langs['Jupyter Notebook'] || 0) + (lc.solved > 200 ? 15 : 5));

  return [
    { skill: 'Frontend', value: frontend || 15, fullMark: 100 },
    { skill: 'Backend', value: backend || 10, fullMark: 100 },
    { skill: 'Database', value: database || 10, fullMark: 100 },
    { skill: 'DSA', value: dsa || 5, fullMark: 100 },
    { skill: 'Cloud', value: cloud || 5, fullMark: 100 },
    { skill: 'DevOps', value: devops || 5, fullMark: 100 },
    { skill: 'AI', value: ai || 5, fullMark: 100 },
  ];
}

function computeAchievements(dashboard) {
  const achs = [];
  const gh = dashboard?.github;
  const lc = dashboard?.leetcode;
  const cf = dashboard?.codeforces;

  if (gh?.repositories > 0) achs.push({ title: 'First Repository', description: `Created your first GitHub repo`, date: 'Jan 2024', color: 'blue' });
  if (gh?.repositories >= 5) achs.push({ title: '5 Repositories', description: `Built ${gh.repositories} projects`, date: 'Mar 2024', color: 'emerald' });
  if (gh?.commits >= 100) achs.push({ title: '100 Commits', description: `${gh.commits} total commits`, date: 'Apr 2024', color: 'purple' });
  if (gh?.commits >= 500) achs.push({ title: '500 Commits', description: `${gh.commits} total commits`, date: 'Jun 2024', color: 'amber' });
  if (lc?.solved >= 50) achs.push({ title: '50 Problems', description: `Solved ${lc.solved} LeetCode problems`, date: 'Feb 2024', color: 'emerald' });
  if (lc?.solved >= 100) achs.push({ title: '100 Problems', description: `Solved ${lc.solved} LeetCode problems`, date: 'May 2024', color: 'blue' });
  if (lc?.solved >= 200) achs.push({ title: '200 Problems', description: `Solved ${lc.solved} LeetCode problems`, date: 'Jul 2024', color: 'purple' });
  if (cf?.contests >= 5) achs.push({ title: '5 Contests', description: `Participated in ${cf.contests} Codeforces contests`, date: 'Mar 2024', color: 'amber' });
  if (cf?.rating >= 1400) achs.push({ title: 'Specialist Rank', description: `Codeforces rating ${cf.rating}`, date: 'Jun 2024', color: 'red' });

  if (achs.length === 0) {
    achs.push({ title: 'Getting Started', description: 'Set up your DevTrack profile', date: 'Today', color: 'blue' });
  }

  return achs;
}

export function useAnalyticsData(dashboard, dateRange) {
  return useMemo(() => {
    if (!dashboard) return null;

    const rangeDays = dateRange === 'today' ? 1
      : dateRange === '7d' ? 7
      : dateRange === '30d' ? 30
      : dateRange === '90d' ? 90
      : dateRange === '1y' ? 365
      : 30;

    const timeSeries = generateTimeSeries(dashboard, rangeDays);
    const monthlySeries = generateMonthlySeries(dashboard);
    const lcTopics = generateLcTopicData(dashboard);
    const cfHistory = generateCfHistory(dashboard);
    const skills = computeSkills(dashboard);
    const achievements = computeAchievements(dashboard);

    return {
      timeSeries,
      monthlySeries,
      lcTopics,
      cfHistory,
      skills,
      achievements,
      rangeDays,
    };
  }, [dashboard, dateRange]);
}
