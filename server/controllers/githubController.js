const axios = require('axios');

const GITHUB_API = 'https://api.github.com';

const demoResponse = {
  profile: { username: 'arun-dev', avatar: 'https://avatars.githubusercontent.com/u/9919', public_repos: 18, followers: 42 },
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

const getGitHubProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const headers = { Accept: 'application/vnd.github.v3+json' };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [profileRes, reposRes, eventsRes] = await Promise.all([
      axios.get(`${GITHUB_API}/users/${username}`, { headers, timeout: 8000 }),
      axios.get(`${GITHUB_API}/users/${username}/repos?sort=updated&per_page=10`, { headers, timeout: 8000 }),
      axios.get(`${GITHUB_API}/users/${username}/events?per_page=100`, { headers, timeout: 8000 }),
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
    repos.forEach((r) => { if (r.language) languageMap[r.language] = (languageMap[r.language] || 0) + 1; });
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
      const count = pushEvents.filter((e) => e.created_at && e.created_at.startsWith(monthStr))
        .reduce((sum, e) => sum + (e.payload.size || 0), 0);
      commitActivity.push(count);
    }

    return res.json({
      profile: { username: profile.login, avatar: profile.avatar_url, public_repos: profile.public_repos, followers: profile.followers },
      totalCommits, repos: topRepos, languages, commitActivity,
    });
  } catch (error) {
    console.warn(`GitHub API error for ${username}: ${error.message}. Using demo data.`);
    return res.json({ username, ...demoResponse });
  }
};

module.exports = { getGitHubProfile };
