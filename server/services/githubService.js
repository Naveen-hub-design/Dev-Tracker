const axios = require('axios');

const GITHUB_API = 'https://api.github.com';

const githubHeaders = { Accept: 'application/vnd.github.v3+json' };
if (process.env.GITHUB_TOKEN) {
  githubHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const demoData = {
  profile: {
    username: 'arun-dev',
    avatar: 'https://avatars.githubusercontent.com/u/9919',
    public_repos: 18,
    followers: 42,
  },
  totalCommits: 342,
  repos: [
    { name: 'devtrack-dashboard', stars: 87, language: 'JavaScript', updatedAt: '2 days ago' },
    { name: 'ecommerce-app', stars: 34, language: 'React', updatedAt: '5 days ago' },
    { name: 'dsa-solutions', stars: 22, language: 'JavaScript', updatedAt: 'today' },
    { name: 'portfolio-site', stars: 15, language: 'CSS', updatedAt: '1 week ago' },
    { name: 'node-api-boilerplate', stars: 11, language: 'Python', updatedAt: '3 days ago' },
  ],
  languages: { JavaScript: 52, React: 28, CSS: 12, Python: 8 },
  commitActivity: [38, 45, 52, 61, 72, 74],
};

async function fetchGitHubData(username) {
  const [profileRes, reposRes, eventsRes] = await Promise.all([
    axios.get(`${GITHUB_API}/users/${username}`, { headers: githubHeaders, timeout: 8000 }),
    axios.get(`${GITHUB_API}/users/${username}/repos?sort=updated&per_page=10`, { headers: githubHeaders, timeout: 8000 }),
    axios.get(`${GITHUB_API}/users/${username}/events?per_page=100`, { headers: githubHeaders, timeout: 8000 }),
  ]);

  const profile = profileRes.data;
  const repos = reposRes.data;
  const events = eventsRes.data;

  const totalCommits = calculateTotalCommits(events);
  const topRepos = formatTopRepos(repos);
  const languages = calculateLanguageDistribution(repos);
  const commitActivity = generateCommitActivity(events);

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

function calculateTotalCommits(events) {
  return events
    .filter((e) => e.type === 'PushEvent')
    .reduce((sum, e) => sum + (e.payload.size || 0), 0);
}

function formatTopRepos(repos) {
  return repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      language: r.language || 'Unknown',
      updatedAt: r.updated_at,
    }));
}

function calculateLanguageDistribution(repos) {
  const languageMap = {};
  repos.forEach((r) => {
    if (r.language) {
      languageMap[r.language] = (languageMap[r.language] || 0) + 1;
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
      .reduce((sum, e) => sum + (e.payload.size || 0), 0);
    activity.push(count);
  }

  return activity;
}

function getDemoData() {
  return { ...demoData };
}

module.exports = { fetchGitHubData, getDemoData };
