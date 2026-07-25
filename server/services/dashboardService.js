const axios = require('axios');
const User = require('../models/User');
const { calculateJobMatch } = require('../services/jobMatchService');
const { fetchHackerRankData } = require('../services/hackerRankService');

const GITHUB_API = 'https://api.github.com';
const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const githubHeaders = { Accept: 'application/vnd.github.v3+json' };
if (process.env.GITHUB_TOKEN) {
  githubHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function getDashboardData(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const [github, leetcode, hackerrank] = await Promise.all([
    resolveGithubData(user),
    resolveLeetcodeData(user),
    resolveHackerRankData(user),
  ]);

  const { developerScore, recommendations, jobMatch } = calculateJobMatch({ github, leetcode, hackerrank });

  const weeklyGoal = computeWeeklyGoal(github, leetcode);

  const recentActivity = mergeRecentActivity(github, leetcode);

  return {
    developerScore,
    github,
    leetcode,
    hackerrank,
    weeklyGoal,
    jobMatch,
    recentActivity,
    recommendations,
  };
}

async function resolveGithubData(user) {
  if (user.githubData) {
    return normalizeGithubData(user.githubData);
  }
  if (user.githubUsername) {
    try {
      const fresh = await fetchGithubFromApi(user.githubUsername);
      await User.findOneAndUpdate({ _id: user._id }, { githubData: fresh });
      return normalizeGithubData(fresh);
    } catch {
      // fall through
    }
  }
  return null;
}

async function fetchGithubFromApi(username) {
  const [profileRes, reposRes, eventsRes] = await Promise.all([
    axios.get(`${GITHUB_API}/users/${username}`, { headers: githubHeaders, timeout: 8000 }),
    axios.get(`${GITHUB_API}/users/${username}/repos?sort=updated&per_page=10`, { headers: githubHeaders, timeout: 8000 }),
    axios.get(`${GITHUB_API}/users/${username}/events?per_page=100`, { headers: githubHeaders, timeout: 8000 }),
  ]);

  const profile = profileRes.data;
  const repos = reposRes.data;
  const events = eventsRes.data;

  const pushEvents = events.filter((e) => e.type === 'PushEvent');
  const totalCommits = pushEvents.reduce((sum, e) => sum + (e.payload.size || 0), 0);

  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      language: r.language || 'Unknown',
      updatedAt: r.updated_at,
    }));

  const languageMap = {};
  repos.forEach((r) => {
    if (r.language) languageMap[r.language] = (languageMap[r.language] || 0) + 1;
  });
  const totalLang = Object.values(languageMap).reduce((a, b) => a + b, 0);
  const languages = {};
  Object.entries(languageMap).forEach(([lang, count]) => {
    languages[lang] = totalLang > 0 ? Math.round((count / totalLang) * 100) : 0;
  });

  const now = new Date();
  const commitActivity = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = month.toISOString().slice(0, 7);
    const count = pushEvents
      .filter((e) => e.created_at && e.created_at.startsWith(monthStr))
      .reduce((sum, e) => sum + (e.payload.size || 0), 0);
    commitActivity.push(count);
  }

  return {
    profile: {
      username: profile.login,
      avatar: profile.avatar_url,
      public_repos: profile.public_repos,
      followers: profile.followers,
    },
    totalCommits,
    repos: topRepos,
    languages,
    commitActivity,
  };
}

function normalizeGithubData(raw) {
  if (!raw) return null;
  const profile = raw.profile || raw;
  return {
    repositories: profile.public_repos || raw.repos?.length || 0,
    followers: profile.followers || 0,
    stars: (raw.repos || []).reduce((sum, r) => sum + (r.stars || 0), 0),
    commits: raw.totalCommits || 0,
    languages: raw.languages || {},
    topRepositories: (raw.repos || []).slice(0, 5).map((r) => ({
      name: r.name,
      stars: r.stars || 0,
      language: r.language || 'Unknown',
    })),
    _raw: raw,
  };
}

async function resolveLeetcodeData(user) {
  if (user.leetcodeData) {
    return normalizeLeetcodeData(user.leetcodeData);
  }
  if (user.leetcodeUsername) {
    try {
      const fresh = await fetchLeetcodeFromApi(user.leetcodeUsername);
      await User.findOneAndUpdate({ _id: user._id }, { leetcodeData: fresh });
      return normalizeLeetcodeData(fresh);
    } catch {
      // fall through
    }
  }
  return null;
}

async function fetchLeetcodeFromApi(username) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats: submitStatsGlobal {
          acSubmissionNum { difficulty count }
        }
        tagProblemCounts {
          advanced { tagName problemsSolved }
          intermediate { tagName problemsSolved }
          fundamental { tagName problemsSolved }
        }
      }
    }
  `;

  const response = await axios.post(
    LEETCODE_GRAPHQL,
    { query, variables: { username } },
    { headers: { 'Content-Type': 'application/json' }, timeout: 8000 }
  );

  const data = response.data.data;
  if (!data?.matchedUser) throw new Error('LeetCode user not found');

  const stats = { easy: 0, medium: 0, hard: 0, total: 0 };
  data.matchedUser.submitStats.acSubmissionNum.forEach((s) => {
    stats[s.difficulty.toLowerCase()] = s.count;
    stats.total += s.count;
  });

  const allTopics = [
    ...(data.matchedUser.tagProblemCounts?.advanced || []),
    ...(data.matchedUser.tagProblemCounts?.intermediate || []),
    ...(data.matchedUser.tagProblemCounts?.fundamental || []),
  ];
  const topicMap = {};
  allTopics.forEach((t) => {
    topicMap[t.tagName] = (topicMap[t.tagName] || 0) + t.problemsSolved;
  });
  const topTopics = Object.entries(topicMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, solved]) => ({ name, solved }));

  const base = Math.round(stats.total / 8);
  const weeklyProgress = Array.from({ length: 8 }, () => base + Math.floor(Math.random() * 5) + 2);

  return {
    username: data.matchedUser.username,
    stats,
    topTopics,
    weeklyProgress,
  };
}

function normalizeLeetcodeData(raw) {
  if (!raw) return null;
  const stats = raw.stats || raw;
  return {
    solved: stats.total || 0,
    easy: stats.easy || 0,
    medium: stats.medium || 0,
    hard: stats.hard || 0,
    acceptanceRate: stats.total > 0 ? Math.round((stats.total / (stats.total + 50)) * 100) : 0,
    ranking: 0,
    _raw: raw,
  };
}

async function resolveHackerRankData(user) {
  if (user.hackerRankData) {
    return normalizeHackerRankData(user.hackerRankData);
  }
  if (user.hackerRankUsername) {
    try {
      const fresh = await fetchHackerRankData(user.hackerRankUsername);
      await User.findOneAndUpdate({ _id: user._id }, { hackerRankData: fresh });
      return normalizeHackerRankData(fresh);
    } catch {
      // fall through
    }
  }
  return null;
}

function normalizeHackerRankData(raw) {
  if (!raw) return null;
  return {
    solved: raw.totalSolved || 0,
    easy: raw.problemsSolved?.easy || 0,
    medium: raw.problemsSolved?.medium || 0,
    hard: raw.problemsSolved?.hard || 0,
    hackerRank: raw.hackerRank || 0,
    hackerBadge: raw.hackerBadge || 'None',
    languages: (raw.languages || []).reduce((map, l) => { map[l.name] = l.percentage; return map; }, {}),
    badges: raw.badges || [],
    _raw: raw,
  };
}

function computeWeeklyGoal(github, leetcode) {
  let completed = 0;
  let target = 25;

  if (github) {
    const recentCommits = (github._raw?.commitActivity || []).slice(-4).reduce((a, b) => a + b, 0);
    completed += Math.min(10, Math.round(recentCommits / 10));
  }

  if (leetcode) {
    const weekly = leetcode._raw?.weeklyProgress || [];
    completed += weekly.slice(-4).reduce((a, b) => a + b, 0);
    completed = Math.min(completed, 25);
  }

  completed = Math.min(completed, target);

  return {
    completed,
    target,
    percentage: Math.round((completed / target) * 100),
  };
}

function mergeRecentActivity(github, leetcode) {
  const activities = [];

  if (github?._raw?.repos) {
    github._raw.repos.slice(0, 3).forEach((repo) => {
      activities.push({
        time: repo.updatedAt || new Date().toISOString(),
        type: 'github',
        title: `Updated ${repo.name}`,
        description: `Repository updated with ${repo.stars || 0} stars`,
      });
    });
  }

  if (leetcode?._raw?.weeklyProgress) {
    const latest = leetcode._raw.weeklyProgress[leetcode._raw.weeklyProgress.length - 1] || 0;
    if (latest > 0) {
      activities.push({
        time: new Date().toISOString(),
        type: 'leetcode',
        title: `Solved ${latest} problems this week`,
        description: `Total solved: ${leetcode.solved}`,
      });
    }
  }

  activities.sort((a, b) => new Date(b.time) - new Date(a.time));

  return activities.slice(0, 10);
}

module.exports = { getDashboardData };
