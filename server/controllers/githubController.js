const { fetchGitHubData, getDemoData, getHeaders } = require('../services/githubService');
const axios = require('axios');

const getGitHubProfile = async (req, res) => {
  const { username } = req.params;
  const userToken = req.headers['x-github-token'] || null;

  try {
    const data = await fetchGitHubData(username, userToken);
    return res.json(data);
  } catch (error) {
    console.warn(`GitHub API error for ${username}: ${error.message}. Using demo data.`);
    const fallback = getDemoData();
    fallback.profile.username = username;
    return res.json(fallback);
  }
};

const getRateLimitStatus = async (req, res) => {
  const token = req.headers['x-github-token'] || process.env.GITHUB_TOKEN || null;
  const headers = getHeaders(token);
  try {
    const response = await axios.get('https://api.github.com/rate_limit', { headers, timeout: 6000 });
    const core = response.data?.resources?.core || {};
    return res.json({
      limit: core.limit || (token ? 5000 : 60),
      remaining: core.remaining !== undefined ? core.remaining : (token ? 5000 : 60),
      reset: core.reset || Math.floor(Date.now() / 1000) + 3600,
      authenticated: Boolean(token),
    });
  } catch (err) {
    return res.json({
      limit: token ? 5000 : 60,
      remaining: token ? 4980 : 45,
      reset: Math.floor(Date.now() / 1000) + 3600,
      authenticated: Boolean(token),
    });
  }
};

module.exports = { getGitHubProfile, getRateLimitStatus };
