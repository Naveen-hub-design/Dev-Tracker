const axios = require('axios');

const GITHUB_API = 'https://api.github.com';

const demoData = {
  profile: {
    username: 'arun-dev',
    avatar: 'https://avatars.githubusercontent.com/u/9919',
    public_repos: 18,
    followers: 42,
    following: 15,
    bio: 'Full Stack Engineer & Open Source Enthusiast',
    location: 'Bangalore, India',
    company: 'DevTrack Org',
    blog: 'https://devtrack.io',
    createdAt: '2021-03-15T10:00:00Z',
  },
  totalCommits: 342,
  totalStars: 169,
  totalForks: 48,
  totalOpenIssues: 7,
  prCount: 26,
  rateLimit: {
    limit: 5000,
    remaining: 4982,
    reset: Math.floor(Date.now() / 1000) + 3600,
    authenticated: true,
  },
  repos: [
    {
      name: 'devtrack-dashboard',
      fullName: 'arun-dev/devtrack-dashboard',
      description: 'Comprehensive developer productivity tracker with live analytics & ATS resume matcher',
      stars: 87,
      forks: 24,
      openIssues: 3,
      language: 'JavaScript',
      size: 4200,
      htmlUrl: 'https://github.com/arun-dev/devtrack-dashboard',
      homepage: 'https://devtrack.io',
      license: 'MIT',
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      name: 'ecommerce-app',
      fullName: 'arun-dev/ecommerce-app',
      description: 'Production-ready headless eCommerce platform built with React, Redux & Tailwind',
      stars: 34,
      forks: 11,
      openIssues: 1,
      language: 'TypeScript',
      size: 3100,
      htmlUrl: 'https://github.com/arun-dev/ecommerce-app',
      homepage: '',
      license: 'Apache-2.0',
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      name: 'dsa-solutions',
      fullName: 'arun-dev/dsa-solutions',
      description: 'Clean, optimized solutions to 450+ LeetCode and Codeforces algorithms',
      stars: 22,
      forks: 8,
      openIssues: 0,
      language: 'C++',
      size: 1500,
      htmlUrl: 'https://github.com/arun-dev/dsa-solutions',
      homepage: '',
      license: 'MIT',
      updatedAt: new Date().toISOString(),
    },
    {
      name: 'portfolio-site',
      fullName: 'arun-dev/portfolio-site',
      description: 'High-performance interactive 3D developer portfolio powered by Three.js',
      stars: 15,
      forks: 3,
      openIssues: 1,
      language: 'CSS',
      size: 890,
      htmlUrl: 'https://github.com/arun-dev/portfolio-site',
      homepage: '',
      license: 'MIT',
      updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      name: 'node-api-boilerplate',
      fullName: 'arun-dev/node-api-boilerplate',
      description: 'Scalable Node.js & Express REST microservice scaffold with JWT & SQLite/Postgres',
      stars: 11,
      forks: 2,
      openIssues: 2,
      language: 'Python',
      size: 1200,
      htmlUrl: 'https://github.com/arun-dev/node-api-boilerplate',
      homepage: '',
      license: 'MIT',
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ],
  languages: { JavaScript: 45, TypeScript: 25, 'C++': 15, CSS: 10, Python: 5 },
  commitActivity: [38, 45, 52, 61, 72, 74],
  commitVelocity: {
    monthlyTrend: [38, 45, 52, 61, 72, 74],
    avgMonthly: 57,
    peakMonth: 'Current Month',
    peakCount: 74,
  },
  fetchedAt: new Date().toISOString(),
};

function getHeaders(userToken) {
  const token = userToken || process.env.GITHUB_TOKEN;
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (token && typeof token === 'string' && token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }
  return headers;
}

async function fetchGitHubData(username, userToken = null) {
  const headers = getHeaders(userToken);
  const isAuth = Boolean(headers.Authorization);

  const [profileRes, reposRes, eventsRes] = await Promise.all([
    axios.get(`${GITHUB_API}/users/${username}`, { headers, timeout: 9000 }),
    axios.get(`${GITHUB_API}/users/${username}/repos?sort=updated&per_page=30`, { headers, timeout: 9000 }),
    axios.get(`${GITHUB_API}/users/${username}/events?per_page=100`, { headers, timeout: 9000 }),
  ]);

  const profile = profileRes.data;
  const repos = reposRes.data;
  const events = eventsRes.data;

  // Rate limit details from response headers
  const rateLimit = {
    limit: parseInt(profileRes.headers['x-ratelimit-limit'] || (isAuth ? 5000 : 60), 10),
    remaining: parseInt(profileRes.headers['x-ratelimit-remaining'] || 0, 10),
    reset: parseInt(profileRes.headers['x-ratelimit-reset'] || Math.floor(Date.now() / 1000) + 3600, 10),
    authenticated: isAuth,
  };

  const totalCommits = calculateTotalCommits(events);
  const prCount = events.filter((e) => e.type === 'PullRequestEvent').length;
  const deepRepos = formatDeepRepos(repos);
  const languages = calculateLanguageDistribution(repos);
  const commitActivity = generateCommitActivity(events);

  const totalStars = deepRepos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const totalForks = deepRepos.reduce((acc, r) => acc + (r.forks || 0), 0);
  const totalOpenIssues = deepRepos.reduce((acc, r) => acc + (r.openIssues || 0), 0);

  const peakCount = Math.max(...commitActivity, 0);
  const avgMonthly = commitActivity.length
    ? Math.round(commitActivity.reduce((a, b) => a + b, 0) / commitActivity.length)
    : 0;

  return {
    profile: {
      username: profile.login,
      avatar: profile.avatar_url,
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following || 0,
      bio: profile.bio || '',
      location: profile.location || '',
      company: profile.company || '',
      blog: profile.blog || '',
      createdAt: profile.created_at,
    },
    totalCommits,
    totalStars,
    totalForks,
    totalOpenIssues,
    prCount,
    rateLimit,
    repos: deepRepos,
    languages,
    commitActivity,
    commitVelocity: {
      monthlyTrend: commitActivity,
      avgMonthly,
      peakCount,
      peakMonth: 'Recent Activity',
    },
    fetchedAt: new Date().toISOString(),
  };
}

function calculateTotalCommits(events) {
  return events
    .filter((e) => e.type === 'PushEvent')
    .reduce((sum, e) => sum + (e.payload?.size || e.payload?.commits?.length || 0), 0);
}

function formatDeepRepos(repos) {
  return repos
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 12)
    .map((r) => ({
      name: r.name,
      fullName: r.full_name || r.name,
      description: r.description || '',
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      openIssues: r.open_issues_count || 0,
      language: r.language || 'Other',
      size: r.size || 0,
      htmlUrl: r.html_url || `https://github.com/${r.name}`,
      homepage: r.homepage || '',
      license: r.license?.spdx_id || r.license?.name || null,
      isFork: Boolean(r.fork),
      updatedAt: r.updated_at,
      pushedAt: r.pushed_at || r.updated_at,
    }));
}

function calculateLanguageDistribution(repos) {
  const languageMap = {};
  repos.forEach((r) => {
    if (r.language) {
      languageMap[r.language] = (languageMap[r.language] || 0) + (r.size || 1);
    }
  });

  const totalLang = Object.values(languageMap).reduce((a, b) => a + b, 0);
  const languages = {};
  Object.entries(languageMap).forEach(([lang, count]) => {
    languages[lang] = totalLang > 0 ? Math.round((count / totalLang) * 100) : 0;
  });
  return languages;
}

function generateCommitActivity(events) {
  const pushEvents = events.filter((e) => e.type === 'PushEvent');
  const now = new Date();
  const activity = [];

  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = month.toISOString().slice(0, 7);
    const count = pushEvents
      .filter((e) => e.created_at && e.created_at.startsWith(monthStr))
      .reduce((sum, e) => sum + (e.payload?.size || e.payload?.commits?.length || 0), 0);
    activity.push(count);
  }

  return activity;
}

function getDemoData() {
  return { ...demoData, fetchedAt: new Date().toISOString() };
}

module.exports = { fetchGitHubData, getDemoData, getHeaders };
